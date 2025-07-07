import { useCallback } from 'react';
import { useSiteContent } from './useSiteContent';

export const useWhatsApp = () => {
  const { content } = useSiteContent();
  
  // Get WhatsApp number from site content, fallback to hardcoded
  const whatsappNumber = content.find(item => item.key === 'whatsapp_number')?.content || '5511999999999';
  
  const generateWhatsAppLink = useCallback((message: string) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  }, [whatsappNumber]);

  const openWhatsApp = useCallback((message: string) => {
    const link = generateWhatsAppLink(message);
    window.open(link, '_blank');
  }, [generateWhatsAppLink]);

  const getDefaultMessages = useCallback(() => ({
    preOrcamento: 'Olá! Gostaria de solicitar um pré-orçamento para piscinas. Podem me ajudar?',
    vendedor: 'Olá! Gostaria de falar com um vendedor sobre seus produtos.',
    produto: (productName: string) => `Olá! Tenho interesse no produto: ${productName}. Podem me dar mais informações?`,
    orcamento: 'Olá! Gostaria de solicitar um orçamento detalhado.',
    contato: 'Olá! Gostaria de entrar em contato com vocês.',
  }), []);

  return {
    whatsappNumber,
    generateWhatsAppLink,
    openWhatsApp,
    getDefaultMessages: getDefaultMessages(),
  };
};