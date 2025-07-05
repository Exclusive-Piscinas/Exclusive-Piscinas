import { useState } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Básico</TabsTrigger>
        <TabsTrigger value="content">Conteúdo</TabsTrigger>
        <TabsTrigger value="images">Imagens</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  name,
                  slug: generateSlug(name)
                }));
              }}
              placeholder="Nome do produto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="slug-do-produto"
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">Categoria</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
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
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, sale_price: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_status">Status do Estoque</Label>
          <Select value={formData.stock_status} onValueChange={(value) => setFormData(prev => ({ ...prev, stock_status: value }))}>
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
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Produto ativo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Produto em destaque</Label>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="short_description">Descrição Resumida</Label>
          <Textarea
            id="short_description"
            value={formData.short_description}
            onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
            placeholder="Breve descrição do produto..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Descrição Completa</Label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            placeholder="Descrição detalhada do produto..."
          />
        </div>

        <div className="space-y-4">
          <Label>Características</Label>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Nova característica..."
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
            />
            <Button type="button" onClick={addFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.features.length > 0 && (
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
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
            onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
            placeholder='{"Peso": "200kg", "Dimensões": "5x3x1.5m"}'
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      </TabsContent>

      <TabsContent value="images" className="space-y-4">
        <div className="space-y-2">
          <Label>Galeria de Imagens</Label>
          <ImageUploader
            onImageUploaded={(url) => {}}
            onImagesUploaded={(urls) => {
              setFormData(prev => ({ 
                ...prev, 
                images: urls,
                main_image: prev.main_image || urls[0] || ''
              }));
            }}
            currentImages={formData.images}
            multiple
            bucket="products"
            folder="products"
          />
        </div>

        {formData.images.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="main_image">Imagem Principal</Label>
            <Select 
              value={formData.main_image} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, main_image: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a imagem principal" />
              </SelectTrigger>
              <SelectContent>
                {formData.images.map((image, index) => (
                  <SelectItem key={index} value={image}>
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
        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Título</Label>
          <Input
            id="meta_title"
            value={formData.meta_title}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
            placeholder="Descrição otimizada para SEO..."
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            {formData.meta_description.length}/160 caracteres
          </p>
        </div>
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