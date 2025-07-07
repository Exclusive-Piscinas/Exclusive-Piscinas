import { useState, useCallback } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useProductForm } from '@/hooks/useProductForm';
import { DataTable } from '@/components/admin/DataTable';
import { createProductColumns } from '@/components/admin/ProductTable';
import { ProductDialogs } from '@/components/admin/ProductDialogs';

const AdminProducts = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form management
  const {
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
  } = useProductForm();

  // Table columns
  const columns = createProductColumns(categories);

  // Action handlers
  const handleCreate = useCallback(() => {
    resetForm();
    setIsCreateDialogOpen(true);
  }, [resetForm]);

  const handleEdit = useCallback((item: Product) => {
    setSelectedProduct(item);
    loadProductData(item);
    setIsEditDialogOpen(true);
  }, [loadProductData]);

  const handleDelete = useCallback((item: Product) => {
    setSelectedProduct(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async (isEdit: boolean) => {
    try {
      const productData = prepareSubmissionData();

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
  }, [prepareSubmissionData, selectedProduct, updateProduct, createProduct, resetForm]);

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  }, [selectedProduct, deleteProduct]);

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

      <ProductDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedProduct={selectedProduct}
        formData={formData}
        categories={categories}
        newFeature={newFeature}
        onFieldChange={handleFieldChange}
        onNewFeatureChange={handleNewFeatureChange}
        onAddFeature={addFeature}
        onRemoveFeature={removeFeature}
        generateSlug={generateSlug}
        onSubmit={handleSubmit}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminProducts;