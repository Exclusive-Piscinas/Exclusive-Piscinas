import { useState } from 'react';
import { useSiteContent, SiteContent } from '@/hooks/useSiteContent';
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
  DialogTrigger,
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

// Predefined content keys for better organization
const CONTENT_KEYS = [
  { value: 'hero_banner', label: 'Banner Principal' },
  { value: 'hero_title', label: 'Título Principal' },
  { value: 'hero_subtitle', label: 'Subtítulo Principal' },
  { value: 'about_section', label: 'Seção Sobre Nós' },
  { value: 'contact_info', label: 'Informações de Contato' },
  { value: 'footer_text', label: 'Texto do Rodapé' },
  { value: 'testimonials_title', label: 'Título dos Depoimentos' },
  { value: 'features_title', label: 'Título das Características' },
  { value: 'cta_section', label: 'Seção Call-to-Action' },
];

const AdminContent = () => {
  const { content, loading, createContent, updateContent, deleteContent } = useSiteContent();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SiteContent | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content: '',
    image_url: '',
    settings: '{}',
    active: true,
  });

  const columns: Column<SiteContent>[] = [
    {
      key: 'key',
      label: 'Chave',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="font-mono text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: 'title',
      label: 'Título',
      sortable: true,
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
    setFormData(prev => ({
      ...prev,
      key: '',
      title: '',
      content: '',
      image_url: '',
      settings: '{}',
      active: true,
    }));
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: SiteContent) => {
    setSelectedContent(item);
    setFormData(prev => ({
      ...prev,
      key: item.key,
      title: item.title || '',
      content: item.content || '',
      image_url: item.image_url || '',
      settings: JSON.stringify(item.settings || {}, null, 2),
      active: item.active || false,
    }));
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: SiteContent) => {
    setSelectedContent(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (isEdit: boolean) => {
    try {
      let settings = {};
      try {
        settings = JSON.parse(formData.settings);
      } catch (e) {
        console.error('Invalid JSON in settings');
      }

      const contentData = {
        key: formData.key,
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url,
        settings,
        active: formData.active,
      };

      if (isEdit && selectedContent) {
        await updateContent(selectedContent.id, contentData);
        setIsEditDialogOpen(false);
      } else {
        await createContent(contentData);
        setIsCreateDialogOpen(false);
      }

      resetForm();
      setSelectedContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedContent) {
      await deleteContent(selectedContent.id);
      setIsDeleteDialogOpen(false);
      setSelectedContent(null);
    }
  };

  const ContentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Chave do Conteúdo</Label>
          {isEdit ? (
            <Input
              id="key"
              value={formData.key}
              disabled
              className="font-mono text-sm"
            />
          ) : (
            <Select value={formData.key} onValueChange={(value) => setFormData(prev => ({ ...prev, key: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma chave" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_KEYS.map(key => (
                  <SelectItem key={key.value} value={key.value}>
                    {key.label} ({key.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Título amigável do conteúdo"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Conteúdo</Label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
          placeholder="Digite o conteúdo aqui..."
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem</Label>
        <ImageUploader
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          currentImages={formData.image_url ? [formData.image_url] : []}
          bucket="products"
          folder="site-content"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="settings">Configurações (JSON)</Label>
        <Textarea
          id="settings"
          value={formData.settings}
          onChange={(e) => setFormData(prev => ({ ...prev, settings: e.target.value }))}
          placeholder='{"button_text": "Saiba Mais", "link_url": "/sobre"}'
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="active">Conteúdo ativo</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Conteúdo</h1>
        <p className="text-muted-foreground">
          Gerencie todo o conteúdo dinâmico do site, incluindo banners, textos e imagens.
        </p>
      </div>

      <DataTable
        data={content}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Conteúdo do Site"
        searchPlaceholder="Pesquisar por chave ou título..."
        searchKeys={['key', 'title']}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Conteúdo</DialogTitle>
            <DialogDescription>
              Adicione um novo elemento de conteúdo para o site.
            </DialogDescription>
          </DialogHeader>
          
          <ContentForm />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(false)} className="btn-primary">
              Criar Conteúdo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Conteúdo</DialogTitle>
            <DialogDescription>
              Atualize as informações do conteúdo selecionado.
            </DialogDescription>
          </DialogHeader>
          
          <ContentForm isEdit />
          
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
              Tem certeza que deseja excluir o conteúdo "{selectedContent?.title || selectedContent?.key}"?
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

export default AdminContent;