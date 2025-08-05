import { memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BasicFields, ContentFields, SEOFields } from '@/components/admin/forms/ProductFormFields';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ProductFormData } from '@/hooks/useProductForm';
import ProductEquipmentsField from '@/components/admin/forms/ProductEquipmentsField';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  categories: Category[];
  newFeature: string;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  onNewFeatureChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  generateSlug: (name: string) => string;
  isEdit?: boolean;
  productId?: string;
}

export const ProductForm = memo(({
  formData,
  categories,
  newFeature,
  onFieldChange,
  onNewFeatureChange,
  onAddFeature,
  onRemoveFeature,
  generateSlug,
  isEdit = false,
  productId
}: ProductFormProps) => (
  <Tabs defaultValue="basic" className="w-full">
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="basic">Básico</TabsTrigger>
      <TabsTrigger value="content">Conteúdo</TabsTrigger>
      <TabsTrigger value="images">Imagens</TabsTrigger>
      <TabsTrigger value="equipments">Equipamentos</TabsTrigger>
      <TabsTrigger value="seo">SEO</TabsTrigger>
    </TabsList>

    <TabsContent value="basic" className="space-y-4">
      <BasicFields
        formData={formData}
        onFieldChange={onFieldChange}
        categories={categories}
        generateSlug={generateSlug}
      />
    </TabsContent>

    <TabsContent value="content" className="space-y-4">
      <ContentFields
        formData={formData}
        onFieldChange={onFieldChange}
        newFeature={newFeature}
        onNewFeatureChange={onNewFeatureChange}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
      />
      
      <div className="space-y-2">
        <RichTextEditor
          value={formData.description}
          onChange={(value) => onFieldChange('description', value)}
          placeholder="Descrição detalhada do produto..."
        />
      </div>
    </TabsContent>

    <TabsContent value="images" className="space-y-4">
      <div className="space-y-2">
        <ImageUploader
          onImageUploaded={(url) => {}}
          onImagesUploaded={(urls) => {
            onFieldChange('images', urls);
            if (!formData.main_image && urls[0]) {
              onFieldChange('main_image', urls[0]);
            }
          }}
          currentImages={formData.images}
          multiple
          bucket="products"
          folder="products"
        />
      </div>

      {formData.images.length > 0 && (
        <div className="space-y-2">
          <Select 
            value={formData.main_image} 
            onValueChange={(value) => onFieldChange('main_image', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a imagem principal" />
            </SelectTrigger>
            <SelectContent>
              {formData.images.map((image, index) => (
                <SelectItem key={`img-${index}`} value={image}>
                  <div className="flex items-center gap-2">
                    <img src={image} alt={`Imagem ${index + 1}`} className="w-8 h-8 rounded object-cover" />
                    Imagem {index + 1}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </TabsContent>

    <TabsContent value="equipments" className="space-y-4">
      {isEdit && productId ? (
        <ProductEquipmentsField productId={productId} />
      ) : (
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <p className="text-muted-foreground">
            Salve o produto primeiro para gerenciar equipamentos
          </p>
        </div>
      )}
    </TabsContent>

    <TabsContent value="seo" className="space-y-4">
      <SEOFields
        formData={formData}
        onFieldChange={onFieldChange}
      />
    </TabsContent>
  </Tabs>
));

ProductForm.displayName = 'ProductForm';