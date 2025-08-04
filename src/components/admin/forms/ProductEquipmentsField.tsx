import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEquipments, Equipment } from '@/hooks/useEquipments';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';

interface ProductEquipmentsFieldProps {
  productId: string;
}

interface ProductEquipmentState extends Equipment {
  isAssociated: boolean;
  required: boolean;
  sortOrder: number;
}

const ProductEquipmentsField = ({ productId }: ProductEquipmentsFieldProps) => {
  const { equipments, fetchProductEquipments, addEquipmentToProduct, removeEquipmentFromProduct } = useEquipments();
  const [productEquipments, setProductEquipments] = useState<ProductEquipmentState[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch product equipments
        const productEquipmentsData = await fetchProductEquipments(productId);
        
        // Create a map of associated equipments with their settings
        const associatedMap = new Map(
          productEquipmentsData.map(pe => [
            pe.id,
            {
              required: pe.required,
              sortOrder: pe.sort_order,
            }
          ])
        );

        // Combine all equipments with association status
        const combinedData: ProductEquipmentState[] = equipments.map(equipment => ({
          ...equipment,
          isAssociated: associatedMap.has(equipment.id),
          required: associatedMap.get(equipment.id)?.required || false,
          sortOrder: associatedMap.get(equipment.id)?.sortOrder || 0,
        }));

        setProductEquipments(combinedData);
      } catch (error) {
        console.error('Error loading equipments:', error);
        toast({
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar os equipamentos do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId, equipments, fetchProductEquipments, toast]);

  const handleToggleEquipment = async (equipmentId: string, isAssociated: boolean) => {
    if (isAssociated) {
      // Add equipment to product
      const result = await addEquipmentToProduct(productId, equipmentId, false, 0);
      if (!result.error) {
        setProductEquipments(prev => 
          prev.map(eq => 
            eq.id === equipmentId 
              ? { ...eq, isAssociated: true, required: false, sortOrder: 0 }
              : eq
          )
        );
      }
    } else {
      // Remove equipment from product
      const result = await removeEquipmentFromProduct(productId, equipmentId);
      if (!result.error) {
        setProductEquipments(prev => 
          prev.map(eq => 
            eq.id === equipmentId 
              ? { ...eq, isAssociated: false, required: false, sortOrder: 0 }
              : eq
          )
        );
      }
    }
  };

  const handleRequiredChange = async (equipmentId: string, required: boolean) => {
    // Update locally first for immediate UI feedback
    setProductEquipments(prev => 
      prev.map(eq => 
        eq.id === equipmentId 
          ? { ...eq, required }
          : eq
      )
    );

    // TODO: Update in database - this might require a separate API endpoint
    // For now, we're just updating the UI
  };

  const handleSortOrderChange = async (equipmentId: string, sortOrder: number) => {
    // Update locally first for immediate UI feedback
    setProductEquipments(prev => 
      prev.map(eq => 
        eq.id === equipmentId 
          ? { ...eq, sortOrder }
          : eq
      )
    );

    // TODO: Update in database - this might require a separate API endpoint
    // For now, we're just updating the UI
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <Package className="h-8 w-8 text-muted-foreground animate-pulse" />
          <p className="text-sm text-muted-foreground">Carregando equipamentos...</p>
        </div>
      </div>
    );
  }

  const associatedEquipments = productEquipments.filter(eq => eq.isAssociated);
  const availableEquipments = productEquipments.filter(eq => !eq.isAssociated);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Equipamentos Associados</h3>
      
      {associatedEquipments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum equipamento associado ainda.</p>
          <p className="text-sm">Adicione equipamentos da lista abaixo.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {associatedEquipments.map((equipment) => (
            <Card key={equipment.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {equipment.image_url ? (
                    <img 
                      src={equipment.image_url} 
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{equipment.name}</h4>
                      {equipment.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {equipment.description}
                        </p>
                      )}
                      {equipment.price && (
                        <p className="text-sm font-medium text-green-600 mt-1">
                          R$ {equipment.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleEquipment(equipment.id, false)}
                    >
                      Remover
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`required-${equipment.id}`}
                        checked={equipment.required}
                        onCheckedChange={(checked) => 
                          handleRequiredChange(equipment.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`required-${equipment.id}`} className="text-sm">
                        Obrigatório
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`sort-${equipment.id}`} className="text-sm">
                        Ordem:
                      </Label>
                      <Input
                        id={`sort-${equipment.id}`}
                        type="number"
                        value={equipment.sortOrder}
                        onChange={(e) => 
                          handleSortOrderChange(equipment.id, parseInt(e.target.value) || 0)
                        }
                        className="w-20"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4 mt-8">Equipamentos Disponíveis</h3>
      
      {availableEquipments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Todos os equipamentos já foram associados.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {availableEquipments.map((equipment) => (
            <Card key={equipment.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {equipment.image_url ? (
                    <img 
                      src={equipment.image_url} 
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{equipment.name}</h4>
                  {equipment.price && (
                    <p className="text-sm text-green-600">
                      R$ {equipment.price.toFixed(2)}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleEquipment(equipment.id, true)}
                >
                  Adicionar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductEquipmentsField;