import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Equipment {
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

export interface ProductEquipment extends Equipment {
  required: boolean;
  sort_order: number;
}

export interface CreateEquipmentData {
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  active?: boolean;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('name');

      if (error) throw error;
      setEquipments(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar equipamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductEquipments = async (productId: string): Promise<ProductEquipment[]> => {
    try {
      const { data, error } = await supabase
        .from('product_equipments')
        .select(`
          *,
          equipment:equipments(*)
        `)
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item.equipment,
        required: item.required,
        sort_order: item.sort_order,
      }));
    } catch (error: any) {
      toast({
        title: "Erro ao carregar equipamentos do produto",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const createEquipment = async (equipmentData: CreateEquipmentData) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .insert([equipmentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Equipamento criado com sucesso!",
        description: `${equipmentData.name} foi adicionado.`,
      });

      fetchEquipments();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar equipamento",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEquipment = async (id: string, equipmentData: Partial<CreateEquipmentData>) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .update(equipmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Equipamento atualizado com sucesso!",
      });

      fetchEquipments();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar equipamento",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Equipamento excluído com sucesso!",
      });

      fetchEquipments();
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao excluir equipamento",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const addEquipmentToProduct = async (productId: string, equipmentId: string, required = false, sortOrder = 0) => {
    try {
      const { error } = await supabase
        .from('product_equipments')
        .insert([{
          product_id: productId,
          equipment_id: equipmentId,
          required,
          sort_order: sortOrder,
        }]);

      if (error) throw error;

      toast({
        title: "Equipamento vinculado ao produto!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao vincular equipamento",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const removeEquipmentFromProduct = async (productId: string, equipmentId: string) => {
    try {
      const { error } = await supabase
        .from('product_equipments')
        .delete()
        .eq('product_id', productId)
        .eq('equipment_id', equipmentId);

      if (error) throw error;

      toast({
        title: "Equipamento removido do produto!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover equipamento",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return {
    equipments,
    loading,
    fetchEquipments,
    fetchProductEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    addEquipmentToProduct,
    removeEquipmentFromProduct,
  };
};