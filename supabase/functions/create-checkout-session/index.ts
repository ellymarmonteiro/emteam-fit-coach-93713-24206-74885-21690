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
      apiVersion: '2024-11-20.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Validar Authorization JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userErr } = await supabaseClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { user_id, price_id, coupon_code } = await req.json();

    // Garantir que o user_id enviado corresponde ao token
    if (user_id && user_id !== userData.user.id) {
      return new Response(JSON.stringify({ error: 'User mismatch' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

      console.error('Missing required fields:', { user_id, price_id });
      throw new Error('user_id e price_id são obrigatórios');
    }

    console.log('🚀 Criando checkout session para:', { user_id, price_id, has_coupon: !!coupon_code });

    // Buscar dados do usuário
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      throw new Error('Usuário não encontrado no banco de dados');
    }

    console.log('✅ Perfil encontrado:', { email: profile.email, name: profile.full_name });

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

      console.log('✅ Customer criado no Stripe:', customerId);
    } else {
      console.log('✅ Customer existente encontrado:', customerId);
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
    console.log('📋 Criando session com params:', {
      customer: customerId,
      mode: 'subscription',
      price_id,
      has_discount: !!checkoutParams.discounts
    });

    const session = await stripe.checkout.sessions.create(checkoutParams);

    console.log('✅ Checkout session criada com sucesso!');
    console.log('   Session ID:', session.id);
    console.log('   Session URL:', session.url);
    console.log('   Status:', session.status);

    // SEMPRE retornar a URL para redirecionamento direto
    if (!session.url) {
      console.error('❌ Session criada mas URL não foi gerada!', session);
      throw new Error('URL do checkout não foi gerada pelo Stripe');
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
    console.error('❌ ERRO ao criar checkout session:');
    console.error('   Tipo:', error.constructor.name);
    console.error('   Mensagem:', error.message);
    console.error('   Stack:', error.stack);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
