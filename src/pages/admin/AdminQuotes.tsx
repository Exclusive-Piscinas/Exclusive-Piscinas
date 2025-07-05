import { useState } from 'react';
import { useQuotes, Quote } from '@/hooks/useQuotes';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Eye, 
  MessageCircle, 
  Download, 
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

const AdminQuotes = () => {
  const { quotes, loading, updateQuoteStatus } = useQuotes();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'default' as const },
      approved: { label: 'Aprovado', variant: 'default' as const },
      rejected: { label: 'Rejeitado', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: Column<Quote>[] = [
    {
      key: 'quote_number',
      label: 'Número',
      render: (value) => (
        <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
          {value}
        </code>
      ),
      sortable: true,
    },
    {
      key: 'customer_name',
      label: 'Cliente',
      sortable: true,
    },
    {
      key: 'customer_email',
      label: 'E-mail',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-accent hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: 'total_amount',
      label: 'Valor Total',
      render: (value) => (
        <span className="font-semibold text-foreground">
          R$ {value?.toLocaleString('pt-BR') || '0,00'}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (value) => new Date(value).toLocaleDateString('pt-BR'),
      sortable: true,
    },
  ];

  const filteredQuotes = quotes.filter(quote => 
    statusFilter === 'all' || quote.status === statusFilter
  );

  const handleView = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusUpdate = async (quoteId: string, newStatus: string) => {
    await updateQuoteStatus(quoteId, newStatus);
  };

  const handleDeleteConfirm = async () => {
    if (selectedQuote) {
      // await deleteQuote(selectedQuote.id); // TODO: implement delete function
      setIsDeleteDialogOpen(false);
      setSelectedQuote(null);
    }
  };

  const openWhatsApp = (phone: string, name: string, quoteNumber: string) => {
    const message = `Olá ${name}! Seu orçamento ${quoteNumber} foi analisado. Como posso ajudá-lo?`;
    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const statsCards = [
    {
      title: 'Total de Orçamentos',
      value: quotes.length,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Pendentes',
      value: quotes.filter(q => q.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Aprovados',
      value: quotes.filter(q => q.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Valor Total',
      value: `R$ ${quotes.reduce((sum, q) => sum + (q.total_amount || 0), 0).toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Orçamentos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os orçamentos recebidos pelos clientes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        data={filteredQuotes}
        columns={columns}
        loading={loading}
        onEdit={handleView}
        onDelete={handleDelete}
        title="Orçamentos"
        searchPlaceholder="Pesquisar por cliente, email ou número..."
        searchKeys={['customer_name', 'customer_email', 'quote_number']}
      />

      {/* View Quote Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Orçamento</DialogTitle>
            <DialogDescription>
              Informações completas do orçamento #{selectedQuote?.quote_number}
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nome</Label>
                      <p className="text-foreground">{selectedQuote.customer_name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Telefone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${selectedQuote.customer_phone}`}
                          className="text-accent hover:underline"
                        >
                          {selectedQuote.customer_phone}
                        </a>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openWhatsApp(
                            selectedQuote.customer_phone, 
                            selectedQuote.customer_name,
                            selectedQuote.quote_number
                          )}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">E-mail</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${selectedQuote.customer_email}`}
                          className="text-accent hover:underline"
                        >
                          {selectedQuote.customer_email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Data do Pedido</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(selectedQuote.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedQuote.customer_address && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Endereço</Label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <p className="text-foreground">{selectedQuote.customer_address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quote Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedQuote.quote_items && selectedQuote.quote_items.length > 0 ? (
                    <div className="space-y-4">
                      {selectedQuote.quote_items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.product_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantidade: {item.quantity} x R$ {item.product_price.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              R$ {item.subtotal.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>R$ {selectedQuote.total_amount?.toLocaleString('pt-BR') || '0,00'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum item encontrado neste orçamento.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Notes */}
              {selectedQuote.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">{selectedQuote.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label>Status Atual:</Label>
                    {getStatusBadge(selectedQuote.status || 'pending')}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Alterar Status</Label>
                    <Select 
                      value={selectedQuote.status || 'pending'} 
                      onValueChange={(value) => handleStatusUpdate(selectedQuote.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            {selectedQuote && (
              <Button
                onClick={() => openWhatsApp(
                  selectedQuote.customer_phone, 
                  selectedQuote.customer_name,
                  selectedQuote.quote_number
                )}
                className="btn-primary"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contatar Cliente
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento #{selectedQuote?.quote_number}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="btn-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminQuotes;