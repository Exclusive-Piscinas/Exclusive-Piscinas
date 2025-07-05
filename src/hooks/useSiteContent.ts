import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  settings: any | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar conteúdo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getContentByKey = async (key: string) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', key)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao carregar conteúdo",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const createContent = async (contentData: { 
    key: string; 
    title?: string; 
    content?: string; 
    image_url?: string; 
    settings?: any; 
    active?: boolean 
  }) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .insert(contentData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Conteúdo criado com sucesso!",
        description: `${contentData.title || contentData.key} foi adicionado.`,
      });

      fetchContent();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar conteúdo",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateContent = async (id: string, contentData: Partial<SiteContent>) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .update(contentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Conteúdo atualizado com sucesso!",
        description: `${contentData.title || 'Conteúdo'} foi atualizado.`,
      });

      fetchContent();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar conteúdo",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Conteúdo deletado com sucesso!",
        description: "O conteúdo foi removido.",
      });

      fetchContent();
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao deletar conteúdo",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    loading,
    fetchContent,
    getContentByKey,
    createContent,
    updateContent,
    deleteContent,
  };
};