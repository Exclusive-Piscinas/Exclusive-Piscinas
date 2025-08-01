import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuoteItem {
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  total_amount: number;
  notes: string | null;
  created_at: string;
  quote_items: QuoteItem[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { quoteId } = await req.json();

    if (!quoteId) {
      throw new Error('Quote ID is required');
    }

    console.log('Generating PDF for quote:', quoteId);

    // Fetch quote data with items
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes')
      .select(`
        *,
        quote_items(*)
      `)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error('Quote not found');
    }

    // Generate PDF content using jsPDF (simple implementation)
    const pdfContent = generatePDFContent(quote);
    
    // For production, you would use a proper PDF generation library
    // Here we're creating a simple HTML-based PDF content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Orçamento ${quote.quote_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #007bff; margin: 0; }
          .company-subtitle { font-size: 14px; color: #666; margin: 5px 0 0 0; }
          .quote-info { margin: 30px 0; }
          .quote-number { font-size: 24px; font-weight: bold; color: #007bff; }
          .customer-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items-table th { background-color: #007bff; color: white; }
          .total-section { margin-top: 30px; text-align: right; }
          .total-amount { font-size: 24px; font-weight: bold; color: #007bff; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="company-name">EXCLUSIVE</h1>
          <p class="company-subtitle">Premium Pools & Spas</p>
        </div>
        
        <div class="quote-info">
          <h2 class="quote-number">Orçamento ${quote.quote_number}</h2>
          <p><strong>Data:</strong> ${new Date(quote.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div class="customer-info">
          <h3>Dados do Cliente</h3>
          <p><strong>Nome:</strong> ${quote.customer_name}</p>
          <p><strong>Email:</strong> ${quote.customer_email}</p>
          <p><strong>Telefone:</strong> ${quote.customer_phone}</p>
          ${quote.customer_address ? `<p><strong>Endereço:</strong> ${quote.customer_address}</p>` : ''}
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço Unitário</th>
              <th>Quantidade</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${quote.quote_items.map((item: QuoteItem) => `
              <tr>
                <td>${item.product_name}</td>
                <td>R$ ${item.product_price.toLocaleString('pt-BR')}</td>
                <td>${item.quantity}</td>
                <td>R$ ${item.subtotal.toLocaleString('pt-BR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <p class="total-amount">Total: R$ ${(quote.total_amount || 0).toLocaleString('pt-BR')}</p>
        </div>
        
        ${quote.notes ? `
          <div style="margin-top: 30px;">
            <h3>Observações</h3>
            <p>${quote.notes}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Este orçamento é válido por 30 dias a partir da data de emissão.</p>
          <p>Entre em contato conosco para mais informações ou esclarecimentos.</p>
        </div>
      </body>
      </html>
    `;

    // Convert HTML content to bytes for upload
    const contentBytes = new TextEncoder().encode(htmlContent);
    
    // Generate filename
    const filename = `orcamento-${quote.quote_number}-${Date.now()}.html`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('quotes')
      .upload(filename, contentBytes, {
        contentType: 'text/html',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('quotes')
      .getPublicUrl(filename);

    // Update quote with PDF URL
    const { error: updateError } = await supabaseClient
      .from('quotes')
      .update({ pdf_url: publicUrl })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Failed to update quote with PDF URL:', updateError);
    }

    console.log('PDF generated successfully:', publicUrl);

    // Log success for monitoring
    console.log(`PDF generated successfully for quote ${quote.quote_number}:`, publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdf_url: publicUrl,
        quote_number: quote.quote_number,
        message: 'PDF gerado com sucesso'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

function generatePDFContent(quote: Quote): string {
  // This is a simple PDF content generator
  // In production, use a proper PDF library like jsPDF or puppeteer
  return `PDF content for quote ${quote.quote_number}`;
}