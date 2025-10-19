import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verificar autenticação do coach
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: coach } } = await supabaseClient.auth.getUser(token);

    if (!coach) {
      throw new Error('Não autenticado');
    }

    // Verificar se é coach
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', coach.id)
      .in('role', ['coach', 'admin']);

    if (!roles || roles.length === 0) {
      throw new Error('Apenas coaches podem deletar usuários');
    }

    const { user_id, reason } = await req.json();

    if (!user_id) {
      throw new Error('user_id é obrigatório');
    }

    console.log('Deletando usuário:', { user_id, coach_id: coach.id, reason });

    // Criar registro de auditoria
    await supabaseClient
      .from('audit_log')
      .insert({
        action: 'delete_user',
        actor_id: coach.id,
        target_user_id: user_id,
        reason: reason || 'Sem motivo especificado',
        metadata: { timestamp: new Date().toISOString() }
      });

    // Deletar usuário do Auth (cascade vai deletar perfil e dados relacionados)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user_id);

    if (deleteError) {
      console.error('Erro ao deletar usuário:', deleteError);
      throw deleteError;
    }

    console.log('Usuário deletado com sucesso:', user_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Usuário deletado com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
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
