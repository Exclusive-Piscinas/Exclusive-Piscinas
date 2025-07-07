-- Insert WhatsApp number configuration into site_content table
INSERT INTO public.site_content (key, title, content, active)
VALUES (
  'whatsapp_number',
  'Número do WhatsApp',
  '5511999999999',
  true
) ON CONFLICT (key) DO NOTHING;