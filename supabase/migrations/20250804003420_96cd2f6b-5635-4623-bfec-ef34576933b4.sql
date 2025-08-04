-- Rename accessories table to equipments
ALTER TABLE accessories RENAME TO equipments;

-- Rename product_accessories table to product_equipments
ALTER TABLE product_accessories RENAME TO product_equipments;

-- Rename quote_accessories table to quote_equipments
ALTER TABLE quote_accessories RENAME TO quote_equipments;

-- Update foreign key column names in product_equipments
ALTER TABLE product_equipments RENAME COLUMN accessory_id TO equipment_id;

-- Update foreign key column names in quote_equipments
ALTER TABLE quote_equipments RENAME COLUMN accessory_id TO equipment_id;
ALTER TABLE quote_equipments RENAME COLUMN accessory_name TO equipment_name;
ALTER TABLE quote_equipments RENAME COLUMN accessory_price TO equipment_price;

-- Update RLS policy names for equipments table
DROP POLICY IF EXISTS "Accessories are viewable by everyone" ON equipments;
DROP POLICY IF EXISTS "Admins can manage accessories" ON equipments;

CREATE POLICY "Equipments are viewable by everyone" 
ON equipments FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage equipments" 
ON equipments FOR ALL 
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
));

-- Update RLS policy names for product_equipments table
DROP POLICY IF EXISTS "Product accessories are viewable by everyone" ON product_equipments;
DROP POLICY IF EXISTS "Admins can manage product accessories" ON product_equipments;

CREATE POLICY "Product equipments are viewable by everyone" 
ON product_equipments FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product equipments" 
ON product_equipments FOR ALL 
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
));

-- Update RLS policy names for quote_equipments table
DROP POLICY IF EXISTS "Admins can view all quote accessories" ON quote_equipments;
DROP POLICY IF EXISTS "Anyone can create quote accessories" ON quote_equipments;

CREATE POLICY "Admins can view all quote equipments" 
ON quote_equipments FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
));

CREATE POLICY "Anyone can create quote equipments" 
ON quote_equipments FOR INSERT 
WITH CHECK (true);