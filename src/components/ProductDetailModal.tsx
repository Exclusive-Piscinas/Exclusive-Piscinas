import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, ShoppingCart, Star, Heart, ZoomIn, X, ChevronLeft, ChevronRight, Package, Shield, Award, Sparkles, Eye, Info, Settings } from 'lucide-react';
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
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
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
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };
  if (!product) return null;
  return <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-background border-border/30 shadow-elegant rounded-3xl p-0">
          {/* Enhanced Header with original color scheme */}
          <div className="relative bg-gradient-primary p-8 rounded-t-3xl border-b border-border/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary to-primary-glow/80 rounded-t-3xl bg-slate-900"></div>
            <div className="relative z-10">
              <DialogHeader className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <DialogTitle className="text-4xl md:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">
                      {product.name}
                    </DialogTitle>
                    <div className="flex items-center gap-4">
                      {product.category && <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                          {product.category.name}
                        </Badge>}
                      {product.featured && <Badge className="bg-accent text-accent-foreground border-accent px-4 py-2 text-sm font-semibold shadow-glow">
                          <Star className="w-4 h-4 mr-2 fill-current" />
                          Produto Destaque
                        </Badge>}
                      <Badge className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 px-4 py-2 text-sm font-medium">
                        <Shield className="w-4 h-4 mr-2" />
                        Garantia Premium
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full w-12 h-12 transition-all duration-300">
                      <Heart className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'fill-accent text-accent scale-110' : ''}`} />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </div>
          </div>

          <div className="p-8 bg-gradient-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Enhanced Product Images with original styling */}
              <div className="space-y-6">
                <div className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-card shadow-elegant border border-border/30">
                    {allImages.length > 0 ? <>
                        <LazyImage src={allImages[currentImageIndex]} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        
                        {/* Enhanced overlay with original colors */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute top-6 right-6 flex gap-3">
                            <Button size="icon" variant="secondary" onClick={() => setIsImageZoomed(true)} className="bg-card/90 hover:bg-card text-foreground rounded-xl shadow-elegant backdrop-blur-sm border border-border/30">
                              <ZoomIn className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Navigation arrows with original styling */}
                        {allImages.length > 1 && <>
                            <Button size="icon" variant="secondary" onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground rounded-xl shadow-elegant backdrop-blur-sm border border-border/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="secondary" onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground rounded-xl shadow-elegant backdrop-blur-sm border border-border/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </>}

                        {/* Enhanced image counter */}
                        {allImages.length > 1 && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/80 text-foreground px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-border/30">
                            {currentImageIndex + 1} de {allImages.length}
                          </div>}
                      </> : <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <div className="text-center space-y-4">
                          <Package className="w-20 h-20 text-muted-foreground mx-auto" />
                          <span className="text-muted-foreground text-lg font-medium">Sem imagem disponível</span>
                        </div>
                      </div>}
                  </div>
                  
                  {/* Enhanced thumbnail gallery */}
                  {allImages.length > 1 && <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {allImages.map((image, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === index ? 'border-accent shadow-glow scale-110 ring-2 ring-accent/30' : 'border-border/30 hover:border-accent/50 hover:scale-105'}`}>
                          <LazyImage src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                        </button>)}
                    </div>}
                </div>
              </div>

              {/* Enhanced Product Details with original colors */}
              <div className="space-y-8">
                {/* Enhanced price section */}
                <div className="bg-gradient-card p-8 rounded-2xl border border-border/30 shadow-elegant">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Preço do Produto</span>
                      <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-bold bg-clip-text text-slate-50">
                          R$ {(product.price || 0).toLocaleString('pt-BR')}
                        </span>
                        {product.sale_price && product.sale_price < (product.price || 0) && <span className="text-xl line-through text-muted-foreground">
                            R$ {product.sale_price.toLocaleString('pt-BR')}
                          </span>}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-semibold">Garantia 5 anos</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span className="text-xs">Qualidade Premium</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced short description */}
                {product.short_description && <div className="bg-card/50 p-6 rounded-2xl border border-border/30">
                    <p className="text-lg text-foreground leading-relaxed font-medium">
                      {product.short_description}
                    </p>
                  </div>}

                {/* Enhanced tabs with original styling */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-16 border border-border/30">
                    <TabsTrigger value="description" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-elegant rounded-lg transition-all duration-300 font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Descrição
                    </TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-elegant rounded-lg transition-all duration-300 font-semibold flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Características
                    </TabsTrigger>
                    <TabsTrigger value="accessories" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-elegant rounded-lg transition-all duration-300 font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Acessórios ({selectedAccessories.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="space-y-4 mt-8">
                    <div className="bg-gradient-card p-8 rounded-2xl border border-border/30 shadow-card">
                      <div className="prose prose-invert max-w-none">
                        {product.description ? <div dangerouslySetInnerHTML={{
                        __html: product.description
                      }} className="text-foreground leading-relaxed [&_p]:mb-4 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-accent [&_em]:text-accent" /> : <div className="text-center py-16">
                            <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                            <p className="text-muted-foreground text-xl">Descrição não disponível para este produto.</p>
                          </div>}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="space-y-4 mt-8">
                    <div className="bg-gradient-card p-8 rounded-2xl border border-border/30 shadow-card">
                      {product.features && product.features.length > 0 ? <div className="grid grid-cols-1 gap-4">
                          {product.features.map((feature, index) => <div key={index} className="flex items-center gap-4 p-6 bg-card/50 rounded-xl border border-border/20 hover:shadow-glow transition-all duration-300 group">
                              <div className="w-3 h-3 bg-gradient-accent rounded-full shadow-glow flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                              <span className="text-foreground font-semibold text-lg">{feature}</span>
                            </div>)}
                        </div> : <div className="text-center py-16">
                          <Award className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                          <p className="text-muted-foreground text-xl">Nenhuma característica disponível para este produto.</p>
                        </div>}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="accessories" className="space-y-4 mt-8">
                    <div className="bg-gradient-card p-8 rounded-2xl border border-border/30 shadow-card">
                      {productAccessories.length > 0 ? <div className="space-y-6">
                          {productAccessories.map(accessory => {
                        const isSelected = selectedAccessories.some(acc => acc.id === accessory.id);
                        const selectedAcc = selectedAccessories.find(acc => acc.id === accessory.id);
                        return <Card key={accessory.id} className={`transition-all duration-300 border-2 hover:shadow-elegant ${isSelected ? 'border-accent shadow-glow bg-gradient-card' : 'border-border/30 hover:border-accent/50 bg-card/30'}`}>
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-6">
                                    <Checkbox checked={isSelected} onCheckedChange={() => toggleAccessory(accessory)} disabled={accessory.required} className="mt-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent w-5 h-5" />
                                    
                                    {accessory.image_url && <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-border/30 shadow-card">
                                        <LazyImage src={accessory.image_url} alt={accessory.name} className="w-full h-full object-cover" />
                                      </div>}
                                    
                                    <div className="flex-1 space-y-4">
                                      <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-foreground text-xl">{accessory.name}</h4>
                                        {accessory.required && <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs font-semibold">
                                            Obrigatório
                                          </Badge>}
                                      </div>
                                      
                                      {accessory.description && <p className="text-muted-foreground leading-relaxed">
                                          {accessory.description}
                                        </p>}
                                      
                                      <div className="flex items-center justify-between pt-2">
                                        <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                                          R$ {(accessory.price || 0).toLocaleString('pt-BR')}
                                        </span>
                                        
                                        {isSelected && <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 border border-border/30">
                                            <Button size="sm" variant="outline" onClick={() => updateAccessoryQuantity(accessory.id, (selectedAcc?.quantity || 1) - 1)} disabled={accessory.required || (selectedAcc?.quantity || 1) <= 1} className="w-10 h-10 p-0 hover:bg-accent hover:text-accent-foreground hover:border-accent rounded-lg">
                                              <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="w-12 text-center font-bold text-foreground text-lg">
                                              {selectedAcc?.quantity || 1}
                                            </span>
                                            <Button size="sm" variant="outline" onClick={() => updateAccessoryQuantity(accessory.id, (selectedAcc?.quantity || 1) + 1)} className="w-10 h-10 p-0 hover:bg-accent hover:text-accent-foreground hover:border-accent rounded-lg">
                                              <Plus className="w-4 h-4" />
                                            </Button>
                                          </div>}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>;
                      })}
                        </div> : <div className="text-center py-20">
                          <Sparkles className="w-24 h-24 text-muted-foreground mx-auto mb-8" />
                          <p className="text-muted-foreground text-2xl font-medium">Nenhum acessório disponível para este produto.</p>
                          <p className="text-muted-foreground/70 text-sm mt-3">Novos acessórios podem ser adicionados em breve.</p>
                        </div>}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Enhanced Add to Cart Section with original colors */}
                <div className="bg-gradient-primary p-8 rounded-2xl shadow-elegant border border-primary/30">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-primary-foreground">
                      <span className="text-xl font-semibold">Total do Produto:</span>
                      <div className="text-right">
                        <span className="text-4xl font-bold">
                          R$ {totalPrice.toLocaleString('pt-BR')}
                        </span>
                        {selectedAccessories.length > 0 && <p className="text-primary-foreground/80 text-sm mt-1">
                            Produto + {selectedAccessories.length} acessório(s)
                          </p>}
                      </div>
                    </div>
                    
                    <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent-glow text-accent-foreground text-xl py-6 rounded-xl shadow-glow font-bold transition-all duration-300 hover:scale-105 border border-accent/30" size="lg">
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Adicionar ao Orçamento
                    </Button>
                    
                    {selectedAccessories.length > 0 && <div className="pt-4 border-t border-primary-foreground/20">
                        <p className="text-primary-foreground/90 text-center text-sm font-medium">
                          ✅ Incluindo {selectedAccessories.length} acessório(s) selecionado(s)
                        </p>
                      </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Image zoom modal */}
      {isImageZoomed && <Dialog open={isImageZoomed} onOpenChange={setIsImageZoomed}>
          <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-background/95 border-0 backdrop-blur-sm">
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <Button size="icon" variant="ghost" onClick={() => setIsImageZoomed(false)} className="absolute top-6 right-6 text-foreground hover:bg-card/80 rounded-xl z-10 w-12 h-12">
                <X className="w-6 h-6" />
              </Button>
              
              {allImages.length > 0 && <img src={allImages[currentImageIndex]} alt={product.name} className="max-w-full max-h-full object-contain rounded-xl shadow-elegant" />}
              
              {allImages.length > 1 && <>
                  <Button size="icon" variant="ghost" onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground hover:bg-card/80 rounded-xl w-12 h-12">
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground hover:bg-card/80 rounded-xl w-12 h-12">
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </>}
            </div>
          </DialogContent>
        </Dialog>}
    </>;
};
export default ProductDetailModal;