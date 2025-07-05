const FeaturesSection = () => {
  const features = [
    {
      icon: "🏊‍♂️",
      title: "Projetos Personalizados",
      description: "Cada projeto é único e desenvolvido especialmente para seu espaço e necessidades.",
      highlights: ["Design exclusivo", "Medidas sob encomenda", "Consultoria especializada"]
    },
    {
      icon: "⚡",
      title: "Instalação Completa",
      description: "Equipe técnica especializada cuida de todo o processo, do projeto à entrega final.",
      highlights: ["Equipe certificada", "Prazos garantidos", "Pós-venda completo"]
    },
    {
      icon: "💎",
      title: "Materiais Premium",
      description: "Utilizamos apenas materiais de primeira qualidade com garantia estendida.",
      highlights: ["Marcas renomadas", "Garantia de 5 anos", "Tecnologia avançada"]
    },
    {
      icon: "🛠️",
      title: "Manutenção & Suporte",
      description: "Serviço completo de manutenção preventiva e corretiva para máxima durabilidade.",
      highlights: ["Manutenção preventiva", "Suporte 24/7", "Peças originais"]
    }
  ];

  const stats = [
    { number: "500+", label: "Projetos Realizados" },
    { number: "15+", label: "Anos de Experiência" },
    { number: "98%", label: "Clientes Satisfeitos" },
    { number: "5★", label: "Avaliação Média" }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Por que escolher a <span className="text-accent">Exclusive</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Somos especialistas em transformar espaços em verdadeiros paraísos aquáticos. 
            Conheça os diferenciais que nos tornam referência no mercado.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-premium p-8 text-center group hover:shadow-glow"
            >
              <div className="text-6xl mb-6 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm text-accent flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-card rounded-3xl p-8 md:p-12 shadow-elegant">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Números que comprovam nossa <span className="text-accent">excelência</span>
            </h3>
            <p className="text-muted-foreground text-lg">
              Mais de uma década construindo sonhos e superando expectativas
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Nosso <span className="text-accent">Processo</span>
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Um processo estruturado e transparente para garantir o sucesso do seu projeto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Consulta & Projeto",
                description: "Análise do espaço, definição de necessidades e criação do projeto personalizado."
              },
              {
                step: "02", 
                title: "Aprovação & Execução",
                description: "Aprovação final do projeto e início da execução com cronograma detalhado."
              },
              {
                step: "03",
                title: "Entrega & Suporte",
                description: "Entrega do projeto finalizado e início do suporte pós-venda completo."
              }
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-foreground mb-6 shadow-glow">
                    {process.step}
                  </div>
                  <h4 className="text-xl font-bold mb-4">{process.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                </div>
                
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;