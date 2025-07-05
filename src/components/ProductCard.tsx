import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  main_image: string | null;
  images: string[] | null;
  features: string[] | null;
  category?: {
    name: string;
    slug: string;
  };
  onAddToCart?: () => void;
}

const ProductCard = ({ 
  id, 
  name, 
  description, 
  short_description,
  price, 
  main_image, 
  features, 
  category,
  onAddToCart 
}: ProductCardProps) => {
  return (
    <div className="card-premium group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
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
          <Button className="btn-primary">
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
            onClick={onAddToCart}
          >
            Adicionar ao Orçamento
          </Button>
          <Button className="btn-primary flex-1">
            Saiba Mais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;