import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Accessory {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  active?: boolean;
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
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setAccessories(data || []);
    } catch (error: any) {
      console.error('Error fetching accessories:', error);
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

      return (data || []).map(item => {
        const accessory = item.accessory as any;
        return {
          id: accessory.id,
          name: accessory.name,
          description: accessory.description,
          price: accessory.price,
          image_url: accessory.image_url,
          category: accessory.category,
          active: accessory.active,
          created_at: accessory.created_at,
          updated_at: accessory.updated_at,
          required: item.required,
          sort_order: item.sort_order
        } as ProductAccessory;
      });
    } catch (error: any) {
      console.error('Error fetching product accessories:', error);
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
        title: "Sucesso",
        description: "Acessório criado com sucesso!",
      });

      await fetchAccessories();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating accessory:', error);
      toast({
        title: "Erro ao criar acessório",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateAccessory = async (id: string, accessoryData: Partial<Accessory>) => {
    try {
      const { data, error } = await supabase
        .from('accessories')
        .update(accessoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Acessório atualizado com sucesso!",
      });

      await fetchAccessories();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating accessory:', error);
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
        title: "Sucesso",
        description: "Acessório removido com sucesso!",
      });

      await fetchAccessories();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting accessory:', error);
      toast({
        title: "Erro ao remover acessório",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const addAccessoryToProduct = async (productId: string, accessoryId: string, required: boolean = false, sortOrder: number = 0) => {
    try {
      const { error } = await supabase
        .from('product_accessories')
        .insert([{
          product_id: productId,
          accessory_id: accessoryId,
          required,
          sort_order: sortOrder
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Acessório adicionado ao produto!",
      });
    } catch (error: any) {
      console.error('Error adding accessory to product:', error);
      toast({
        title: "Erro ao adicionar acessório",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProductAccessory = async (
    productId: string,
    accessoryId: string,
    updates: { required?: boolean; sort_order?: number }
  ) => {
    try {
      const { error } = await supabase
        .from('product_accessories')
        .update(updates)
        .eq('product_id', productId)
        .eq('accessory_id', accessoryId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Vínculo do acessório atualizado!",
      });
    } catch (error: any) {
      console.error('Error updating accessory on product:', error);
      toast({
        title: "Erro ao atualizar acessório",
        description: error.message,
        variant: "destructive",
      });
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
        title: "Sucesso",
        description: "Acessório removido do produto!",
      });
    } catch (error: any) {
      console.error('Error removing accessory from product:', error);
      toast({
        title: "Erro ao remover acessório",
        description: error.message,
        variant: "destructive",
      });
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
    updateProductAccessory,
    removeAccessoryFromProduct,
  };
};