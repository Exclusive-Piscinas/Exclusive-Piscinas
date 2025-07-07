import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.main_image || '');
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.main_image 
    ? [product.main_image] 
    : [];

  const handleAddToCart = () => {
    // This would integrate with the cart system
    window.location.href = '/#produtos';
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.short_description || product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-custom py-8 mt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Produtos
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={selectedImage || product.main_image || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImage === image 
                        ? 'border-accent' 
                        : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Badge variant="secondary" className="text-sm">
                {product.category.name}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            {product.price && (
              <div className="text-3xl font-bold text-accent">
                R$ {product.price.toLocaleString('pt-BR')}
                {product.sale_price && (
                  <span className="text-lg text-muted-foreground line-through ml-2">
                    R$ {product.sale_price.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            )}

            {/* Short Description */}
            {product.short_description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                className="btn-primary flex-1 text-lg py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Orçamento
              </Button>
              <Button 
                variant="outline" 
                className="btn-outline"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-muted-foreground">
                {product.stock_status === 'in_stock' ? 'Disponível' : 'Consulte disponibilidade'}
              </span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Descrição Completa</h2>
            <div 
              className="prose prose-lg max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Especificações Técnicas</h2>
            <div className="bg-card rounded-lg p-6">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {typeof product.specifications === 'object' 
                  ? JSON.stringify(product.specifications, null, 2)
                  : product.specifications
                }
              </pre>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;