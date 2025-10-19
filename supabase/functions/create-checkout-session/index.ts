import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, price_id, coupon_code } = await req.json();

    if (!user_id || !price_id) {
      throw new Error('user_id e price_id são obrigatórios');
    }

    console.log('Criando checkout session para:', { user_id, price_id, coupon_code });

    // Buscar dados do usuário
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      throw new Error('Usuário não encontrado');
    }

    // Criar ou recuperar customer no Stripe
    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name,
        metadata: {
          supabase_user_id: user_id,
        },
      });
      customerId = customer.id;

      // Salvar customer_id no perfil
      await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user_id);

      console.log('Customer criado no Stripe:', customerId);
    }

    // Preparar parâmetros do checkout
    const checkoutParams: any = {
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin') || 'http://localhost:5173'}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:5173'}/subscription`,
      metadata: {
        user_id: user_id,
      },
      subscription_data: {
        metadata: {
          user_id: user_id,
        },
      },
    };

    // Aplicar cupom se fornecido
    if (coupon_code) {
      try {
        // Validar cupom no Stripe
        const coupon = await stripe.coupons.retrieve(coupon_code);
        console.log('Cupom válido:', coupon);

        checkoutParams.discounts = [{ coupon: coupon_code }];
      } catch (couponError: any) {
        console.error('Erro ao validar cupom:', couponError);
        // Continuar sem cupom se inválido
      }
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create(checkoutParams);

    console.log('Checkout session criada:', session.id, session.url);

    // SEMPRE retornar a URL para redirecionamento direto
    if (!session.url) {
      throw new Error('URL do checkout não foi gerada');
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
