import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useQuotes, CreateQuoteData } from '@/hooks/useQuotes';
import { useToast } from '@/hooks/use-toast';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { Product } from '@/hooks/useProducts';
import LazyImage from '@/components/LazyImage';
interface CartItem {
  product: Product;
  quantity: number;
  accessories?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}
interface QuoteCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}
const QuoteCart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: QuoteCartProps) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createQuote } = useQuotes();
  const { toast } = useToast();
  const { generateWhatsAppLink, whatsappNumber } = useWhatsApp();
  const totalAmount = cartItems.reduce((sum, item) => {
    const productTotal = (item.product.price || 0) * item.quantity;
    const accessoriesTotal = (item.accessories || []).reduce(
      (accSum, acc) => accSum + (acc.price * acc.quantity),
      0
    );
    return sum + productTotal + accessoriesTotal;
  }, 0);
  const handleSubmitQuote = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de solicitar orçamento.",
        variant: "destructive"
      });
      return;
    }
    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast({
        title: "Dados obrigatórios",
        description: "Preencha nome, email e telefone para continuar.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    const quoteData: CreateQuoteData = {
      customer_name: customerData.name,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      customer_address: customerData.address,
      notes: customerData.notes,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price || 0,
        quantity: item.quantity,
        accessories: item.accessories?.map(acc => ({
          accessory_id: acc.id,
          accessory_name: acc.name,
          accessory_price: acc.price,
          quantity: acc.quantity
        }))
      }))
    };
    const {
      data,
      error
    } = await createQuote(quoteData);
    if (!error && data) {
      // Clear form and cart
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      onClearCart();

      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(data, cartItems, customerData);
      const whatsappUrl = generateWhatsAppLink(whatsappMessage);
      
      toast({
        title: "Orçamento enviado com sucesso!",
        description: "Você será redirecionado para o WhatsApp para finalizar o contato."
      });

      // Open WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    }
    setIsSubmitting(false);
  };
  const generateWhatsAppMessage = (quote: any, items: CartItem[], customer: any) => {
    let message = `🌊 *SOLICITAÇÃO DE ORÇAMENTO - EXCLUSIVE*\n\n`;
    message += `📋 *Orçamento:* ${quote.quote_number}\n`;
    message += `👤 *Cliente:* ${customer.name}\n`;
    message += `📧 *Email:* ${customer.email}\n`;
    message += `📱 *Telefone:* ${customer.phone}\n`;
    if (customer.address) {
      message += `📍 *Endereço:* ${customer.address}\n`;
    }
    message += `\n🛍️ *PRODUTOS SELECIONADOS:*\n`;
    items.forEach(item => {
      message += `\n• *${item.product.name}*\n`;
      message += `  Quantidade: ${item.quantity}\n`;
      message += `  Valor unitário: R$ ${(item.product.price || 0).toLocaleString('pt-BR')}\n`;
      message += `  Subtotal produto: R$ ${((item.product.price || 0) * item.quantity).toLocaleString('pt-BR')}\n`;
      
      if (item.accessories && item.accessories.length > 0) {
        message += `  📦 *Acessórios inclusos:*\n`;
        item.accessories.forEach(acc => {
          message += `    - ${acc.name} (${acc.quantity}x) - R$ ${(acc.price * acc.quantity).toLocaleString('pt-BR')}\n`;
        });
      }
      
      const itemTotal = (item.product.price || 0) * item.quantity + 
        (item.accessories || []).reduce((sum, acc) => sum + (acc.price * acc.quantity), 0);
      message += `  *Total do item: R$ ${itemTotal.toLocaleString('pt-BR')}*\n`;
    });
    message += `\n💰 *VALOR TOTAL: R$ ${totalAmount.toLocaleString('pt-BR')}*\n`;
    if (customer.notes) {
      message += `\n📝 *Observações:* ${customer.notes}\n`;
    }
    
    // Add PDF link if available
    if (quote.pdf_url) {
      message += `\n📄 *PDF do Orçamento:* ${quote.pdf_url}\n`;
    }
    
    message += `\n✨ Estou interessado(a) neste orçamento e gostaria de mais informações!`;
    return message;
  };
  return <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-50 rounded-full p-6 shadow-elegant my-[80px] bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-110">
          <ShoppingCart className="h-7 w-7 text-primary-foreground" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-glow animate-pulse-glow">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-gradient-card border-l border-border/30">
        <SheetHeader className="space-y-4 pb-6 border-b border-border/30">
          <SheetTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Solicitar Orçamento
            </span>
          </SheetTitle>
          <SheetDescription className="text-lg text-muted-foreground">
            Finalize sua seleção e solicite um orçamento personalizado com nossa equipe especializada
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Cart Items */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-accent rounded-full"></div>
              <h3 className="text-xl font-bold text-foreground">Produtos Selecionados</h3>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12 bg-gradient-dark rounded-xl border border-border/30">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Nenhum produto selecionado ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Adicione produtos para começar seu orçamento
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <Card key={item.product.id} className="border border-border/30 bg-gradient-card transition-all duration-300 hover:shadow-elegant">
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-border/30 flex-shrink-0">
                          <LazyImage 
                            src={item.product.main_image || ''} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <h4 className="font-semibold text-foreground text-lg leading-tight">
                              {item.product.name}
                            </h4>
                            <p className="text-lg font-bold bg-gradient-accent bg-clip-text text-transparent">
                              R$ {(item.product.price || 0).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 bg-card rounded-lg text-sm font-semibold min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => onRemoveItem(item.product.id)}
                              className="hover:shadow-glow transition-all duration-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Acessórios */}
                          {item.accessories && item.accessories.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground">Acessórios inclusos:</h5>
                              <div className="space-y-1">
                                {item.accessories.map((acc, index) => (
                                  <div key={index} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      {acc.name} ({acc.quantity}x)
                                    </span>
                                    <span className="text-accent">
                                      R$ {(acc.price * acc.quantity).toLocaleString('pt-BR')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-2 border-t border-border/20">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Produto:</span>
                                <span className="text-foreground">
                                  R$ {((item.product.price || 0) * item.quantity).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              {item.accessories && item.accessories.length > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Acessórios:</span>
                                  <span className="text-accent">
                                    R$ {item.accessories.reduce((sum, acc) => sum + (acc.price * acc.quantity), 0).toLocaleString('pt-BR')}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-1 border-t border-border/10">
                                <span className="font-medium text-foreground">Subtotal:</span>
                                <span className="font-bold text-foreground">
                                  R$ {(
                                    (item.product.price || 0) * item.quantity + 
                                    (item.accessories || []).reduce((sum, acc) => sum + (acc.price * acc.quantity), 0)
                                  ).toLocaleString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <div className="bg-gradient-dark p-6 rounded-xl border border-border/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium text-foreground">Total Geral:</span>
                    <span className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                      R$ {totalAmount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Form */}
          {cartItems.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-accent rounded-full"></div>
                <h3 className="text-xl font-bold text-foreground">Seus Dados</h3>
              </div>
              
              <div className="bg-gradient-dark p-6 rounded-xl border border-border/30 space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      value={customerData.name} 
                      onChange={e => setCustomerData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))} 
                      placeholder="Seu nome completo" 
                      required 
                      className="bg-card/50 border-border/30 focus:border-accent focus:ring-accent/20 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={customerData.email} 
                      onChange={e => setCustomerData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))} 
                      placeholder="seu@email.com" 
                      required 
                      className="bg-card/50 border-border/30 focus:border-accent focus:ring-accent/20 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">Telefone *</Label>
                    <Input 
                      id="phone" 
                      value={customerData.phone} 
                      onChange={e => setCustomerData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))} 
                      placeholder="(11) 99999-9999" 
                      required 
                      className="bg-card/50 border-border/30 focus:border-accent focus:ring-accent/20 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground font-medium">Endereço (opcional)</Label>
                    <Input 
                      id="address" 
                      value={customerData.address} 
                      onChange={e => setCustomerData(prev => ({
                        ...prev,
                        address: e.target.value
                      }))} 
                      placeholder="Seu endereço completo" 
                      className="bg-card/50 border-border/30 focus:border-accent focus:ring-accent/20 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground font-medium">Observações (opcional)</Label>
                    <Textarea 
                      id="notes" 
                      value={customerData.notes} 
                      onChange={e => setCustomerData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))} 
                      placeholder="Informações adicionais, preferências, especificações técnicas, etc." 
                      rows={4}
                      className="bg-card/50 border-border/30 focus:border-accent focus:ring-accent/20 resize-none"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/20">
                  <Button 
                    onClick={handleSubmitQuote} 
                    disabled={isSubmitting} 
                    className="w-full btn-primary text-lg py-6 rounded-xl shadow-elegant"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 mr-3" />
                        Solicitar Orçamento via WhatsApp
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center mt-4 leading-relaxed">
                    🚀 Ao solicitar o orçamento, você será redirecionado para o WhatsApp para finalizar o contato com nossa equipe especializada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>;
};
export default QuoteCart;