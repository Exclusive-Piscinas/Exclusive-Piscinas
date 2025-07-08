import { useState, useEffect } from 'react';
import { Star, Users, Trophy, MapPin } from "lucide-react";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Maria Silva",
      location: "São Paulo, SP",
      project: "Piscina Infinity Premium",
      rating: 5,
      text: "A Exclusive superou todas nossas expectativas! A piscina ficou simplesmente perfeita, exatamente como sonhávamos. A equipe foi profissional do início ao fim.",
      avatar: "MS"
    },
    {
      name: "Carlos Roberto",
      location: "Rio de Janeiro, RJ", 
      project: "Spa Circular Deluxe",
      rating: 5,
      text: "Investimento que valeu cada centavo! O spa transformou nossa área externa em um verdadeiro refúgio. Qualidade impecável e atendimento excepcional.",
      avatar: "CR"
    },
    {
      name: "Ana Paula",
      location: "Belo Horizonte, MG",
      project: "Projeto Personalizado",
      rating: 5,
      text: "Desde o primeiro contato até a entrega final, tudo foi perfeito. O projeto personalizado atendeu exatamente nossas necessidades específicas.",
      avatar: "AP"
    },
    {
      name: "Roberto Lima",
      location: "Brasília, DF",
      project: "Banheira Luxury Spa",
      rating: 5,
      text: "A qualidade dos materiais e o acabamento são excepcionais. Nossa banheira se tornou o destaque do banheiro. Recomendo sem hesitar!",
      avatar: "RL"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            O que nossos <span className="text-accent">clientes</span> dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mais de 500 projetos realizados e clientes satisfeitos em todo o Brasil. 
            Conheça algumas das experiências que já transformamos em realidade.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="card-premium p-8 md:p-12 text-center mx-4">
                    {/* Stars */}
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-2xl text-accent">★</span>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 italic">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-bold text-foreground">
                          {testimonial.name}
                        </h4>
                        <p className="text-muted-foreground">
                          {testimonial.location}
                        </p>
                        <p className="text-accent text-sm font-medium">
                          {testimonial.project}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-accent shadow-glow scale-125'
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { icon: <Star className="w-8 h-8 text-accent" />, text: "4.9/5 Avaliação Média" },
            { icon: <Users className="w-8 h-8 text-accent" />, text: "500+ Clientes Atendidos" },
            { icon: <Trophy className="w-8 h-8 text-accent" />, text: "98% Recomendação" },
            { icon: <MapPin className="w-8 h-8 text-accent" />, text: "Todo o Brasil" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-sm text-muted-foreground font-medium">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;