-- Restaurar políticas RLS originais - Remover duplicatas e reativar RLS

-- ETAPA 1: Remover policies duplicadas criadas posteriormente
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "quotes_admin_all" ON public.quotes;
DROP POLICY IF EXISTS "quote_items_admin_all" ON public.quote_items;
DROP POLICY IF EXISTS "site_content_admin_all" ON public.site_content;

-- ETAPA 2: Reativar RLS em todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;