import { useState, useEffect } from 'react';
import { useAccessories, Accessory, ProductAccessory } from '@/hooks/useAccessories';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Package, Loader2 } from 'lucide-react';

interface ProductAccessoriesFieldProps {
  productId: string;
}

interface AccessoryState extends Accessory {
  isAssociated: boolean;
  required: boolean;
  sortOrder: number;
}

const ProductAccessoriesField = ({ productId }: ProductAccessoriesFieldProps) => {
  const { accessories, loading, fetchProductAccessories, addAccessoryToProduct, removeAccessoryFromProduct } = useAccessories();
  const [accessoryStates, setAccessoryStates] = useState<AccessoryState[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadAccessoriesData = async () => {
      if (!productId || accessories.length === 0) return;

      try {
        const productAccessories = await fetchProductAccessories(productId);
        
        const states = accessories.map(accessory => {
          const productAccessory = productAccessories.find(pa => pa.id === accessory.id);
          return {
            ...accessory,
            isAssociated: !!productAccessory,
            required: productAccessory?.required || false,
            sortOrder: productAccessory?.sort_order || 0
          };
        });
        
        setAccessoryStates(states);
      } catch (error) {
        console.error('Error loading accessories data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os acessórios do produto.",
          variant: "destructive",
        });
      }
    };

    loadAccessoriesData();
  }, [productId, accessories, fetchProductAccessories, toast]);

  const handleToggleAccessory = async (accessoryId: string, isAssociated: boolean) => {
    setLoadingStates(prev => ({ ...prev, [accessoryId]: true }));
    
    try {
      if (isAssociated) {
        // Add accessory to product
        const accessoryState = accessoryStates.find(a => a.id === accessoryId);
        await addAccessoryToProduct(productId, accessoryId, accessoryState?.required || false, accessoryState?.sortOrder || 0);
        
        setAccessoryStates(prev => 
          prev.map(a => a.id === accessoryId ? { ...a, isAssociated: true } : a)
        );
      } else {
        // Remove accessory from product
        await removeAccessoryFromProduct(productId, accessoryId);
        
        setAccessoryStates(prev => 
          prev.map(a => a.id === accessoryId ? { ...a, isAssociated: false, required: false, sortOrder: 0 } : a)
        );
      }
    } catch (error) {
      console.error('Error toggling accessory:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [accessoryId]: false }));
    }
  };

  const handleRequiredChange = (accessoryId: string, required: boolean) => {
    setAccessoryStates(prev => 
      prev.map(a => a.id === accessoryId ? { ...a, required } : a)
    );
    // Note: This only updates local state. To persist, we'd need to update the product_accessories table
  };

  const handleSortOrderChange = (accessoryId: string, sortOrder: number) => {
    setAccessoryStates(prev => 
      prev.map(a => a.id === accessoryId ? { ...a, sortOrder } : a)
    );
    // Note: This only updates local state. To persist, we'd need to update the product_accessories table
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>Carregando acessórios...</span>
        </div>
      </div>
    );
  }

  const associatedAccessories = accessoryStates.filter(a => a.isAssociated);
  const availableAccessories = accessoryStates.filter(a => !a.isAssociated);

  return (
    <div className="space-y-6">
      {/* Associated Accessories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Acessórios Associados</h3>
        {associatedAccessories.length === 0 ? (
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-muted-foreground">Nenhum acessório associado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedAccessories.map(accessory => (
              <div key={accessory.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {accessory.image_url && (
                    <img 
                      src={accessory.image_url} 
                      alt={accessory.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{accessory.name}</h4>
                      <Badge variant="secondary">Associado</Badge>
                    </div>
                    {accessory.description && (
                      <p className="text-sm text-muted-foreground">{accessory.description}</p>
                    )}
                    {accessory.price && (
                      <p className="text-sm font-medium">R$ {accessory.price.toFixed(2)}</p>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-${accessory.id}`}
                          checked={accessory.required}
                          onCheckedChange={(checked) => handleRequiredChange(accessory.id, checked)}
                        />
                        <Label htmlFor={`required-${accessory.id}`} className="text-sm">
                          Obrigatório
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`sort-${accessory.id}`} className="text-sm">
                          Ordem:
                        </Label>
                        <Input
                          id={`sort-${accessory.id}`}
                          type="number"
                          value={accessory.sortOrder}
                          onChange={(e) => handleSortOrderChange(accessory.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAccessory(accessory.id, false)}
                    disabled={loadingStates[accessory.id]}
                  >
                    {loadingStates[accessory.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Remover'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Accessories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Acessórios Disponíveis</h3>
        {availableAccessories.length === 0 ? (
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-muted-foreground">Todos os acessórios já estão associados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableAccessories.map(accessory => (
              <div key={accessory.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {accessory.image_url && (
                    <img 
                      src={accessory.image_url} 
                      alt={accessory.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium">{accessory.name}</h4>
                    {accessory.description && (
                      <p className="text-sm text-muted-foreground">{accessory.description}</p>
                    )}
                    {accessory.price && (
                      <p className="text-sm font-medium">R$ {accessory.price.toFixed(2)}</p>
                    )}
                    {accessory.category && (
                      <Badge variant="outline">{accessory.category}</Badge>
                    )}
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleToggleAccessory(accessory.id, true)}
                    disabled={loadingStates[accessory.id]}
                  >
                    {loadingStates[accessory.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Adicionar'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAccessoriesField;