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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { message, context } = await req.json();

    // Buscar dados do perfil e anamnese do usuário
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', userData.user.id)
      .single();

    const { data: anamnese } = await supabaseClient
      .from('anamnese')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    // Construir contexto personalizado
    const userName = profile?.full_name || 'Aluno';
    const systemPrompt = `Você é o assistente fitness da EMteam Digital. Seu nome é EMteam Assistant.
    
Você está conversando com ${userName}.
${anamnese ? `
Informações do aluno:
- Objetivo: ${anamnese.main_goal || 'não informado'}
- Peso atual: ${anamnese.current_weight || 'não informado'} kg
- Peso desejado: ${anamnese.target_weight || 'não informado'} kg
- Nível de atividade: ${anamnese.activity_level || 'não informado'}
- Restrições alimentares: ${anamnese.intolerances || 'nenhuma'}
` : ''}

Você deve:
- Responder perguntas sobre treino, alimentação e desempenho
- Dar dicas motivacionais personalizadas
- Ajudar o aluno a entender melhor seu plano
- Ser amigável, encorajador e profissional
- Fornecer respostas curtas e diretas (máximo 3-4 parágrafos)

Não invente informações que você não tem. Se não souber algo específico do plano do aluno, seja honesto.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Chamar Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context || []),
          { role: 'user', content: message }
        ],
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Error:', aiResponse.status, errorText);
      throw new Error(`AI request failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in ai-coach-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
