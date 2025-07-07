const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Produtos",
      links: [
        { name: "Piscinas Premium", href: "#piscinas" },
        { name: "Spas & Hidros", href: "#spas" },
        { name: "Banheiras Luxury", href: "#banheiras" },
        { name: "Acessórios", href: "#acessorios" },
      ]
    },
    {
      title: "Serviços",
      links: [
        { name: "Instalação Completa", href: "#instalacao" },
        { name: "Projetos Personalizados", href: "#projetos" },
        { name: "Manutenção", href: "#manutencao" },
        { name: "Consultoria", href: "#consultoria" },
      ]
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "#sobre" },
        { name: "Portfolio", href: "#portfolio" },
        { name: "Depoimentos", href: "#depoimentos" },
        { name: "Blog", href: "#blog" },
      ]
    },
    {
      title: "Contato",
      id: "contato",
      links: [
        { name: "WhatsApp", href: "https://wa.me/5511999999999" },
        { name: "E-mail", href: "mailto:contato@exclusive.com.br" },
        { name: "Telefone", href: "tel:+5511999999999" },
        { name: "Localização", href: "#localizacao" },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-dark border-t border-border/50">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-2xl font-bold text-primary-foreground">E</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                    Exclusive
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">Premium Pools & Spas</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Transformamos sonhos em realidade com piscinas, spas e banheiras de alta qualidade. 
              Excelência em cada projeto.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <span className="text-sm font-bold">@</span>
              </div>
              <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} id={section.id || undefined}>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-xl font-semibold mb-4">
              Receba nossas novidades
            </h4>
            <p className="text-muted-foreground mb-6">
              Fique por dentro de lançamentos, promoções e dicas exclusivas.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 bg-muted/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-primary text-primary-foreground font-medium rounded-xl hover:shadow-glow transition-all">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border/30">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>
              © {currentYear} Exclusive Premium Pools & Spas. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacidade" className="hover:text-accent transition-colors">
                Política de Privacidade
              </a>
              <a href="#termos" className="hover:text-accent transition-colors">
                Termos de Uso
              </a>
              <a href="#cookies" className="hover:text-accent transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;