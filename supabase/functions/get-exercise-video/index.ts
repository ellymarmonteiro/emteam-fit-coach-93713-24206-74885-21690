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

    const url = new URL(req.url);
    const exerciseId = url.pathname.split('/').pop();

    if (!exerciseId) {
      throw new Error('Exercise ID é obrigatório');
    }

    // Buscar exercício
    const { data: exercise, error } = await supabaseClient
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .single();

    if (error || !exercise) {
      throw new Error('Exercício não encontrado');
    }

    // Gerar URL assinada para o vídeo (válida por 1 hora)
    let signedUrl = null;
    if (exercise.video_path) {
      const { data: urlData } = await supabaseClient.storage
        .from('exercise-videos')
        .createSignedUrl(exercise.video_path, 3600);
      
      signedUrl = urlData?.signedUrl || null;
    }

    return new Response(
      JSON.stringify({ 
        ...exercise,
        video_url: signedUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
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
