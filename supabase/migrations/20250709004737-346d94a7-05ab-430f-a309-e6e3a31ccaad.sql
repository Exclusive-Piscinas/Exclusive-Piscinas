-- Create accessories table
CREATE TABLE public.accessories (
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

-- Create product_accessories junction table
CREATE TABLE public.product_accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
  required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, accessory_id)
);

-- Create quote_accessories table for tracking selected accessories in quotes
CREATE TABLE public.quote_accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES accessories(id),
  accessory_name TEXT NOT NULL,
  accessory_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_accessories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accessories
CREATE POLICY "Accessories are viewable by everyone" 
ON public.accessories 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage accessories" 
ON public.accessories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS Policies for product_accessories
CREATE POLICY "Product accessories are viewable by everyone" 
ON public.product_accessories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product accessories" 
ON public.product_accessories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS Policies for quote_accessories
CREATE POLICY "Anyone can create quote accessories" 
ON public.quote_accessories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all quote accessories" 
ON public.quote_accessories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create triggers for updated_at
CREATE TRIGGER update_accessories_updated_at
BEFORE UPDATE ON public.accessories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_product_accessories_product_id ON public.product_accessories(product_id);
CREATE INDEX idx_product_accessories_accessory_id ON public.product_accessories(accessory_id);
CREATE INDEX idx_quote_accessories_quote_id ON public.quote_accessories(quote_id);
CREATE INDEX idx_accessories_category ON public.accessories(category);
CREATE INDEX idx_accessories_active ON public.accessories(active);