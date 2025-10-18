import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

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

    const { coupon_code } = await req.json();

    if (!coupon_code) {
      throw new Error('coupon_code é obrigatório');
    }

    console.log('Validando cupom:', coupon_code);

    try {
      const coupon = await stripe.coupons.retrieve(coupon_code);

      // Verificar se o cupom está válido
      if (!coupon.valid) {
        throw new Error('Cupom inválido ou expirado');
      }

      // Retornar informações do cupom
      const couponInfo = {
        valid: true,
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months,
      };

      console.log('Cupom válido:', couponInfo);

      return new Response(
        JSON.stringify(couponInfo),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } catch (stripeError: any) {
      console.error('Erro ao validar cupom no Stripe:', stripeError);
      
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: 'Cupom não encontrado ou inválido'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Retornar 200 mesmo com cupom inválido
        }
      );
    }

  } catch (error) {
    console.error('Erro ao validar cupom:', error);
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
