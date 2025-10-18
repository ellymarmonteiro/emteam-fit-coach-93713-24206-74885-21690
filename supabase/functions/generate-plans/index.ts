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

    const { user_id } = await req.json();
    
    console.log('Gerando planos para usuário:', user_id);

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

    // Mock de geração de plano de treino
    const workoutPlan = {
      objetivo: "Hipertrofia",
      frequencia: "5x por semana",
      duracao: "60-90 minutos",
      treinos: [
        {
          dia: "Segunda-feira",
          foco: "Peito e Tríceps",
          exercicios: [
            { nome: "Supino Reto", series: 4, repeticoes: "8-12", descanso: "90s" },
            { nome: "Supino Inclinado", series: 3, repeticoes: "10-12", descanso: "90s" },
            { nome: "Crucifixo", series: 3, repeticoes: "12-15", descanso: "60s" },
            { nome: "Tríceps Testa", series: 3, repeticoes: "10-12", descanso: "60s" },
            { nome: "Tríceps Corda", series: 3, repeticoes: "12-15", descanso: "60s" }
          ]
        },
        {
          dia: "Terça-feira",
          foco: "Costas e Bíceps",
          exercicios: [
            { nome: "Barra Fixa", series: 4, repeticoes: "máximo", descanso: "90s" },
            { nome: "Remada Curvada", series: 4, repeticoes: "8-12", descanso: "90s" },
            { nome: "Pulldown", series: 3, repeticoes: "10-12", descanso: "60s" },
            { nome: "Rosca Direta", series: 3, repeticoes: "10-12", descanso: "60s" },
            { nome: "Rosca Martelo", series: 3, repeticoes: "12-15", descanso: "60s" }
          ]
        },
        {
          dia: "Quarta-feira",
          foco: "Pernas",
          exercicios: [
            { nome: "Agachamento", series: 4, repeticoes: "8-12", descanso: "120s" },
            { nome: "Leg Press", series: 4, repeticoes: "10-15", descanso: "90s" },
            { nome: "Cadeira Extensora", series: 3, repeticoes: "12-15", descanso: "60s" },
            { nome: "Cadeira Flexora", series: 3, repeticoes: "12-15", descanso: "60s" },
            { nome: "Panturrilha", series: 4, repeticoes: "15-20", descanso: "60s" }
          ]
        },
        {
          dia: "Quinta-feira",
          foco: "Ombros e Abdômen",
          exercicios: [
            { nome: "Desenvolvimento", series: 4, repeticoes: "8-12", descanso: "90s" },
            { nome: "Elevação Lateral", series: 3, repeticoes: "12-15", descanso: "60s" },
            { nome: "Elevação Frontal", series: 3, repeticoes: "12-15", descanso: "60s" },
            { nome: "Abdominais", series: 4, repeticoes: "15-20", descanso: "45s" },
            { nome: "Prancha", series: 3, repeticoes: "45-60s", descanso: "60s" }
          ]
        },
        {
          dia: "Sexta-feira",
          foco: "Treino Completo",
          exercicios: [
            { nome: "Supino", series: 3, repeticoes: "10-12", descanso: "90s" },
            { nome: "Remada", series: 3, repeticoes: "10-12", descanso: "90s" },
            { nome: "Agachamento", series: 3, repeticoes: "10-12", descanso: "90s" },
            { nome: "Desenvolvimento", series: 3, repeticoes: "10-12", descanso: "90s" }
          ]
        }
      ],
      observacoes: "Aqueça bem antes de cada treino. Mantenha boa forma nos exercícios. Aumente a carga progressivamente."
    };

    // Mock de plano alimentar
    const nutritionPlan = {
      objetivo: "Ganho de massa muscular",
      calorias_diarias: "2800-3000 kcal",
      distribuicao: {
        proteinas: "35%",
        carboidratos: "45%",
        gorduras: "20%"
      },
      refeicoes: [
        {
          nome: "Café da Manhã (7h)",
          opcoes: [
            "3 ovos mexidos + 2 fatias de pão integral + 1 banana + café",
            "Panqueca de aveia (100g aveia + 3 ovos) + mel + frutas",
            "Tapioca (2 unidades) + queijo branco + presunto + suco natural"
          ]
        },
        {
          nome: "Lanche da Manhã (10h)",
          opcoes: [
            "Whey protein + 1 fruta + castanhas (30g)",
            "Iogurte grego (200g) + granola + frutas",
            "Sanduíche natural + suco verde"
          ]
        },
        {
          nome: "Almoço (13h)",
          opcoes: [
            "Peito de frango grelhado (200g) + arroz integral (150g) + feijão + salada + legumes",
            "Carne vermelha magra (180g) + batata doce (200g) + brócolis + salada",
            "Peixe grelhado (200g) + quinoa (150g) + vegetais refogados"
          ]
        },
        {
          nome: "Lanche da Tarde (16h)",
          opcoes: [
            "Pão integral + pasta de amendoim + banana",
            "Vitamina de frutas + aveia + whey",
            "Tapioca + queijo cottage + geleia"
          ]
        },
        {
          nome: "Pré-Treino (18h)",
          opcoes: [
            "Batata doce (150g) + whey protein",
            "Banana + pasta de amendoim + café",
            "Pão integral + mel + café"
          ]
        },
        {
          nome: "Pós-Treino (20h)",
          opcoes: [
            "Whey protein + dextrose + creatina",
            "Frango (150g) + arroz branco (100g)",
            "Ovo cozido (3 unidades) + batata"
          ]
        },
        {
          nome: "Jantar (21h)",
          opcoes: [
            "Salmão grelhado (180g) + legumes + salada",
            "Peito de frango (180g) + abobrinha refogada + salada",
            "Omelete (4 ovos) + queijo + vegetais + salada"
          ]
        },
        {
          nome: "Ceia (23h)",
          opcoes: [
            "Caseína ou cottage (200g)",
            "Ovos cozidos (2-3 unidades)",
            "Iogurte natural + oleaginosas"
          ]
        }
      ],
      suplementacao: [
        "Whey Protein: 2-3 doses ao dia",
        "Creatina: 5g ao dia",
        "Multivitamínico: 1x ao dia",
        "Ômega 3: 2-3g ao dia",
        "Vitamina D3: conforme orientação"
      ],
      observacoes: "Beba pelo menos 3 litros de água por dia. Ajuste as porções conforme sua fome e resultados. Priorize alimentos naturais."
    };

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