import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import poolProduct from '@/assets/pool-product.jpg';
import spaLuxury from '@/assets/spa-luxury.jpg';
import bathtubLuxury from '@/assets/bathtub-luxury.jpg';

const ProductCatalog = () => {
  const products = [
    {
      id: 1,
      image: poolProduct,
      title: "Piscina Infinity Premium",
      description: "Piscina infinity com borda infinita, ideal para residências de alto padrão. Sistema de filtragem avançado e iluminação LED.",
      price: "A partir de R$ 85.000",
      category: "Piscinas",
      features: [
        "Borda infinita premium",
        "Sistema de filtragem automático",
        "Iluminação LED colorida",
        "Controle via aplicativo",
        "Garantia de 5 anos"
      ]
    },
    {
      id: 2,
      image: spaLuxury,
      title: "Spa Circular Deluxe",
      description: "Spa circular com sistema de hidromassagem e controle de temperatura. Perfeito para relaxamento e bem-estar.",
      price: "A partir de R$ 35.000",
      category: "Spas",
      features: [
        "Sistema de hidromassagem",
        "Controle digital de temperatura",
        "6 posições de massagem",
        "Iluminação ambiente",
        "Capacidade para 6 pessoas"
      ]
    },
    {
      id: 3,
      image: bathtubLuxury,
      title: "Banheira Luxury Spa",
      description: "Banheira de design moderno com sistema de hidromassagem integrado. Materiais de primeira qualidade.",
      price: "A partir de R$ 18.000",
      category: "Banheiras",
      features: [
        "Design ergonômico",
        "Sistema de hidro",
        "Materiais premium",
        "Instalação completa",
        "Garantia de 3 anos"
      ]
    },
    {
      id: 4,
      image: poolProduct,
      title: "Piscina Familiar Standard",
      description: "Piscina retangular clássica, ideal para famílias. Excelente custo-benefício com qualidade garantida.",
      price: "A partir de R$ 45.000",
      category: "Piscinas",
      features: [
        "Formato retangular clássico",
        "Sistema de filtragem completo",
        "Escada em inox",
        "Iluminação básica",
        "Garantia de 3 anos"
      ]
    },
    {
      id: 5,
      image: spaLuxury,
      title: "Spa Compacto Residence",
      description: "Spa compacto ideal para espaços menores. Mantém toda a qualidade em tamanho reduzido.",
      price: "A partir de R$ 22.000",
      category: "Spas",
      features: [
        "Design compacto",
        "4 jatos de hidromassagem",
        "Aquecimento rápido",
        "Controle simples",
        "Capacidade para 4 pessoas"
      ]
    },
    {
      id: 6,
      image: bathtubLuxury,
      title: "Banheira Classic Comfort",
      description: "Banheira clássica com design atemporal. Conforto e elegância para seu banheiro.",
      price: "A partir de R$ 12.000",
      category: "Banheiras",
      features: [
        "Design clássico",
        "Materiais duráveis",
        "Fácil manutenção",
        "Vários tamanhos",
        "Instalação incluída"
      ]
    }
  ];

  const categories = ['Todos', 'Piscinas', 'Spas', 'Banheiras'];
  
  return (
    <section id="produtos" className="section-padding bg-gradient-dark">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nossos <span className="text-accent">Produtos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra nossa linha completa de piscinas, spas e banheiras premium. 
            Cada produto é cuidadosamente selecionado para oferecer máxima qualidade e durabilidade.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4 p-2 bg-muted/30 rounded-2xl backdrop-blur-sm">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
              category={product.category}
              features={product.features}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card p-8 rounded-3xl shadow-elegant max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Trabalhamos com projetos personalizados. Entre em contato e vamos criar 
              a solução perfeita para seu espaço.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">
                Projeto Personalizado
              </Button>
              <Button variant="outline" className="btn-outline">
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;