-- Corrigir search_path das funções para segurança

ALTER FUNCTION public.update_updated_at_column() 
SET search_path = public;