import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import LazyImage from '@/components/LazyImage';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  main_image: string | null;
  images?: string[] | null;
  features: string[] | null;
  category?: {
    name: string;
    slug: string;
  };
  onAddToCart?: (product: Product, accessories?: any[]) => void;
}

const ProductCard = ({ 
  id, 
  name, 
  description, 
  short_description,
  price, 
  main_image,
  images,
  features, 
  category,
  onAddToCart 
}: ProductCardProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const product: Product = {
    id,
    name,
    description,
    short_description,
    price,
    sale_price: null,
    main_image,
    images,
    features,
    category,
    category_id: category?.slug || '',
    slug: '',
    active: true,
    featured: false,
    specifications: null,
    stock_status: 'in_stock',
    meta_title: null,
    meta_description: null,
    created_at: '',
    updated_at: '',
  };

  const handleAddToCart = (productData: Product, accessories: any[] = []) => {
    if (onAddToCart) {
      onAddToCart(productData, accessories);
    }
    setShowDetailModal(false);
  };
  return (
    <div className="card-premium group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <LazyImage
          src={main_image || '/placeholder.svg'}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-primary text-primary-foreground text-sm font-medium rounded-full">
              {category.name}
            </span>
          </div>
        )}

        {/* Price Badge */}
        {price && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full">
              R$ {price.toLocaleString('pt-BR')}
            </span>
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            className="btn-primary"
            onClick={() => setShowDetailModal(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
          {name}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {short_description || description}
        </p>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-accent">Características:</h4>
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            className="btn-outline flex-1"
            onClick={() => setShowDetailModal(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button 
            className="btn-primary flex-1"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductCard;