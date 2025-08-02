import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  status: string;
  total_amount: number;
  notes: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
  quote_items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface CreateQuoteData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  notes?: string;
  items: {
    product_id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    accessories?: {
      accessory_id: string;
      accessory_name: string;
      accessory_price: number;
      quantity: number;
    }[];
  }[];
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_items(*),
          quote_accessories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar orçamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: CreateQuoteData) => {
    try {
      // Generate quote number
      const quoteNumber = `EXC-${Date.now()}`;
      
      // Calculate total amount including accessories
      const totalAmount = quoteData.items.reduce((sum, item) => {
        const itemTotal = item.product_price * item.quantity;
        const accessoriesTotal = (item.accessories || []).reduce(
          (accSum, acc) => accSum + (acc.accessory_price * acc.quantity),
          0
        );
        return sum + itemTotal + accessoriesTotal;
      }, 0);

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert([{
          quote_number: quoteNumber,
          customer_name: quoteData.customer_name,
          customer_email: quoteData.customer_email,
          customer_phone: quoteData.customer_phone,
          customer_address: quoteData.customer_address,
          notes: quoteData.notes,
          total_amount: totalAmount,
        }])
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Create quote items
      const quoteItems = quoteData.items.map(item => ({
        quote_id: quote.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: item.product_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems);

      if (itemsError) throw itemsError;

      // Create quote accessories for all items
      const allAccessories = quoteData.items.flatMap(item => 
        (item.accessories || []).map(accessory => ({
          quote_id: quote.id,
          accessory_id: accessory.accessory_id,
          accessory_name: accessory.accessory_name,
          accessory_price: accessory.accessory_price,
          quantity: accessory.quantity,
          subtotal: accessory.accessory_price * accessory.quantity,
        }))
      );

      if (allAccessories.length > 0) {
        const { error: accessoriesError } = await supabase
          .from('quote_accessories')
          .insert(allAccessories);

        if (accessoriesError) throw accessoriesError;
      }

      // Generate PDF automatically
      try {
        const { error: pdfError } = await supabase.functions.invoke('generate-quote-pdf', {
          body: { quoteId: quote.id }
        });

        if (pdfError) {
          console.error('Erro ao gerar PDF:', pdfError);
          // Don't fail the quote creation if PDF generation fails
        }
      } catch (pdfGenerationError) {
        console.error('PDF generation error:', pdfGenerationError);
        // PDF generation is optional, don't fail the quote
      }

      toast({
        title: "Orçamento criado com sucesso!",
        description: `Orçamento ${quoteNumber} foi gerado.`,
      });

      return { data: quote, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar orçamento",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Status atualizado com sucesso!",
        description: `Orçamento marcado como ${status}.`,
      });

      fetchQuotes();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    loading,
    fetchQuotes,
    createQuote,
    updateQuoteStatus,
  };
};