import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useLocation } from 'react-router-dom';
const WhatsAppFloat = () => {
  const {
    openWhatsApp,
    getDefaultMessages
  } = useWhatsApp();
  const location = useLocation();
  const getContextualMessage = () => {
    const path = location.pathname;
    if (path.includes('/produto/')) {
      return getDefaultMessages.produto('este produto');
    }
    if (path === '/') {
      return getDefaultMessages.preOrcamento;
    }
    return getDefaultMessages.contato;
  };
  const handleClick = () => {
    openWhatsApp(getContextualMessage());
  };
  return <Button onClick={handleClick} size="icon" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-primary shadow-glow hover:scale-110 transition-all duration-300 text-black/[0.47]">
      <MessageCircle className="h-6 w-6 text-primary-foreground" />
    </Button>;
};
export default WhatsAppFloat;