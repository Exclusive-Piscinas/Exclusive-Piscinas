import { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from './ProductCard';
import QuoteCart from './QuoteCart';
import { Button } from '@/components/ui/button';
interface CartItem {
  product: Product;
  quantity: number;
  equipments?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  accessories?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}
const ProductCatalog = () => {
  const {
    products,
    loading: productsLoading
  } = useProducts();
  const {
    categories
  } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      if (hash.startsWith('#produtos-')) {
        const slug = hash.replace('#produtos-', '');
        const category = categories.find(cat => cat.slug === slug);
        if (category) setSelectedCategory(category.id);
      } else {
        setSelectedCategory(null);
      }
    }
    handleHashChange(); // Chama ao montar
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);
  const filteredProducts = selectedCategory ? products.filter(product => product.category_id === selectedCategory) : products;
  const addToCart = (product: Product, equipments: any[] = []) => {
    const equipmentData = equipments.map(acc => ({
      id: acc.id,
      name: acc.name,
      price: acc.price || 0,
      quantity: acc.quantity || 1
    }));

    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.product.id === product.id && 
        JSON.stringify(item.equipments || []) === JSON.stringify(equipmentData)
      );
      
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id && 
          JSON.stringify(item.equipments || []) === JSON.stringify(equipmentData)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, {
        product,
        quantity: 1,
        equipments: equipmentData.length > 0 ? equipmentData : undefined
      }];
    });
  };
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.product.id === productId ? {
      ...item,
      quantity
    } : item));
  };
  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };
  const clearCart = () => {
    setCartItems([]);
  };
  if (productsLoading) {
    return <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        </div>
      </section>;
  }
  return <section id="produtos" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Conheça nosso catálogo!</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa linha completa de piscinas, spas e banheiras de luxo.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => {
          setSelectedCategory(null);
          document.getElementById('produtos')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }}>
            Todos
          </Button>
          {categories.map(category => <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} onClick={() => {
          setSelectedCategory(category.id);
          document.getElementById('produtos')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }}>
              {category.name}
            </Button>)}
        </div>

        {filteredProducts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => <ProductCard key={product.id} id={product.id} name={product.name} description={product.description} short_description={product.short_description} price={product.price} main_image={product.main_image} images={product.images} features={product.features} category={product.category} onAddToCart={addToCart} />)}
          </div> : <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          </div>}
      </div>

      <QuoteCart cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onClearCart={clearCart} />
    </section>;
};
export default ProductCatalog;