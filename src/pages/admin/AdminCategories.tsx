import { useState } from 'react';
import { useCategories, Category } from '@/hooks/useCategories';
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
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

const AdminCategories = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 0,
    active: true,
  });

  const columns: Column<Category>[] = [
    {
      key: 'display_order',
      label: 'Ordem',
      render: (value) => (
        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
          {value || 0}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'image_url',
      label: 'Imagem',
      render: (value) => value ? (
        <img src={value} alt="Categoria" className="w-12 h-12 rounded object-cover" />
      ) : '-',
    },
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value) => (
        <code className="px-2 py-1 bg-muted rounded text-xs">
          {value}
        </code>
      ),
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
    setFormData(prev => ({
      ...prev,
      name: '',
      slug: '',
      description: '',
      image_url: '',
      display_order: 0,
      active: true,
    }));
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: Category) => {
    setSelectedCategory(item);
    setFormData(prev => ({
      ...prev,
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      image_url: item.image_url || '',
      display_order: item.display_order || 0,
      active: item.active || false,
    }));
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: Category) => {
    setSelectedCategory(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (isEdit: boolean) => {
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        image_url: formData.image_url || undefined,
        display_order: formData.display_order,
        active: formData.active,
      };

      if (isEdit && selectedCategory) {
        await updateCategory(selectedCategory.id, categoryData);
        setIsEditDialogOpen(false);
      } else {
        await createCategory(categoryData);
        setIsCreateDialogOpen(false);
      }

      resetForm();
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display_order for all affected items
    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index
    }));

    // Update each category with new display order
    for (const update of updates) {
      await updateCategory(update.id, { display_order: update.display_order });
    }
  };

  const CategoryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Categoria *</Label>
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
            placeholder="Nome da categoria"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="slug-da-categoria"
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Ordem de Exibição</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Descrição da categoria..."
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem da Categoria</Label>
        <ImageUploader
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          currentImages={formData.image_url ? [formData.image_url] : []}
          bucket="products"
          folder="categories"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="active">Categoria ativa</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Categorias</h1>
        <p className="text-muted-foreground">
          Organize os produtos em categorias e defina a ordem de exibição no site.
        </p>
      </div>

      {/* Drag and Drop Reorder Section */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reordenar Categorias</CardTitle>
            <p className="text-sm text-muted-foreground">
              Arraste e solte para reordenar as categorias conforme devem aparecer no site.
            </p>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {categories
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((category, index) => (
                        <Draggable key={category.id} draggableId={category.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                                snapshot.isDragging ? 'bg-accent/50' : 'bg-card hover:bg-muted/50'
                              }`}
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              
                              {category.image_url && (
                                <img
                                  src={category.image_url}
                                  alt={category.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              
                              <div className="flex-1">
                                <h4 className="font-medium">{category.name}</h4>
                                <p className="text-sm text-muted-foreground">{category.slug}</p>
                              </div>
                              
                              <Badge variant={category.active ? 'default' : 'secondary'}>
                                {category.active ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Todas as Categorias"
        searchPlaceholder="Pesquisar categorias..."
        searchKeys={['name', 'slug']}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Categoria</DialogTitle>
            <DialogDescription>
              Adicione uma nova categoria para organizar os produtos.
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(false)} className="btn-primary">
              Criar Categoria
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize as informações da categoria selecionada.
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm isEdit />
          
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
              Tem certeza que deseja excluir a categoria "{selectedCategory?.name}"?
              Esta ação não pode ser desfeita e pode afetar os produtos associados.
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

export default AdminCategories;