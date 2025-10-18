import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeKey || !webhookSecret) {
      throw new Error('Stripe keys não configuradas');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('Stripe signature missing');
    }

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook recebido:', event.type);

    // Processar eventos do Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout completado:', session.id);

        const userId = session.metadata?.user_id;
        if (!userId) {
          console.error('user_id não encontrado nos metadados');
          break;
        }

        // Atualizar status da assinatura
        await supabaseClient
          .from('profiles')
          .update({
            subscription_status: 'active',
            stripe_subscription_id: session.subscription as string,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', userId);

        // Criar notificação
        await supabaseClient.rpc('create_notification', {
          p_user_id: userId,
          p_message: '🎉 Pagamento confirmado! Estamos gerando seus planos personalizados. Você será notificado em até 48h.',
          p_type: 'payment_success'
        });

        // Disparar geração de planos
        try {
          const generatePlansUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-plans`;
          await fetch(generatePlansUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({ user_id: userId }),
          });
          console.log('Geração de planos iniciada para:', userId);
        } catch (genError) {
          console.error('Erro ao iniciar geração de planos:', genError);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Pagamento de invoice bem sucedido:', invoice.id);

        if (!invoice.subscription) break;

        // Buscar assinatura para pegar o período
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        
        // Buscar usuário pela subscription_id
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id, discount_remaining')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (profile) {
          // Atualizar período da assinatura
          await supabaseClient
            .from('profiles')
            .update({
              subscription_status: 'active',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', profile.id);

          // Decrementar desconto se tiver
          if (profile.discount_remaining > 0) {
            await supabaseClient
              .from('profiles')
              .update({
                discount_remaining: profile.discount_remaining - 1,
              })
              .eq('id', profile.id);
          }

          // Criar notificação
          await supabaseClient.rpc('create_notification', {
            p_user_id: profile.id,
            p_message: '✅ Pagamento da mensalidade confirmado! Sua assinatura continua ativa.',
            p_type: 'payment_success'
          });
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Falha no pagamento:', invoice.id);

        if (!invoice.subscription) break;

        // Buscar usuário pela subscription_id
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', invoice.subscription as string)
          .single();

        if (profile) {
          await supabaseClient
            .from('profiles')
            .update({ subscription_status: 'past_due' })
            .eq('id', profile.id);

          // Criar notificação
          await supabaseClient.rpc('create_notification', {
            p_user_id: profile.id,
            p_message: '⚠️ Houve um problema com seu pagamento. Por favor, atualize seus dados de pagamento para continuar com acesso aos planos.',
            p_type: 'payment_failed'
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Assinatura cancelada:', subscription.id);

        // Buscar usuário pela subscription_id
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (profile) {
          await supabaseClient
            .from('profiles')
            .update({ 
              subscription_status: 'canceled',
              stripe_subscription_id: null,
            })
            .eq('id', profile.id);

          // Criar notificação
          await supabaseClient.rpc('create_notification', {
            p_user_id: profile.id,
            p_message: '❌ Sua assinatura foi cancelada. Você pode reativar a qualquer momento.',
            p_type: 'subscription_canceled'
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Assinatura atualizada:', subscription.id);

        // Buscar usuário pela subscription_id
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (profile) {
          await supabaseClient
            .from('profiles')
            .update({
              subscription_status: subscription.status as any,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', profile.id);
        }

        break;
      }

      default:
        console.log('Evento não tratado:', event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro no webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
