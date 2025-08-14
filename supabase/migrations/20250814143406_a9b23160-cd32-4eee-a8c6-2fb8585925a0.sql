-- Add missing foreign key constraints for quote relationships
-- This will fix the schema cache relationship issues

-- Add foreign key from quote_accessories to quotes
ALTER TABLE public.quote_accessories 
ADD CONSTRAINT fk_quote_accessories_quote_id 
FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;

-- Add foreign key from quote_accessories to accessories (if accessory_id exists)
ALTER TABLE public.quote_accessories 
ADD CONSTRAINT fk_quote_accessories_accessory_id 
FOREIGN KEY (accessory_id) REFERENCES public.accessories(id) ON DELETE SET NULL;

-- Add foreign key from quote_items to quotes
ALTER TABLE public.quote_items 
ADD CONSTRAINT fk_quote_items_quote_id 
FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;

-- Add foreign key from quote_items to products (if product_id exists)
ALTER TABLE public.quote_items 
ADD CONSTRAINT fk_quote_items_product_id 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- Add foreign key from quote_equipments to quotes
ALTER TABLE public.quote_equipments 
ADD CONSTRAINT fk_quote_equipments_quote_id 
FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;

-- Add foreign key from quote_equipments to equipments
ALTER TABLE public.quote_equipments 
ADD CONSTRAINT fk_quote_equipments_equipment_id 
FOREIGN KEY (equipment_id) REFERENCES public.equipments(id) ON DELETE RESTRICT;