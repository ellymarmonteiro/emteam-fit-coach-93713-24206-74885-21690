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
      apiVersion: '2024-11-20.acacia',
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
        console.log('✅ Checkout completado:', session.id);

        const userId = session.metadata?.user_id;
        if (!userId) {
          console.error('❌ user_id não encontrado nos metadados');
          break;
        }

        console.log('👤 Atualizando perfil do usuário:', userId);

        // Atualizar status da assinatura
        await supabaseClient
          .from('profiles')
          .update({
            subscription_status: 'active',
            stripe_subscription_id: session.subscription as string,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            plan_status: 'pending'
          })
          .eq('id', userId);

        console.log('✅ Perfil atualizado com sucesso');

        // Criar notificação
        await supabaseClient.rpc('create_notification', {
          p_user_id: userId,
          p_message: '🎉 Pagamento confirmado! Complete sua anamnese e avaliação física para que possamos gerar seus planos personalizados.',
          p_type: 'payment_success'
        });

        console.log('📧 Notificação enviada');

        // Verificar se anamnese e avaliação estão completas
        const { data: anamnese } = await supabaseClient
          .from('anamnese')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        const { data: evaluation } = await supabaseClient
          .from('evaluations')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        console.log('📋 Anamnese:', anamnese ? 'Completa' : 'Pendente');
        console.log('📊 Avaliação:', evaluation ? 'Completa' : 'Pendente');

        // Se tiver anamnese e avaliação, gerar planos automaticamente
        if (anamnese && evaluation) {
          console.log('🤖 Iniciando geração de planos...');
          await supabaseClient
            .from('profiles')
            .update({ plan_status: 'generating' })
            .eq('id', userId);

          try {
            const generatePlansUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-plans`;
            const generateResponse = await fetch(generatePlansUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
              },
              body: JSON.stringify({ user_id: userId }),
            });

            if (!generateResponse.ok) {
              const errorText = await generateResponse.text();
              console.error('❌ Erro ao gerar planos:', errorText);
              throw new Error(errorText);
            }

            console.log('✅ Planos gerados com sucesso');
            
            await supabaseClient.rpc('create_notification', {
              p_user_id: userId,
              p_message: '🎉 Seus planos foram gerados com sucesso! Aguarde aprovação do coach (até 48h).',
              p_type: 'plan_generated'
            });
          } catch (genError) {
            console.error('❌ Erro crítico ao gerar planos:', genError);
            
            await supabaseClient
              .from('profiles')
              .update({ plan_status: 'pending' })
              .eq('id', userId);
            
            await supabaseClient.rpc('create_notification', {
              p_user_id: userId,
              p_message: '⚠️ Não foi possível gerar seus planos automaticamente. Nossa equipe irá criar manualmente em até 48h.',
              p_type: 'system_error'
            });
          }
        } else {
          console.log('ℹ️ Aguardando anamnese e/ou avaliação');
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
