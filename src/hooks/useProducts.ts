import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  sale_price: number | null;
  features: string[] | null;
  specifications: any;
  images: string[] | null;
  main_image: string | null;
  active: boolean;
  featured: boolean;
  stock_status: string;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    slug: string;
  };
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: { name: string; slug: string; category_id?: string; description?: string; short_description?: string; price?: number; sale_price?: number; features?: string[]; specifications?: any; images?: string[]; main_image?: string; active?: boolean; featured?: boolean; stock_status?: string; meta_title?: string; meta_description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Produto criado com sucesso!",
        description: `${productData.name} foi adicionado ao catálogo.`,
      });

      fetchAllProducts();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Produto atualizado com sucesso!",
        description: `${productData.name || 'Produto'} foi atualizado.`,
      });

      fetchAllProducts();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Produto deletado com sucesso!",
        description: "O produto foi removido do catálogo.",
      });

      fetchAllProducts();
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao deletar produto",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    fetchAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};