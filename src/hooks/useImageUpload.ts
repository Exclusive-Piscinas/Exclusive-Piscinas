import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, bucket: string = 'products', folder?: string): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      toast({
        title: "Imagem enviada com sucesso!",
        description: "A imagem foi carregada e está pronta para uso.",
      });

      return urlData.publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro ao enviar imagem",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[], bucket: string = 'products', folder?: string): Promise<string[]> => {
    try {
      setUploading(true);
      const uploadPromises = files.map(file => uploadImage(file, bucket, folder));
      const results = await Promise.all(uploadPromises);
      return results.filter(url => url !== null) as string[];
    } catch (error: any) {
      toast({
        title: "Erro ao enviar imagens",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string, bucket: string = 'products') => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Imagem removida com sucesso!",
        description: "A imagem foi deletada do servidor.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover imagem",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    uploading,
  };
};