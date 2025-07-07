-- Corrigir preço da Piscina Premium Infinity que está incorreto (R$ 89 -> R$ 89.000)
UPDATE products 
SET price = 89000.00 
WHERE id = '140dd8d8-0675-43c5-a430-956e5b0e282b' 
AND name = 'Piscina Premium Infinity';