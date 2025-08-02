import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ProductForm } from '@/components/admin/ProductForm';
import { Product } from '@/hooks/useProducts';
import { ProductFormData } from '@/hooks/useProductForm';

interface Category {
  id: string;
  name: string;
}

interface ProductDialogsProps {
  // Create Dialog
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  
  // Edit Dialog
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  
  // Delete Dialog
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  
  // Form data
  formData: ProductFormData;
  categories: Category[];
  newFeature: string;
  
  // Form handlers
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  onNewFeatureChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  generateSlug: (name: string) => string;
  
  // Submit handlers
  onSubmit: (isEdit: boolean) => void;
  onDeleteConfirm: () => void;
}

export const ProductDialogs = memo(({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedProduct,
  formData,
  categories,
  newFeature,
  onFieldChange,
  onNewFeatureChange,
  onAddFeature,
  onRemoveFeature,
  generateSlug,
  onSubmit,
  onDeleteConfirm,
}: ProductDialogsProps) => (
  <>
    {/* Create Dialog */}
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao catálogo com todas as informações necessárias.
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          formData={formData}
          categories={categories}
          newFeature={newFeature}
          onFieldChange={onFieldChange}
          onNewFeatureChange={onNewFeatureChange}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          generateSlug={generateSlug}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(false)} className="btn-primary">
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
        
        <ProductForm
          formData={formData}
          categories={categories}
          newFeature={newFeature}
          onFieldChange={onFieldChange}
          onNewFeatureChange={onNewFeatureChange}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          generateSlug={generateSlug}
          isEdit
          productId={selectedProduct?.id}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(true)} className="btn-primary">
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
          <AlertDialogAction onClick={onDeleteConfirm} className="btn-destructive">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
));

ProductDialogs.displayName = 'ProductDialogs';