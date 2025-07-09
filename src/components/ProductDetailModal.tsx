import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, ShoppingCart, Star, Heart } from 'lucide-react';
import { useAccessories, ProductAccessory } from '@/hooks/useAccessories';
import { Product } from '@/hooks/useProducts';
import LazyImage from '@/components/LazyImage';

interface SelectedAccessory extends ProductAccessory {
  quantity: number;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, accessories: SelectedAccessory[]) => void;
}

export const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}: ProductDetailModalProps) => {
  const { fetchProductAccessories } = useAccessories();
  const [productAccessories, setProductAccessories] = useState<ProductAccessory[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<SelectedAccessory[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const allImages = product ? [
    product.main_image,
    ...(product.images || [])
  ].filter(Boolean) : [];

  useEffect(() => {
    if (product) {
      fetchProductAccessories(product.id).then(accessories => {
        setProductAccessories(accessories);
        // Auto-select required accessories
        const requiredAccessories = accessories
          .filter(acc => acc.required)
          .map(acc => ({ ...acc, quantity: 1 }));
        setSelectedAccessories(requiredAccessories);
      });
      setCurrentImageIndex(0);
    }
  }, [product, fetchProductAccessories]);

  useEffect(() => {
    const productPrice = product?.price || 0;
    const accessoriesPrice = selectedAccessories.reduce(
      (sum, acc) => sum + (acc.price || 0) * acc.quantity, 
      0
    );
    setTotalPrice(productPrice + accessoriesPrice);
  }, [product, selectedAccessories]);

  const toggleAccessory = (accessory: ProductAccessory) => {
    if (accessory.required) return; // Can't toggle required accessories

    setSelectedAccessories(prev => {
      const existing = prev.find(acc => acc.id === accessory.id);
      if (existing) {
        return prev.filter(acc => acc.id !== accessory.id);
      } else {
        return [...prev, { ...accessory, quantity: 1 }];
      }
    });
  };

  const updateAccessoryQuantity = (accessoryId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedAccessories(prev =>
      prev.map(acc =>
        acc.id === accessoryId ? { ...acc, quantity } : acc
      )
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart(product, selectedAccessories);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              {allImages.length > 0 ? (
                    <LazyImage
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Sem imagem</span>
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <LazyImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category && (
                  <Badge variant="outline">{product.category.name}</Badge>
                )}
                {product.featured && (
                  <Badge variant="default" className="bg-accent">
                    <Star className="w-3 h-3 mr-1" />
                    Destaque
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-accent">
                  R$ {(product.price || 0).toLocaleString('pt-BR')}
                </span>
                {product.sale_price && product.sale_price < (product.price || 0) && (
                  <span className="text-lg line-through text-muted-foreground">
                    R$ {product.sale_price.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>

              {product.short_description && (
                <p className="text-lg text-muted-foreground mb-4">
                  {product.short_description}
                </p>
              )}
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
                <TabsTrigger value="accessories">
                  Acessórios ({selectedAccessories.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <div className="prose max-w-none">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p className="text-muted-foreground">Descrição não disponível.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                {product.features && product.features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma característica disponível.</p>
                )}
              </TabsContent>
              
              <TabsContent value="accessories" className="space-y-4">
                {productAccessories.length > 0 ? (
                  <div className="space-y-3">
                    {productAccessories.map((accessory) => {
                      const isSelected = selectedAccessories.some(acc => acc.id === accessory.id);
                      const selectedAcc = selectedAccessories.find(acc => acc.id === accessory.id);
                      
                      return (
                        <Card key={accessory.id} className={`transition-all ${isSelected ? 'ring-2 ring-accent' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleAccessory(accessory)}
                                disabled={accessory.required}
                                className="mt-1"
                              />
                              
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
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{accessory.name}</h4>
                                  {accessory.required && (
                                    <Badge variant="secondary" className="text-xs">
                                      Obrigatório
                                    </Badge>
                                  )}
                                </div>
                                
                                {accessory.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {accessory.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-accent">
                                    R$ {(accessory.price || 0).toLocaleString('pt-BR')}
                                  </span>
                                  
                                  {isSelected && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateAccessoryQuantity(accessory.id, (selectedAcc?.quantity || 1) - 1)}
                                        disabled={accessory.required || (selectedAcc?.quantity || 1) <= 1}
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <span className="w-8 text-center">
                                        {selectedAcc?.quantity || 1}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateAccessoryQuantity(accessory.id, (selectedAcc?.quantity || 1) + 1)}
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum acessório disponível para este produto.</p>
                )}
              </TabsContent>
            </Tabs>

            {/* Add to Cart Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-accent">
                  R$ {totalPrice.toLocaleString('pt-BR')}
                </span>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="w-full btn-primary"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Orçamento
              </Button>
              
              {selectedAccessories.length > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Incluindo {selectedAccessories.length} acessório(s) selecionado(s)
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;