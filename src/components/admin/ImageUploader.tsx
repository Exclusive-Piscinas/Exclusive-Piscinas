import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  onImagesUploaded?: (urls: string[]) => void;
  currentImages?: string[];
  multiple?: boolean;
  bucket?: string;
  folder?: string;
}

export const ImageUploader = ({ 
  onImageUploaded, 
  onImagesUploaded,
  currentImages = [], 
  multiple = false,
  bucket = 'products',
  folder 
}: ImageUploaderProps) => {
  const { uploadImage, uploadMultipleImages, deleteImage, uploading } = useImageUpload();
  const [previewImages, setPreviewImages] = useState<string[]>(currentImages);

  // Sync with external changes
  useEffect(() => {
    setPreviewImages(currentImages);
  }, [currentImages]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (multiple) {
      const urls = await uploadMultipleImages(acceptedFiles, bucket, folder);
      if (urls.length > 0) {
        const newImages = [...previewImages, ...urls];
        setPreviewImages(newImages);
        onImagesUploaded?.(newImages);
      }
    } else {
      const file = acceptedFiles[0];
      if (file) {
        const url = await uploadImage(file, bucket, folder);
        if (url) {
          setPreviewImages([url]);
          onImageUploaded(url);
        }
      }
    }
  }, [uploadImage, uploadMultipleImages, multiple, bucket, folder, previewImages, onImageUploaded, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple,
    disabled: uploading
  });

  const removeImage = async (urlToRemove: string, index: number) => {
    await deleteImage(urlToRemove, bucket);
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    
    if (multiple) {
      onImagesUploaded?.(newImages);
    } else if (newImages.length === 0) {
      onImageUploaded('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:border-accent",
          isDragActive && "border-accent bg-accent/10",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-accent font-medium">Solte as imagens aqui...</p>
          ) : (
            <div>
              <p className="text-foreground font-medium mb-2">
                {multiple ? 'Arraste imagens ou clique para selecionar' : 'Arraste uma imagem ou clique para selecionar'}
              </p>
              <p className="text-muted-foreground text-sm">
                Formatos aceitos: JPG, PNG, WebP, GIF
              </p>
              {uploading && (
                <p className="text-accent text-sm mt-2">Enviando imagem...</p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Preview Grid */}
      {previewImages.length > 0 && (
        <div className={cn(
          "grid gap-4",
          multiple ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {previewImages.map((url, index) => (
            <Card key={`preview-${index}-${url.split('/').pop()}`} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(url, index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!multiple && previewImages.length === 0 && !uploading && (
        <Card className="border-dashed">
          <div className="p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhuma imagem selecionada</p>
          </div>
        </Card>
      )}
    </div>
  );
};