-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  features TEXT[],
  specifications JSONB,
  images TEXT[],
  main_image TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  stock_status TEXT DEFAULT 'in_stock',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_items table
CREATE TABLE public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_content table for editable content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  image_url TEXT,
  settings JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (active = true);

CREATE POLICY "Admins can view all products" 
ON public.products FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create policies for quotes (anyone can create, admins can view all)
CREATE POLICY "Anyone can create quotes" 
ON public.quotes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all quotes" 
ON public.quotes FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update quotes" 
ON public.quotes FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create policies for quote_items
CREATE POLICY "Anyone can create quote items" 
ON public.quote_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all quote items" 
ON public.quote_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create policies for site_content (public read, admin write)
CREATE POLICY "Site content is viewable by everyone" 
ON public.site_content FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage site content" 
ON public.site_content FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        'admin'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert initial categories
INSERT INTO public.categories (name, slug, description) VALUES
('Piscinas', 'piscinas', 'Piscinas de luxo para sua casa'),
('Spas', 'spas', 'Spas e hidromassagens premium'),
('Banheiras', 'banheiras', 'Banheiras de hidromassagem'),
('Acessórios', 'acessorios', 'Acessórios e equipamentos');

-- Insert sample products
INSERT INTO public.products (category_id, name, slug, description, short_description, price, features, main_image, images) 
SELECT 
    c.id,
    'Piscina Premium Infinity',
    'piscina-premium-infinity',
    'Piscina de borda infinita com acabamento em pedra natural e sistema de aquecimento integrado. Perfeita para momentos de relaxamento e lazer em família.',
    'Piscina de borda infinita com aquecimento',
    89900.00,
    ARRAY['Borda infinita', 'Sistema de aquecimento', 'LED RGB', 'Filtração automática'],
    '/src/assets/hero-pool.jpg',
    ARRAY['/src/assets/hero-pool.jpg', '/src/assets/pool-product.jpg']
FROM public.categories c WHERE c.slug = 'piscinas';

INSERT INTO public.products (category_id, name, slug, description, short_description, price, features, main_image, images)
SELECT 
    c.id,
    'Spa Deluxe 8 Pessoas',
    'spa-deluxe-8-pessoas',
    'Spa luxuoso para até 8 pessoas com sistema de hidromassagem de última geração, controle digital e iluminação LED.',
    'Spa de luxo para 8 pessoas',
    45900.00,
    ARRAY['Hidromassagem', 'Controle digital', 'LED colorido', 'Aquecimento rápido'],
    '/src/assets/spa-luxury.jpg',
    ARRAY['/src/assets/spa-luxury.jpg']
FROM public.categories c WHERE c.slug = 'spas';

INSERT INTO public.products (category_id, name, slug, description, short_description, price, features, main_image, images)
SELECT 
    c.id,
    'Banheira Hidro Premium',
    'banheira-hidro-premium',
    'Banheira de hidromassagem com design moderno e sistema de jatos direcionais para máximo relaxamento.',
    'Banheira de hidromassagem premium',
    12900.00,
    ARRAY['Jatos direcionais', 'Design moderno', 'Material acrílico', 'Fácil limpeza'],
    '/src/assets/bathtub-luxury.jpg',
    ARRAY['/src/assets/bathtub-luxury.jpg']
FROM public.categories c WHERE c.slug = 'banheiras';

-- Insert initial site content
INSERT INTO public.site_content (key, title, content, settings) VALUES
('hero_title', 'Transforme Sua Casa em um Paraíso Aquático', 'Transforme Sua Casa em um Paraíso Aquático', '{}'),
('hero_subtitle', 'Piscinas, Spas e Banheiras de Luxo', 'Piscinas, spas e banheiras premium com instalação completa e projetos personalizados para criar o ambiente dos seus sonhos.', '{}'),
('company_phone', '+55 11 99999-9999', '+55 11 99999-9999', '{}'),
('company_email', 'contato@exclusive.com.br', 'contato@exclusive.com.br', '{}'),
('company_address', 'São Paulo, SP', 'São Paulo, SP', '{}');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('products', 'products', true),
('quotes', 'quotes', false);

-- Create storage policies
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Quote PDFs policies
CREATE POLICY "Admins can view quote PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'quotes' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "System can upload quote PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quotes');

CREATE POLICY "Admins can manage quote PDFs"
ON storage.objects FOR ALL
USING (bucket_id = 'quotes' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));