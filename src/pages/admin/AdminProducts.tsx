import { useState, useCallback } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { BasicFields, ContentFields, SEOFields } from '@/components/admin/forms/ProductFormFields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X } from 'lucide-react';

const AdminProducts = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    short_description: '',
    price: 0,
    sale_price: 0,
    features: [] as string[],
    specifications: '{}',
    images: [] as string[],
    main_image: '',
    active: true,
    featured: false,
    stock_status: 'in_stock',
    meta_title: '',
    meta_description: '',
  });
  const [newFeature, setNewFeature] = useState('');

  const columns: Column<Product>[] = [
    {
      key: 'main_image',
      label: 'Imagem',
      render: (value) => value ? (
        <img src={value} alt="Produto" className="w-12 h-12 rounded object-cover" />
      ) : '-',
    },
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'category_id',
      label: 'Categoria',
      render: (value) => {
        const category = categories.find(c => c.id === value);
        return category ? category.name : 'Sem categoria';
      },
    },
    {
      key: 'price',
      label: 'Preço',
      render: (value) => value ? `R$ ${value.toLocaleString('pt-BR')}` : '-',
      sortable: true,
    },
    {
      key: 'active',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'featured',
      label: 'Destaque',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Sim' : 'Não'}
        </Badge>
      ),
    },
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setFormData({
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
    });
    setNewFeature('');
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: Product) => {
    setSelectedProduct(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      category_id: item.category_id || '',
      description: item.description || '',
      short_description: item.short_description || '',
      price: item.price || 0,
      sale_price: item.sale_price || 0,
      features: item.features || [],
      specifications: JSON.stringify(item.specifications || {}, null, 2),
      images: item.images || [],
      main_image: item.main_image || '',
      active: item.active || false,
      featured: item.featured || false,
      stock_status: item.stock_status || 'in_stock',
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: Product) => {
    setSelectedProduct(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (isEdit: boolean) => {
    try {
      let specifications = {};
      try {
        specifications = JSON.parse(formData.specifications);
      } catch (e) {
        console.error('Invalid JSON in specifications');
      }

      const productData = {
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

      if (isEdit && selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        setIsEditDialogOpen(false);
      } else {
        await createProduct(productData);
        setIsCreateDialogOpen(false);
      }

      resetForm();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  // Optimized form field handlers using useCallback to prevent re-renders
  const handleFieldChange = useCallback((field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
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

  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Básico</TabsTrigger>
        <TabsTrigger value="content">Conteúdo</TabsTrigger>
        <TabsTrigger value="images">Imagens</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <BasicFields
          formData={formData}
          onFieldChange={handleFieldChange}
          categories={categories}
          generateSlug={generateSlug}
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <ContentFields
          formData={formData}
          onFieldChange={handleFieldChange}
          newFeature={newFeature}
          onNewFeatureChange={handleNewFeatureChange}
          onAddFeature={addFeature}
          onRemoveFeature={removeFeature}
        />
        
        <div className="space-y-2">
          <RichTextEditor
            value={formData.description}
            onChange={(value) => handleFieldChange('description', value)}
            placeholder="Descrição detalhada do produto..."
          />
        </div>
      </TabsContent>

      <TabsContent value="images" className="space-y-4">
        <div className="space-y-2">
          <ImageUploader
            onImageUploaded={(url) => {}}
            onImagesUploaded={(urls) => {
              handleFieldChange('images', urls);
              if (!formData.main_image && urls[0]) {
                handleFieldChange('main_image', urls[0]);
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
              onValueChange={(value) => handleFieldChange('main_image', value)}
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

      <TabsContent value="seo" className="space-y-4">
        <SEOFields
          formData={formData}
          onFieldChange={handleFieldChange}
        />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Produtos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os produtos do catálogo com informações completas e imagens.
        </p>
      </div>

      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Produtos"
        searchPlaceholder="Pesquisar produtos..."
        searchKeys={['name', 'short_description']}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Produto</DialogTitle>
            <DialogDescription>
              Adicione um novo produto ao catálogo com todas as informações necessárias.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(false)} className="btn-primary">
              Criar Produto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Atualize as informações do produto selecionado.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm isEdit />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(true)} className="btn-primary">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{selectedProduct?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="btn-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;