import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAccessories, Accessory } from '@/hooks/useAccessories';
import { useToast } from '@/hooks/use-toast';
import { Package, Settings, Shield, Plus } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

interface ProductAccessoriesFieldProps {
  productId: string;
}

interface ProductAccessoryState extends Accessory {
  isAssociated: boolean;
  required: boolean;
  sortOrder: number;
}

export const ProductAccessoriesField = ({ productId }: ProductAccessoriesFieldProps) => {
  const { accessories, fetchProductAccessories, addAccessoryToProduct, removeAccessoryFromProduct } = useAccessories();
  const { toast } = useToast();
  const [productAccessories, setProductAccessories] = useState<ProductAccessoryState[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAccessories = async () => {
      setLoading(true);
      try {
        const associatedAccessories = await fetchProductAccessories(productId);
        
        // Combine all accessories with their association status
        const accessoriesWithState = accessories.map(accessory => {
          const associated = associatedAccessories.find(pa => pa.id === accessory.id);
          return {
            ...accessory,
            isAssociated: !!associated,
            required: associated?.required || false,
            sortOrder: associated?.sort_order || 0
          };
        });

        setProductAccessories(accessoriesWithState);
      } catch (error) {
        console.error('Error loading accessories:', error);
        toast({
          title: "Erro ao carregar acessórios",
          description: "Não foi possível carregar os acessórios do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (accessories.length > 0) {
      loadAccessories();
    }
  }, [productId, accessories, fetchProductAccessories, toast]);

  const handleToggleAccessory = async (accessoryId: string, isAssociated: boolean) => {
    try {
      if (isAssociated) {
        const accessory = productAccessories.find(acc => acc.id === accessoryId);
        if (accessory) {
          await addAccessoryToProduct(productId, accessoryId, accessory.required, accessory.sortOrder);
          toast({
            title: "Acessório adicionado",
            description: "Acessório foi associado ao produto com sucesso.",
          });
        }
      } else {
        await removeAccessoryFromProduct(productId, accessoryId);
        toast({
          title: "Acessório removido",
          description: "Acessório foi removido do produto com sucesso.",
        });
      }

      // Update local state
      setProductAccessories(prev => 
        prev.map(acc => 
          acc.id === accessoryId 
            ? { ...acc, isAssociated, required: isAssociated ? acc.required : false }
            : acc
        )
      );
    } catch (error) {
      console.error('Error toggling accessory:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o acessório.",
        variant: "destructive",
      });
    }
  };

  const handleRequiredChange = async (accessoryId: string, required: boolean) => {
    try {
      const accessory = productAccessories.find(acc => acc.id === accessoryId);
      if (accessory) {
        await addAccessoryToProduct(productId, accessoryId, required, accessory.sortOrder);
        
        setProductAccessories(prev => 
          prev.map(acc => 
            acc.id === accessoryId ? { ...acc, required } : acc
          )
        );
      }
    } catch (error) {
      console.error('Error updating required status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do acessório.",
        variant: "destructive",
      });
    }
  };

  const handleSortOrderChange = async (accessoryId: string, sortOrder: number) => {
    try {
      const accessory = productAccessories.find(acc => acc.id === accessoryId);
      if (accessory) {
        await addAccessoryToProduct(productId, accessoryId, accessory.required, sortOrder);
        
        setProductAccessories(prev => 
          prev.map(acc => 
            acc.id === accessoryId ? { ...acc, sortOrder } : acc
          )
        );
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a ordem do acessório.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando acessórios...</p>
        </div>
      </div>
    );
  }

  const associatedAccessories = productAccessories.filter(acc => acc.isAssociated);
  const availableAccessories = productAccessories.filter(acc => !acc.isAssociated);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Gerenciar Acessórios do Produto</h3>
      </div>

      {/* Acessórios Associados */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <h4 className="font-medium">Acessórios Associados ({associatedAccessories.length})</h4>
        </div>

        {associatedAccessories.length > 0 ? (
          <div className="grid gap-4">
            {associatedAccessories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(accessory => (
                <Card key={accessory.id} className="border-accent/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {accessory.image_url && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <LazyImage 
                            src={accessory.image_url} 
                            alt={accessory.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-semibold">{accessory.name}</h5>
                            {accessory.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {accessory.description}
                              </p>
                            )}
                            <p className="text-sm font-medium text-accent mt-1">
                              R$ {(accessory.price || 0).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleAccessory(accessory.id, false)}
                          >
                            Remover
                          </Button>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${accessory.id}`}
                              checked={accessory.required}
                              onCheckedChange={(checked) => 
                                handleRequiredChange(accessory.id, !!checked)
                              }
                            />
                            <Label htmlFor={`required-${accessory.id}`} className="text-sm">
                              Obrigatório
                            </Label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Label htmlFor={`sort-${accessory.id}`} className="text-sm">
                              Ordem:
                            </Label>
                            <Input
                              id={`sort-${accessory.id}`}
                              type="number"
                              value={accessory.sortOrder}
                              onChange={(e) => 
                                handleSortOrderChange(accessory.id, parseInt(e.target.value) || 0)
                              }
                              className="w-20"
                              min="0"
                            />
                          </div>

                          {accessory.required && (
                            <Badge className="bg-destructive/20 text-destructive">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum acessório associado a este produto</p>
          </div>
        )}
      </div>

      {/* Acessórios Disponíveis */}
      {availableAccessories.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium">Acessórios Disponíveis ({availableAccessories.length})</h4>
          </div>

          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {availableAccessories.map(accessory => (
              <Card key={accessory.id} className="border-border/50 hover:border-accent/50 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {accessory.image_url && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <LazyImage 
                          src={accessory.image_url} 
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h6 className="font-medium text-sm">{accessory.name}</h6>
                      <p className="text-xs text-accent">
                        R$ {(accessory.price || 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAccessory(accessory.id, true)}
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};