-- Fase 1: Restaurar tabela de acessórios (produtos independentes para venda)
CREATE TABLE IF NOT EXISTS public.accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  image_url TEXT,
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para accessories
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para accessories
CREATE POLICY "Accessories are viewable by everyone" 
ON public.accessories 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage accessories" 
ON public.accessories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Tabela para acessórios incluídos em produtos
CREATE TABLE IF NOT EXISTS public.product_accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  accessory_id UUID NOT NULL,
  required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para product_accessories
ALTER TABLE public.product_accessories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para product_accessories
CREATE POLICY "Product accessories are viewable by everyone" 
ON public.product_accessories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product accessories" 
ON public.product_accessories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Tabela para acessórios em orçamentos
CREATE TABLE IF NOT EXISTS public.quote_accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL,
  accessory_id UUID,
  accessory_name TEXT NOT NULL,
  accessory_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para quote_accessories
ALTER TABLE public.quote_accessories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para quote_accessories
CREATE POLICY "Anyone can create quote accessories" 
ON public.quote_accessories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all quote accessories" 
ON public.quote_accessories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Fase 2: Manter equipments como componentes técnicos (já existe)
-- A tabela equipments já existe e será usada para componentes técnicos

-- Trigger para updated_at em accessories
CREATE TRIGGER update_accessories_updated_at
BEFORE UPDATE ON public.accessories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();