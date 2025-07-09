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
  const {
    fetchProductAccessories
  } = useAccessories();
  const [productAccessories, setProductAccessories] = useState<ProductAccessory[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<SelectedAccessory[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const allImages = product ? [product.main_image, ...(product.images || [])].filter(Boolean) : [];
  useEffect(() => {
    if (product) {
      fetchProductAccessories(product.id).then(accessories => {
        setProductAccessories(accessories);
        // Auto-select required accessories
        const requiredAccessories = accessories.filter(acc => acc.required).map(acc => ({
          ...acc,
          quantity: 1
        }));
        setSelectedAccessories(requiredAccessories);
      });
      setCurrentImageIndex(0);
    }
  }, [product, fetchProductAccessories]);
  useEffect(() => {
    const productPrice = product?.price || 0;
    const accessoriesPrice = selectedAccessories.reduce((sum, acc) => sum + (acc.price || 0) * acc.quantity, 0);
    setTotalPrice(productPrice + accessoriesPrice);
  }, [product, selectedAccessories]);
  const toggleAccessory = (accessory: ProductAccessory) => {
    if (accessory.required) return; // Can't toggle required accessories

    setSelectedAccessories(prev => {
      const existing = prev.find(acc => acc.id === accessory.id);
      if (existing) {
        return prev.filter(acc => acc.id !== accessory.id);
      } else {
        return [...prev, {
          ...accessory,
          quantity: 1
        }];
      }
    });
  };
  const updateAccessoryQuantity = (accessoryId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedAccessories(prev => prev.map(acc => acc.id === accessoryId ? {
      ...acc,
      quantity
    } : acc));
  };
  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart(product, selectedAccessories);
    onClose();
  };
  if (!product) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-card border-border/30">
        <DialogHeader className="space-y-4 pb-6 border-b border-border/30">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-dark shadow-elegant group">
              {allImages.length > 0 ? <LazyImage src={allImages[currentImageIndex]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-lg">Sem imagem disponível</span>
                </div>}
              
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {allImages.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === index ? 'border-accent shadow-glow scale-110' : 'border-border/30 hover:border-accent/50 hover:scale-105'}`}>
                    <LazyImage src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>)}
              </div>}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {product.category && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1">
                    {product.category.name}
                  </Badge>}
                {product.featured && <Badge className="bg-gradient-accent text-accent-foreground px-3 py-1 shadow-glow">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Produto Destaque
                  </Badge>}
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-dark rounded-xl border border-border/30 bg-gray-700">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Preço</span>
                  <span className=" bg-clip-text text-gray-50 text-4xl font-bold">
                    R$ {(product.price || 0).toLocaleString('pt-BR')}
                  </span>
                </div>
                {product.sale_price && product.sale_price < (product.price || 0) && <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Preço anterior</span>
                    <span className="text-xl line-through text-muted-foreground">
                      R$ {product.sale_price.toLocaleString('pt-BR')}
                    </span>
                  </div>}
              </div>

              {product.short_description && <div className="p-4 bg-card/50 rounded-xl border border-border/30">
                  <p className="text-lg text-foreground leading-relaxed">
                    {product.short_description}
                  </p>
                </div>}
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/30 p-1 rounded-xl">
                <TabsTrigger value="description" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant rounded-lg transition-all duration-300">
                  Descrição
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant rounded-lg transition-all duration-300">
                  Características
                </TabsTrigger>
                <TabsTrigger value="accessories" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant rounded-lg transition-all duration-300">
                  Acessórios ({selectedAccessories.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 mt-6">
                <div className="p-6 bg-gradient-dark rounded-xl border border-border/30">
                  <div className="prose prose-invert max-w-none">
                    {product.description ? <div dangerouslySetInnerHTML={{
                    __html: product.description
                  }} className="text-foreground leading-relaxed [&_p]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground [&_strong]:text-accent [&_em]:text-accent-glow" /> : <p className="text-muted-foreground text-center py-8">Descrição não disponível para este produto.</p>}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4 mt-6">
                <div className="p-6 bg-gradient-dark rounded-xl border border-border/30">
                  {product.features && product.features.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => <div key={index} className="flex items-center gap-3 p-3 bg-card/30 rounded-lg border border-border/20">
                          <div className="w-3 h-3 bg-gradient-accent rounded-full shadow-glow flex-shrink-0" />
                          <span className="text-foreground font-medium">{feature}</span>
                        </div>)}
                    </div> : <p className="text-muted-foreground text-center py-8">Nenhuma característica disponível para este produto.</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="accessories" className="space-y-4 mt-6">
                <div className="p-6 bg-gradient-dark rounded-xl border border-border/30">
                  {productAccessories.length > 0 ? <div className="space-y-4">
                      {productAccessories.map(accessory => {
                    const isSelected = selectedAccessories.some(acc => acc.id === accessory.id);
                    const selectedAcc = selectedAccessories.find(acc => acc.id === accessory.id);
                    return <Card key={accessory.id} className={`transition-all duration-300 border border-border/30 ${isSelected ? 'ring-2 ring-accent shadow-glow bg-gradient-card' : 'hover:border-accent/50 bg-card/50'}`}>
                            <CardContent className="p-5">
                              <div className="flex items-start gap-4">
                                <Checkbox checked={isSelected} onCheckedChange={() => toggleAccessory(accessory)} disabled={accessory.required} className="mt-1 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                                
                                {accessory.image_url && <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border/30">
                                    <LazyImage src={accessory.image_url} alt={accessory.name} className="w-full h-full object-cover" />
                                  </div>}
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-foreground text-lg">{accessory.name}</h4>
                                    {accessory.required && <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
                                        Obrigatório
                                      </Badge>}
                                  </div>
                                  
                                  {accessory.description && <p className="text-muted-foreground leading-relaxed">
                                      {accessory.description}
                                    </p>}
                                  
                                  <div className="flex items-center justify-between pt-2">
                                    <span className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                                      R$ {(accessory.price || 0).toLocaleString('pt-BR')}
                                    </span>
                                    
                                    {isSelected && <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-2">
                                        <Button size="sm" variant="outline" onClick={() => updateAccessoryQuantity(accessory.id, (selectedAcc?.quantity || 1) - 1)} disabled={accessory.required || (selectedAcc?.quantity || 1) <= 1} className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground">
                                          <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-8 text-center font-semibold text-foreground">
                                          {selectedAcc?.quantity || 1}
                                        </span>
                                        <Button size="sm" variant="outline" onClick={() => updateAccessoryQuantity(accessory.id, (selectedAcc?.quantity || 1) + 1)} className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground">
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                      </div>}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>;
                  })}
                    </div> : <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">Nenhum acessório disponível para este produto.</p>
                    </div>}
                </div>
              </TabsContent>
            </Tabs>

            {/* Add to Cart Section */}
            <div className="border-t border-border/30 pt-6">
              <div className="bg-gradient-dark p-6 rounded-xl border border-border/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-medium text-foreground">Total do Produto:</span>
                  <div className="text-right">
                    <span className="bg-gradient-accent bg-clip-text text-transparent text-3xl font-bold">
                      R$ {totalPrice.toLocaleString('pt-BR')}
                    </span>
                    {selectedAccessories.length > 0 && <p className="text-sm text-muted-foreground">
                        Produto + {selectedAccessories.length} acessório(s)
                      </p>}
                  </div>
                </div>
                
                <Button onClick={handleAddToCart} className="w-full btn-primary text-lg py-6 rounded-xl shadow-elegant" size="lg">
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Adicionar ao Orçamento
                </Button>
                
                {selectedAccessories.length > 0 && <div className="pt-2 border-t border-border/20">
                    <p className="text-sm text-muted-foreground text-center">
                      ✅ Incluindo {selectedAccessories.length} acessório(s) selecionado(s)
                    </p>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default ProductDetailModal;