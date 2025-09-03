import { useState, useCallback } from 'react';
import { Product } from '@/hooks/useProducts';

export interface ProductFormData {
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

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  category_id: '',
  description: '',
  short_description: '',
  price: 0,
  sale_price: 0,
  features: [],
  specifications: '{}',
  images: [],
  main_image: '',
  active: true,
  featured: false,
  stock_status: 'in_stock',
  meta_title: '',
  meta_description: '',
};

export const useProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState('');

  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setNewFeature('');
  }, []);

  const loadProductData = useCallback((product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id || '',
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price || 0,
      sale_price: product.sale_price || 0,
      features: product.features || [],
      specifications: JSON.stringify(product.specifications || {}, null, 2),
      images: product.images || [],
      main_image: product.main_image || '',
      active: product.active || false,
      featured: product.featured || false,
      stock_status: product.stock_status || 'in_stock',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
    });
  }, []);

  const handleFieldChange = useCallback((field: keyof ProductFormData, value: any) => {
    setFormData(prev => {
      // Evita re-render se o valor não mudou
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      const trimmedFeature = newFeature.trim();
      setFormData(prev => {
        // Evita adicionar features duplicadas
        if (prev.features.includes(trimmedFeature)) return prev;
        return {
          ...prev,
          features: [...prev.features, trimmedFeature]
        };
      });
      setNewFeature('');
    }
  }, [newFeature]);

  const removeFeature = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  }, []);

  const handleNewFeatureChange = useCallback((value: string) => {
    setNewFeature(value);
  }, []);

  const prepareSubmissionData = useCallback(() => {
    let specifications = {};
    try {
      specifications = JSON.parse(formData.specifications);
    } catch (e) {
      console.error('Invalid JSON in specifications');
    }

    return {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      category_id: formData.category_id || undefined,
      description: formData.description,
      short_description: formData.short_description,
      price: formData.price > 0 ? formData.price : undefined,
      sale_price: formData.sale_price > 0 ? formData.sale_price : undefined,
      features: formData.features.length > 0 ? formData.features : undefined,
      specifications,
      images: formData.images.length > 0 ? formData.images : undefined,
      main_image: formData.main_image || undefined,
      active: formData.active,
      featured: formData.featured,
      stock_status: formData.stock_status,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
    };
  }, [formData, generateSlug]);

  return {
    formData,
    newFeature,
    resetForm,
    loadProductData,
    handleFieldChange,
    addFeature,
    removeFeature,
    handleNewFeatureChange,
    prepareSubmissionData,
    generateSlug,
  };
};