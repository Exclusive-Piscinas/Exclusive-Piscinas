import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useQuotes } from '@/hooks/useQuotes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Package, FileText, Settings, LogOut, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { products } = useProducts();
  const { quotes } = useQuotes({ autoFetch: true });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    {
      title: 'Total de Produtos',
      value: products.length,
      icon: Package,
      description: 'Produtos no catálogo',
    },
    {
      title: 'Orçamentos Recebidos',
      value: quotes.length,
      icon: FileText,
      description: 'Total de solicitações',
    },
    {
      title: 'Orçamentos Pendentes',
      value: quotes.filter(q => q.status === 'pending').length,
      icon: TrendingUp,
      description: 'Aguardando resposta',
    },
    {
      title: 'Valor Total em Orçamentos',
      value: `R$ ${quotes.reduce((sum, q) => sum + q.total_amount, 0).toLocaleString('pt-BR')}`,
      icon: BarChart3,
      description: 'Valor acumulado',
    },
  ];

  const recentQuotes = quotes.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
              <p className="text-muted-foreground">Exclusive - Painel de Controle</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="btn-outline"
              >
                Ver Site
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="card-premium cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/admin/products')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gerenciar Produtos</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Adicionar, editar e organizar produtos
              </p>
            </CardContent>
          </Card>

          <Card 
            className="card-premium cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/admin/quotes')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Visualizar e gerenciar orçamentos
              </p>
            </CardContent>
          </Card>

          <Card 
            className="card-premium cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/admin/categories')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Organizar categorias de produtos
              </p>
            </CardContent>
          </Card>

          <Card 
            className="card-premium cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/admin/settings')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configurações</CardTitle>
              <Settings className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Configurações do site e sistema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-premium">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Quotes */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Orçamentos Recentes</CardTitle>
            <CardDescription>
              Últimas solicitações de orçamento recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentQuotes.length > 0 ? (
              <div className="space-y-4">
                {recentQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{quote.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{quote.customer_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        R$ {quote.total_amount.toLocaleString('pt-BR')}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        quote.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : quote.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status === 'pending' ? 'Pendente' : 
                         quote.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum orçamento recebido ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;