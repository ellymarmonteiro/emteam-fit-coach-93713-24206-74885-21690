import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Esta função deve ser chamada apenas uma vez e com autenticação apropriada
    // Em produção, adicione verificações de segurança adequadas
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password, full_name } = await req.json();

    if (!email || !password || !full_name) {
      throw new Error('email, password e full_name são obrigatórios');
    }

    console.log('Criando usuário coach:', email);

    // Verificar se o usuário já existe
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Usuário já existe',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Criar usuário usando Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name,
        role: 'coach',
      }
    });

    if (authError) {
      console.error('Erro ao criar auth user:', authError);
      throw authError;
    }

    console.log('Auth user criado:', authData.user.id);

    // O trigger handle_new_user já cria o profile automaticamente
    // Mas vamos atualizar o role para coach
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'coach',
        full_name: full_name,
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('Erro ao atualizar profile:', updateError);
      throw updateError;
    }

    console.log('Usuário coach criado com sucesso:', {
      id: authData.user.id,
      email: email,
      role: 'coach',
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: authData.user.id,
          email: email,
          full_name: full_name,
          role: 'coach',
        },
        message: 'Usuário profissional criado com sucesso',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro ao criar usuário coach:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
