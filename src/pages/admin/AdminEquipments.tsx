import { useState, useCallback } from 'react';
import { useEquipments, Equipment, CreateEquipmentData } from '@/hooks/useEquipments';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

const EQUIPMENT_CATEGORIES = [
  { value: 'iluminacao', label: 'Iluminação' },
  { value: 'filtragem', label: 'Filtragem' },
  { value: 'aquecimento', label: 'Aquecimento' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'bombas', label: 'Bombas' },
  { value: 'outros', label: 'Outros' },
];

const AdminEquipments = () => {
  const { equipments, loading, createEquipment, updateEquipment, deleteEquipment } = useEquipments();
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreateEquipmentData>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    active: true,
  });

  // Table columns
  const columns = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }: any) => {
        const category = EQUIPMENT_CATEGORIES.find(cat => cat.value === row.original.category);
        return category ? category.label : row.original.category || '-';
      },
    },
    {
      accessorKey: 'price',
      header: 'Preço',
      cell: ({ row }: any) => {
        return row.original.price ? `R$ ${row.original.price.toFixed(2)}` : '-';
      },
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.active ? 'default' : 'secondary'}>
          {row.original.active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
  ];

  // Action handlers
  const handleCreate = useCallback(() => {
    resetForm();
    setIsCreateDialogOpen(true);
  }, []);

  const handleEdit = useCallback((item: Equipment) => {
    setSelectedEquipment(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price || 0,
      image_url: item.image_url || '',
      category: item.category || '',
      active: item.active,
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((item: Equipment) => {
    setSelectedEquipment(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async (isEdit: boolean) => {
    try {
      if (isEdit && selectedEquipment) {
        await updateEquipment(selectedEquipment.id, formData);
        setIsEditDialogOpen(false);
      } else {
        await createEquipment(formData);
        setIsCreateDialogOpen(false);
      }

      resetForm();
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Error saving equipment:', error);
    }
  }, [formData, selectedEquipment, updateEquipment, createEquipment]);

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedEquipment) {
      await deleteEquipment(selectedEquipment.id);
      setIsDeleteDialogOpen(false);
      setSelectedEquipment(null);
    }
  }, [selectedEquipment, deleteEquipment]);

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

  // Equipment Form Component
  const EquipmentForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Equipamento</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: LED RGB para Piscina"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {EQUIPMENT_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição do equipamento"
        />
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
          placeholder="150.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL da Imagem</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="active">
          <span className="text-muted-foreground">Equipamento ativo</span>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Equipamentos</h1>
        <p className="text-muted-foreground">
          Gerencie equipamentos que podem ser associados aos produtos como LED, filtros, bombas, aquecedores, etc.
        </p>
      </div>

      <DataTable
        data={equipments}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Equipamentos"
        searchPlaceholder="Pesquisar equipamentos..."
        searchKeys={['name', 'description']}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogHeader>
          <DialogTitle>Criar Novo Equipamento</DialogTitle>
          <DialogDescription>
            Adicione um novo equipamento que pode ser associado aos produtos.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <EquipmentForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              Criar Equipamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogHeader>
          <DialogTitle>Editar Equipamento</DialogTitle>
          <DialogDescription>
            Edite as informações do equipamento selecionado.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <EquipmentForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(true)}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Equipamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o equipamento "{selectedEquipment?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEquipments;