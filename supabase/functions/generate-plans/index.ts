import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id } = await req.json();
    
    console.log('Gerando planos para usuário:', user_id);

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não está configurada');
    }

    // Buscar dados do usuário
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      throw profileError;
    }

    // Buscar anamnese
    const { data: anamnese, error: anamneseError } = await supabaseClient
      .from('anamnese')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Buscar última avaliação
    const { data: lastEvaluation, error: evaluationError } = await supabaseClient
      .from('evaluations')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Construir contexto para a IA
    const userContext = {
      perfil: {
        nome: profile.full_name,
        email: profile.email,
      },
      anamnese: anamnese || null,
      ultimaAvaliacao: lastEvaluation || null,
    };

    console.log('Contexto do usuário:', JSON.stringify(userContext, null, 2));

    // Prompt para geração do plano de treino
    const workoutPrompt = `Você é um personal trainer profissional e experiente. Crie um plano de treino DETALHADO e PERSONALIZADO com base nos dados do aluno.

DADOS DO ALUNO:
${JSON.stringify(userContext, null, 2)}

INSTRUÇÕES:
- Crie um plano de 5 dias por semana
- Seja específico em séries, repetições e tempo de descanso
- Considere o nível de condicionamento do aluno
- Inclua aquecimento e alongamento
- Use tom motivacional e profissional
- Adapte os exercícios às condições físicas e objetivos do aluno
- Se houver lesões, adapte os exercícios adequadamente

FORMATO DE RESPOSTA (JSON):
{
  "objetivo": "descrição do objetivo principal",
  "frequencia": "X dias por semana",
  "duracao": "tempo estimado por sessão",
  "treinos": [
    {
      "dia": "nome do dia",
      "foco": "grupo muscular",
      "exercicios": [
        {
          "nome": "nome do exercício",
          "series": número,
          "repeticoes": "faixa de repetições",
          "descanso": "tempo de descanso",
          "observacoes": "dicas específicas"
        }
      ]
    }
  ],
  "observacoes": "orientações gerais importantes"
}`;

    // Chamar OpenAI para gerar plano de treino
    console.log('Chamando OpenAI para gerar plano de treino...');
    const workoutResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um personal trainer profissional especializado em criar planos de treino personalizados. Sempre responda em formato JSON válido.' 
          },
          { role: 'user', content: workoutPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!workoutResponse.ok) {
      const error = await workoutResponse.text();
      console.error('Erro na chamada OpenAI (treino):', error);
      throw new Error(`Erro ao gerar plano de treino: ${error}`);
    }

    const workoutApiData = await workoutResponse.json();
    const workoutContent = workoutApiData.choices[0].message.content;
    console.log('Resposta OpenAI (treino):', workoutContent);
    
    let workoutPlan;
    try {
      // Tentar parsear o JSON da resposta
      const jsonMatch = workoutContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Resposta não contém JSON válido');
      }
    } catch (parseError) {
      console.error('Erro ao parsear resposta do treino:', parseError);
      // Fallback para um plano básico se o parsing falhar
      workoutPlan = {
        objetivo: "Plano personalizado gerado",
        frequencia: "5x por semana",
        duracao: "60-90 minutos",
        treinos: [],
        observacoes: workoutContent,
      };
    }

    // Prompt para geração do plano alimentar
    const nutritionPrompt = `Você é um nutricionista esportivo especializado. Crie um plano alimentar DETALHADO e PERSONALIZADO com base nos dados do aluno.

DADOS DO ALUNO:
${JSON.stringify(userContext, null, 2)}

INSTRUÇÕES:
- Crie um plano com 6-8 refeições por dia
- Calcule calorias apropriadas para o objetivo
- Especifique distribuição de macronutrientes
- Ofereça 2-3 opções por refeição
- Considere restrições alimentares e alergias
- Inclua sugestões de suplementação
- Use tom profissional e acolhedor
- Adapte às preferências alimentares do aluno

FORMATO DE RESPOSTA (JSON):
{
  "objetivo": "descrição do objetivo nutricional",
  "calorias_diarias": "faixa de calorias",
  "distribuicao": {
    "proteinas": "percentual",
    "carboidratos": "percentual",
    "gorduras": "percentual"
  },
  "refeicoes": [
    {
      "nome": "nome da refeição e horário",
      "opcoes": [
        "opção 1 detalhada",
        "opção 2 detalhada",
        "opção 3 detalhada"
      ]
    }
  ],
  "suplementacao": [
    "suplemento 1: dosagem e horário",
    "suplemento 2: dosagem e horário"
  ],
  "observacoes": "orientações gerais importantes sobre hidratação e ajustes"
}`;

    // Chamar OpenAI para gerar plano alimentar
    console.log('Chamando OpenAI para gerar plano alimentar...');
    const nutritionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um nutricionista esportivo especializado em criar planos alimentares personalizados. Sempre responda em formato JSON válido.' 
          },
          { role: 'user', content: nutritionPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!nutritionResponse.ok) {
      const error = await nutritionResponse.text();
      console.error('Erro na chamada OpenAI (nutrição):', error);
      throw new Error(`Erro ao gerar plano alimentar: ${error}`);
    }

    const nutritionApiData = await nutritionResponse.json();
    const nutritionContent = nutritionApiData.choices[0].message.content;
    console.log('Resposta OpenAI (nutrição):', nutritionContent);
    
    let nutritionPlan;
    try {
      // Tentar parsear o JSON da resposta
      const jsonMatch = nutritionContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        nutritionPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Resposta não contém JSON válido');
      }
    } catch (parseError) {
      console.error('Erro ao parsear resposta da nutrição:', parseError);
      // Fallback para um plano básico se o parsing falhar
      nutritionPlan = {
        objetivo: "Plano personalizado gerado",
        calorias_diarias: "Calculadas individualmente",
        distribuicao: {},
        refeicoes: [],
        suplementacao: [],
        observacoes: nutritionContent,
      };
    }

    // Inserir plano de treino
    const { data: workoutData, error: workoutError } = await supabaseClient
      .from('plans')
      .insert({
        user_id: user_id,
        type: 'workout',
        content: workoutPlan,
        status: 'pending'
      })
      .select()
      .single();

    if (workoutError) {
      console.error('Erro ao criar plano de treino:', workoutError);
      throw workoutError;
    }

    // Inserir plano alimentar
    const { data: nutritionData, error: nutritionError } = await supabaseClient
      .from('plans')
      .insert({
        user_id: user_id,
        type: 'nutrition',
        content: nutritionPlan,
        status: 'pending'
      })
      .select()
      .single();

    if (nutritionError) {
      console.error('Erro ao criar plano alimentar:', nutritionError);
      throw nutritionError;
    }

    // Criar notificação para o aluno
    await supabaseClient.rpc('create_notification', {
      p_user_id: user_id,
      p_message: '🎯 Estamos montando seu plano personalizado! Você será notificado assim que estiver pronto para aprovação.',
      p_type: 'plan_generation'
    });

    console.log('Planos gerados com sucesso:', { workoutData, nutritionData });

    return new Response(
      JSON.stringify({ 
        success: true,
        workout_plan: workoutData,
        nutrition_plan: nutritionData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro na função generate-plans:', error);
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