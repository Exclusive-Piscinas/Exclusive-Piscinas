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
import { Product } from '@/hooks/useProducts';
interface CartItem {
  product: Product;
  quantity: number;
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
  const {
    createQuote
  } = useQuotes();
  const {
    toast
  } = useToast();
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
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
        quantity: item.quantity
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
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;
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
      message += `  Subtotal: R$ ${((item.product.price || 0) * item.quantity).toLocaleString('pt-BR')}\n`;
    });
    message += `\n💰 *VALOR TOTAL: R$ ${totalAmount.toLocaleString('pt-BR')}*\n`;
    if (customer.notes) {
      message += `\n📝 *Observações:* ${customer.notes}\n`;
    }
    message += `\n✨ Estou interessado(a) neste orçamento e gostaria de mais informações!`;
    return message;
  };
  return <Sheet>
      <SheetTrigger asChild>
        <Button className="btn-primary fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-elegant py-[60px] px-[18px]">
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {cartItems.length}
            </span>}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Solicitar Orçamento
          </SheetTitle>
          <SheetDescription>
            Finalize sua seleção e solicite um orçamento personalizado
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Produtos Selecionados</h3>
            
            {cartItems.length === 0 ? <p className="text-center text-muted-foreground py-8">
                Nenhum produto selecionado ainda.
              </p> : <div className="space-y-3">
                {cartItems.map(item => <Card key={item.product.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <img src={item.product.main_image || ''} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-accent font-bold">
                          R$ {(item.product.price || 0).toLocaleString('pt-BR')}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 py-1 bg-muted rounded text-sm">
                            {item.quantity}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onRemoveItem(item.product.id)} className="ml-auto">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>)}
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-accent">
                      R$ {totalAmount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>}
          </div>

          {/* Customer Form */}
          {cartItems.length > 0 && <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Seus Dados</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input id="name" value={customerData.name} onChange={e => setCustomerData(prev => ({
                ...prev,
                name: e.target.value
              }))} placeholder="Seu nome completo" required />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={customerData.email} onChange={e => setCustomerData(prev => ({
                ...prev,
                email: e.target.value
              }))} placeholder="seu@email.com" required />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" value={customerData.phone} onChange={e => setCustomerData(prev => ({
                ...prev,
                phone: e.target.value
              }))} placeholder="(11) 99999-9999" required />
                </div>
                
                <div>
                  <Label htmlFor="address">Endereço (opcional)</Label>
                  <Input id="address" value={customerData.address} onChange={e => setCustomerData(prev => ({
                ...prev,
                address: e.target.value
              }))} placeholder="Seu endereço completo" />
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea id="notes" value={customerData.notes} onChange={e => setCustomerData(prev => ({
                ...prev,
                notes: e.target.value
              }))} placeholder="Informações adicionais, preferências, etc." rows={3} />
                </div>
              </div>
              
              <Button onClick={handleSubmitQuote} disabled={isSubmitting} className="w-full btn-primary">
                {isSubmitting ? 'Enviando...' : <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Solicitar Orçamento via WhatsApp
                  </>}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Ao solicitar o orçamento, você será redirecionado para o WhatsApp 
                para finalizar o contato com nossa equipe.
              </p>
            </div>}
        </div>
      </SheetContent>
    </Sheet>;
};
export default QuoteCart;