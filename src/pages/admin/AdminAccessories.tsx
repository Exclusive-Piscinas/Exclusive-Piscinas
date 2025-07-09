import { useState } from 'react';
import { useAccessories, Accessory, CreateAccessoryData } from '@/hooks/useAccessories';
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
import { ImageUploader } from '@/components/admin/ImageUploader';
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

const ACCESSORY_CATEGORIES = [
  { value: 'iluminacao', label: 'Iluminação' },
  { value: 'aquecimento', label: 'Aquecimento' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'decoracao', label: 'Decoração' },
  { value: 'outros', label: 'Outros' },
];

const AdminAccessories = () => {
  const { 
    accessories, 
    loading, 
    createAccessory, 
    updateAccessory, 
    deleteAccessory 
  } = useAccessories();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  const [formData, setFormData] = useState<CreateAccessoryData>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    active: true,
  });

  const columns: Column<Accessory>[] = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (value) => value ? (
        <Badge variant="outline">
          {ACCESSORY_CATEGORIES.find(cat => cat.value === value)?.label || value}
        </Badge>
      ) : '-',
    },
    {
      key: 'price',
      label: 'Preço',
      render: (value) => value ? `R$ ${Number(value).toLocaleString('pt-BR')}` : '-',
    },
    {
      key: 'image_url',
      label: 'Imagem',
      render: (value) => value ? (
        <img src={value} alt="Preview" className="w-10 h-10 rounded object-cover" />
      ) : '-',
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
      key: 'updated_at',
      label: 'Atualizado em',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('pt-BR'),
    },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: '',
      active: true,
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: Accessory) => {
    setSelectedAccessory(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price || 0,
      image_url: item.image_url || '',
      category: item.category || '',
      active: item.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: Accessory) => {
    setSelectedAccessory(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (isEdit: boolean) => {
    try {
      if (isEdit && selectedAccessory) {
        await updateAccessory(selectedAccessory.id, formData);
        setIsEditDialogOpen(false);
      } else {
        await createAccessory(formData);
        setIsCreateDialogOpen(false);
      }

      resetForm();
      setSelectedAccessory(null);
    } catch (error) {
      console.error('Error saving accessory:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedAccessory) {
      await deleteAccessory(selectedAccessory.id);
      setIsDeleteDialogOpen(false);
      setSelectedAccessory(null);
    }
  };

  const AccessoryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Acessório</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nome do acessório"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {ACCESSORY_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição do acessório"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem do Acessório</Label>
        <ImageUploader
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          currentImages={formData.image_url ? [formData.image_url] : []}
          bucket="products"
          folder="accessories"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="active">Acessório ativo</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Acessórios</h1>
        <p className="text-muted-foreground">
          Gerencie os acessórios que podem ser vinculados aos produtos.
        </p>
      </div>

      <DataTable
        data={accessories}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Acessórios"
        searchPlaceholder="Pesquisar por nome ou categoria..."
        searchKeys={['name', 'category']}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Acessório</DialogTitle>
            <DialogDescription>
              Adicione um novo acessório que pode ser vinculado aos produtos.
            </DialogDescription>
          </DialogHeader>
          
          <AccessoryForm />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(false)} className="btn-primary">
              Criar Acessório
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Acessório</DialogTitle>
            <DialogDescription>
              Atualize as informações do acessório selecionado.
            </DialogDescription>
          </DialogHeader>
          
          <AccessoryForm isEdit />
          
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
              Tem certeza que deseja excluir o acessório "{selectedAccessory?.name}"?
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

export default AdminAccessories;