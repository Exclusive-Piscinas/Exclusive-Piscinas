import { useState, useCallback } from 'react';
import { useAccessories, Accessory } from '@/hooks/useAccessories';
import { DataTable } from '@/components/admin/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ACCESSORY_CATEGORIES = [
  { value: 'cleaning', label: 'Limpeza' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'decoration', label: 'Decoração' },
  { value: 'safety', label: 'Segurança' },
  { value: 'comfort', label: 'Conforto' },
  { value: 'other', label: 'Outros' },
];

const AdminAccessories = () => {
  const { accessories, loading, createAccessory, updateAccessory, deleteAccessory } = useAccessories();
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    active: true,
  });

  const columns = [
    {
      key: 'name' as keyof Accessory,
      label: 'Nome',
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      key: 'category' as keyof Accessory,
      label: 'Categoria',
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }: any) => {
        const category = ACCESSORY_CATEGORIES.find(cat => cat.value === row.getValue('category'));
        return category ? category.label : '-';
      }
    },
    {
      key: 'price' as keyof Accessory,
      label: 'Preço',
      accessorKey: 'price',
      header: 'Preço',
      cell: ({ row }: any) => {
        const price = row.getValue('price');
        return price ? `R$ ${Number(price).toFixed(2)}` : '-';
      }
    },
    {
      key: 'active' as keyof Accessory,
      label: 'Status',
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.getValue('active') ? 'default' : 'secondary'}>
          {row.getValue('active') ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
  ];

  const handleCreate = useCallback(() => {
    resetForm();
    setIsCreateDialogOpen(true);
  }, []);

  const handleEdit = useCallback((item: Accessory) => {
    setSelectedAccessory(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category || '',
      image_url: item.image_url || '',
      active: item.active ?? true,
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((item: Accessory) => {
    setSelectedAccessory(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async (isEdit: boolean) => {
    try {
      const accessoryData = {
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        category: formData.category || undefined,
        image_url: formData.image_url || undefined,
        active: formData.active,
      };

      if (isEdit && selectedAccessory) {
        await updateAccessory(selectedAccessory.id, accessoryData);
        setIsEditDialogOpen(false);
      } else {
        await createAccessory(accessoryData);
        setIsCreateDialogOpen(false);
      }

      resetForm();
      setSelectedAccessory(null);
    } catch (error) {
      console.error('Error saving accessory:', error);
    }
  }, [formData, selectedAccessory, updateAccessory, createAccessory]);

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedAccessory) {
      await deleteAccessory(selectedAccessory.id);
      setIsDeleteDialogOpen(false);
      setSelectedAccessory(null);
    }
  }, [selectedAccessory, deleteAccessory]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      active: true,
    });
  };

  const AccessoryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome do acessório"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {ACCESSORY_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descrição do acessório"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="0,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL da Imagem</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active">Ativo</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Acessórios</h1>
        <p className="text-muted-foreground">
          Gerencie acessórios independentes para venda (produtos separados dos principais).
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
        searchPlaceholder="Pesquisar acessórios..."
        searchKeys={['name', 'description']}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Acessório</DialogTitle>
          </DialogHeader>
          <AccessoryForm />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={!formData.name}>
              Criar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Acessório</DialogTitle>
          </DialogHeader>
          <AccessoryForm isEdit />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={!formData.name}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o acessório "{selectedAccessory?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAccessories;