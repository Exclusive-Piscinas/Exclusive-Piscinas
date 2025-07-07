import React, { memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface ProductFormData {
  name: string;
  slug: string;
  category_id: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number;
  features: string[];
  specifications: string;
  images: string[];
  main_image: string;
  active: boolean;
  featured: boolean;
  stock_status: string;
  meta_title: string;
  meta_description: string;
}

interface Category {
  id: string;
  name: string;
}

interface BasicFieldsProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  categories: Category[];
  generateSlug: (name: string) => string;
}

export const BasicFields = memo(({ formData, onFieldChange, categories, generateSlug }: BasicFieldsProps) => {
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    onFieldChange('name', name);
    onFieldChange('slug', generateSlug(name));
  }, [onFieldChange, generateSlug]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange('slug', e.target.value);
  }, [onFieldChange]);

  const handleCategoryChange = useCallback((value: string) => {
    onFieldChange('category_id', value);
  }, [onFieldChange]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange('price', parseFloat(e.target.value) || 0);
  }, [onFieldChange]);

  const handleSalePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange('sale_price', parseFloat(e.target.value) || 0);
  }, [onFieldChange]);

  const handleStockStatusChange = useCallback((value: string) => {
    onFieldChange('stock_status', value);
  }, [onFieldChange]);

  const handleActiveChange = useCallback((checked: boolean) => {
    onFieldChange('active', checked);
  }, [onFieldChange]);

  const handleFeaturedChange = useCallback((checked: boolean) => {
    onFieldChange('featured', checked);
  }, [onFieldChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Nome do produto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="slug-do-produto"
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">Categoria</Label>
          <Select value={formData.category_id} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={handlePriceChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale_price">Preço Promocional (R$)</Label>
          <Input
            id="sale_price"
            type="number"
            value={formData.sale_price}
            onChange={handleSalePriceChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_status">Status do Estoque</Label>
        <Select value={formData.stock_status} onValueChange={handleStockStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_stock">Em Estoque</SelectItem>
            <SelectItem value="out_of_stock">Fora de Estoque</SelectItem>
            <SelectItem value="on_backorder">Em Pedido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={handleActiveChange}
          />
          <Label htmlFor="active">Produto ativo</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={handleFeaturedChange}
          />
          <Label htmlFor="featured">Produto em destaque</Label>
        </div>
      </div>
    </div>
  );
});

BasicFields.displayName = 'BasicFields';

interface ContentFieldsProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  newFeature: string;
  onNewFeatureChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export const ContentFields = memo(({ 
  formData, 
  onFieldChange, 
  newFeature, 
  onNewFeatureChange, 
  onAddFeature, 
  onRemoveFeature 
}: ContentFieldsProps) => {
  const handleShortDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('short_description', e.target.value);
  }, [onFieldChange]);

  const handleDescriptionChange = useCallback((value: string) => {
    onFieldChange('description', value);
  }, [onFieldChange]);

  const handleNewFeatureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onNewFeatureChange(e.target.value);
  }, [onNewFeatureChange]);

  const handleSpecificationsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('specifications', e.target.value);
  }, [onFieldChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddFeature();
    }
  }, [onAddFeature]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="short_description">Descrição Resumida</Label>
        <Textarea
          id="short_description"
          value={formData.short_description}
          onChange={handleShortDescriptionChange}
          placeholder="Breve descrição do produto..."
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Características</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={handleNewFeatureChange}
            placeholder="Nova característica..."
            onKeyPress={handleKeyPress}
          />
          <Button type="button" onClick={onAddFeature} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {formData.features.length > 0 && (
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="flex-1">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specifications">Especificações Técnicas (JSON)</Label>
        <Textarea
          id="specifications"
          value={formData.specifications}
          onChange={handleSpecificationsChange}
          placeholder='{"Peso": "200kg", "Dimensões": "5x3x1.5m"}'
          rows={6}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
});

ContentFields.displayName = 'ContentFields';

interface SEOFieldsProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
}

export const SEOFields = memo(({ formData, onFieldChange }: SEOFieldsProps) => {
  const handleMetaTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange('meta_title', e.target.value);
  }, [onFieldChange]);

  const handleMetaDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('meta_description', e.target.value);
  }, [onFieldChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meta_title">Meta Título</Label>
        <Input
          id="meta_title"
          value={formData.meta_title}
          onChange={handleMetaTitleChange}
          placeholder="Título otimizado para SEO..."
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground">
          {formData.meta_title.length}/60 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_description">Meta Descrição</Label>
        <Textarea
          id="meta_description"
          value={formData.meta_description}
          onChange={handleMetaDescriptionChange}
          placeholder="Descrição otimizada para SEO..."
          rows={3}
          maxLength={160}
        />
        <p className="text-xs text-muted-foreground">
          {formData.meta_description.length}/160 caracteres
        </p>
      </div>
    </div>
  );
});

SEOFields.displayName = 'SEOFields';