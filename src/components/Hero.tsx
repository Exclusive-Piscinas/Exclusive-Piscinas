import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import heroPool from '@/assets/hero-pool.jpg';
import spaLuxury from '@/assets/spa-luxury.jpg';
import bathtubLuxury from '@/assets/bathtub-luxury.jpg';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: heroPool,
      title: "Piscinas de Luxo",
      subtitle: "Transforme seu espaço em um paraíso aquático",
      description: "Projetos exclusivos com materiais premium e instalação profissional",
    },
    {
      image: spaLuxury,
      title: "Spas & Banheiras",
      subtitle: "Relaxamento e bem-estar em casa",
      description: "Equipamentos de alta qualidade para momentos únicos de relaxamento",
    },
    {
      image: bathtubLuxury,
      title: "Instalação Completa",
      subtitle: "Do projeto à entrega final",
      description: "Equipe especializada para realizar seu sonho com excelência",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images with Transition */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          {/* Animated Logo */}
          <div className="mb-8 animate-float">
            <img src="/logo.svg" alt="Logo Exclusive Piscinas" className="h-40 w-auto mx-auto" />
          </div>

          {/* Dynamic Content */}
          <div className="space-y-6">
            <h2 className="hero-text">
              {slides[currentSlide].title}
            </h2>
            
            <h3 className="text-2xl md:text-4xl text-accent font-light">
              {slides[currentSlide].subtitle}
            </h3>
            
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {slides[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button 
                className="btn-primary text-lg px-12 py-6"
                onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Catálogo Completo
              </Button>
              <Button 
                variant="outline" 
                className="btn-outline text-lg px-12 py-6"
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Solicitar Orçamento Gratuito
              </Button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex space-x-3 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-accent shadow-glow'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-accent to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default Hero;