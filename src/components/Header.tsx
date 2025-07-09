import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openWhatsApp, getDefaultMessages } = useWhatsApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Início', href: '#inicio' },
    { name: 'Piscinas', href: '#piscinas' },
    { name: 'Spas', href: '#spas' },
    { name: 'Acessórios', href: '#acessorios' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg border-b border-border/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/src/assets/logo.svg" alt="Logo Exclusive Piscinas" className="h-20 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isCategory = ['Piscinas', 'Spas', 'Acessórios'].includes(item.name);
              const slugMap = { 'Piscinas': 'piscinas', 'Spas': 'spas', 'Acessórios': 'acessorios' };
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (isCategory) {
                      if (location.pathname !== '/') {
                        navigate('/', { replace: false });
                        setTimeout(() => {
                          window.location.hash = `#produtos-${slugMap[item.name]}`;
                          const element = document.getElementById('produtos');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      } else {
                        window.location.hash = `#produtos-${slugMap[item.name]}`;
                        const element = document.getElementById('produtos');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      if (location.pathname !== '/') {
                        navigate('/', { replace: false });
                        setTimeout(() => {
                          const element = document.querySelector(item.href);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      } else {
                        const element = document.querySelector(item.href);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-outline"
              onClick={() => openWhatsApp(getDefaultMessages.vendedor)}
            >
              Falar com Vendedor
            </Button>
            <Button 
              className="btn-primary"
              onClick={() => openWhatsApp(getDefaultMessages.preOrcamento)}
            >
              Pré-Orçamento
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-6 h-6 flex flex-col justify-center items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
            }`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
            }`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/50">
            <nav className="container-custom py-6 space-y-4">
              {navItems.map((item) => {
                const isCategory = ['Piscinas', 'Spas', 'Acessórios'].includes(item.name);
                const slugMap = { 'Piscinas': 'piscinas', 'Spas': 'spas', 'Acessórios': 'acessorios' };
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block nav-link text-lg"
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      if (isCategory) {
                        if (location.pathname !== '/') {
                          navigate('/', { replace: false });
                          setTimeout(() => {
                            window.location.hash = `#produtos-${slugMap[item.name]}`;
                            const element = document.getElementById('produtos');
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }, 50);
                        } else {
                          window.location.hash = `#produtos-${slugMap[item.name]}`;
                          const element = document.getElementById('produtos');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }
                      } else {
                        if (location.pathname !== '/') {
                          navigate('/', { replace: false });
                          setTimeout(() => {
                            const element = document.querySelector(item.href);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }, 50);
                        } else {
                          const element = document.querySelector(item.href);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="pt-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full btn-outline"
                  onClick={() => openWhatsApp(getDefaultMessages.vendedor)}
                >
                  Falar com Vendedor
                </Button>
                <Button 
                  className="w-full btn-primary"
                  onClick={() => openWhatsApp(getDefaultMessages.preOrcamento)}
                >
                  Pré-Orçamento
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;