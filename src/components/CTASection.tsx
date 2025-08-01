import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
const CTASection = () => {
  const { openWhatsApp, getDefaultMessages } = useWhatsApp();
  return <section className="section-padding bg-gradient-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-20 w-32 h-32 bg-accent-glow/20 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-glow/30 rounded-full blur-lg animate-pulse" style={{
        animationDelay: '2s'
      }} />
      </div>

      <div className="container-custom relative z-10 px-0">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Pronto para transformar 
              <span className="block text-accent-glow">seu espaço?</span>
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Solicite um orçamento gratuito e descubra como podemos criar o projeto perfeito para você. 
              Nossa equipe está pronta para tirar suas dúvidas e apresentar as melhores soluções.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-lg px-12 py-6 bg-accent hover:bg-accent-glow text-accent-foreground font-semibold rounded-xl shadow-glow hover:shadow-xl hover:scale-105 transition-all">
                    Solicitar Orçamento Grátis
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Solicitar Orçamento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Escolha como prefere entrar em contato conosco:</p>
                    <div className="grid gap-3">
                      <Button onClick={() => openWhatsApp(getDefaultMessages.orcamento)} className="justify-start gap-3">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp (Mais Rápido)
                      </Button>
                      <Button variant="outline" onClick={() => openWhatsApp(getDefaultMessages.vendedor)} className="justify-start gap-3">
                        <Phone className="h-4 w-4" />
                        Ligar Agora
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="text-lg px-12 py-6 border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold rounded-xl transition-all">
                    Falar com Especialista
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Falar com Especialista</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Nossa equipe técnica está pronta para te atender:</p>
                    <div className="grid gap-3">
                      <Button onClick={() => openWhatsApp(getDefaultMessages.vendedor)} className="justify-start gap-3">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Técnico
                      </Button>
                      <Button variant="outline" onClick={() => window.location.href = 'mailto:exclusive@piscinas.com?subject=Consulta Técnica'} className="justify-start gap-3">
                        <Mail className="h-4 w-4" />
                        E-mail Técnico
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl border border-primary-foreground/20">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground mb-2">WhatsApp</h3>
              <p className="text-primary-foreground/80 mb-4">Resposta rápida e atendimento personalizado</p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => openWhatsApp(getDefaultMessages.contato)}>
                Chamar no WhatsApp
              </Button>
            </div>

            <div className="text-center p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl border border-primary-foreground/20">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground mb-2">E-mail</h3>
              <p className="text-primary-foreground/80 mb-4">Envie sua dúvida ou solicite informações</p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.location.href = 'mailto:exclusive@piscinas.com?subject=Informações sobre produtos'}>
                Enviar E-mail
              </Button>
            </div>

            <div className="text-center p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl border border-primary-foreground/20">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground mb-2">Telefone</h3>
              <p className="text-primary-foreground/80 mb-4">Ligue e fale diretamente com nossa equipe</p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => openWhatsApp(getDefaultMessages.contato)}>
                Ligar Agora
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <span className="text-accent text-xl">✓</span>
                <span>Orçamento sem compromisso</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent text-xl">✓</span>
                <span>Atendimento personalizado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent text-xl">✓</span>
                <span>Resposta em até 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CTASection;