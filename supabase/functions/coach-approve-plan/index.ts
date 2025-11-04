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

    // Verificar se o usuário é coach
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id);

    if (rolesError || !roles || !roles.some(r => r.role === 'coach' || r.role === 'admin')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Coach access required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const { plan_id, action, updated_content } = await req.json();

    if (!plan_id || !action) {
      return new Response(JSON.stringify({ error: 'Missing required fields: plan_id and action' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Processing plan action:', { plan_id, action, coach_id: userData.user.id });

    // Buscar o plano
    const { data: plan, error: planError } = await supabaseClient
      .from('plans')
      .select('*, profiles!plans_user_id_fkey(full_name)')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: 'Plan not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    let updateData: any = {};
    let notificationMessage = '';

    switch (action) {
      case 'approve':
        updateData = {
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: userData.user.id
        };
        notificationMessage = '🎯 Seu plano foi aprovado pelo coach e já está disponível! Vamos começar? 💪';
        
        // Atualizar status no perfil do aluno
        await supabaseClient
          .from('profiles')
          .update({ plan_status: 'approved' })
          .eq('id', plan.user_id);
        break;

      case 'edit':
        if (!updated_content) {
          return new Response(JSON.stringify({ error: 'updated_content required for edit action' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }
        updateData = {
          content: updated_content,
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: userData.user.id
        };
        notificationMessage = '✏️ Seu plano foi editado e aprovado pelo coach! Confira as atualizações.';
        
        // Atualizar status no perfil do aluno
        await supabaseClient
          .from('profiles')
          .update({ plan_status: 'approved' })
          .eq('id', plan.user_id);
        break;

      case 'reject':
        updateData = {
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: userData.user.id,
          notes: updated_content?.rejection_reason || 'Plano rejeitado pelo coach'
        };
        notificationMessage = '❌ Seu plano precisa de ajustes. Entre em contato com seu coach para mais detalhes.';
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action. Use: approve, edit, or reject' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }

    // Atualizar plano
    const { data: updatedPlan, error: updateError } = await supabaseClient
      .from('plans')
      .update(updateData)
      .eq('id', plan_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating plan:', updateError);
      throw updateError;
    }

    // Criar notificação para o aluno
    await supabaseClient.rpc('create_notification', {
      p_user_id: plan.user_id,
      p_message: notificationMessage,
      p_type: 'plan_' + action
    });

    console.log('Plan updated successfully:', updatedPlan);

    return new Response(
      JSON.stringify({ 
        success: true,
        plan: updatedPlan,
        message: `Plan ${action}ed successfully`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('❌ ERROR in coach-approve-plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: Deno.env.get('DENO_DEPLOYMENT_ID') ? undefined : error?.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
