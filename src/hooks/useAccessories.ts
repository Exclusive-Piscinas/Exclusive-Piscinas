import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Accessory {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductAccessory extends Accessory {
  required: boolean;
  sort_order: number;
}

export interface CreateAccessoryData {
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  active?: boolean;
}

export const useAccessories = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('name');

      if (error) throw error;
      setAccessories(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar acessórios",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductAccessories = async (productId: string): Promise<ProductAccessory[]> => {
    try {
      const { data, error } = await supabase
        .from('product_accessories')
        .select(`
          *,
          accessory:accessories(*)
        `)
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item.accessory,
        required: item.required,
        sort_order: item.sort_order,
      }));
    } catch (error: any) {
      toast({
        title: "Erro ao carregar acessórios do produto",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const createAccessory = async (accessoryData: CreateAccessoryData) => {
    try {
      const { data, error } = await supabase
        .from('accessories')
        .insert([accessoryData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Acessório criado com sucesso!",
        description: `${accessoryData.name} foi adicionado.`,
      });

      fetchAccessories();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar acessório",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateAccessory = async (id: string, accessoryData: Partial<CreateAccessoryData>) => {
    try {
      const { data, error } = await supabase
        .from('accessories')
        .update(accessoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Acessório atualizado com sucesso!",
      });

      fetchAccessories();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar acessório",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteAccessory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accessories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Acessório excluído com sucesso!",
      });

      fetchAccessories();
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao excluir acessório",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const addAccessoryToProduct = async (productId: string, accessoryId: string, required = false, sortOrder = 0) => {
    try {
      const { error } = await supabase
        .from('product_accessories')
        .insert([{
          product_id: productId,
          accessory_id: accessoryId,
          required,
          sort_order: sortOrder,
        }]);

      if (error) throw error;

      toast({
        title: "Acessório vinculado ao produto!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao vincular acessório",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const removeAccessoryFromProduct = async (productId: string, accessoryId: string) => {
    try {
      const { error } = await supabase
        .from('product_accessories')
        .delete()
        .eq('product_id', productId)
        .eq('accessory_id', accessoryId);

      if (error) throw error;

      toast({
        title: "Acessório removido do produto!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover acessório",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  return {
    accessories,
    loading,
    fetchAccessories,
    fetchProductAccessories,
    createAccessory,
    updateAccessory,
    deleteAccessory,
    addAccessoryToProduct,
    removeAccessoryFromProduct,
  };
};