import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, Users, Settings, LogOut, FileImage, Quote, Wrench } from 'lucide-react';
const sidebarItems = [{
  title: "Dashboard",
  url: "/admin",
  icon: LayoutDashboard,
  exact: true
}, {
  title: "Conteúdo do Site",
  url: "/admin/content",
  icon: FileImage
}, {
  title: "Produtos",
  url: "/admin/products",
  icon: Package
}, {
  title: "Acessórios",
  url: "/admin/accessories",
  icon: Wrench
}, {
  title: "Categorias",
  url: "/admin/categories",
  icon: Users
}, {
  title: "Orçamentos",
  url: "/admin/quotes",
  icon: Quote
}, {
  title: "Configurações",
  url: "/admin/settings",
  icon: Settings
}];
function AdminSidebar() {
  const {
    state
  } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const {
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  return <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarContent className="bg-gray-600">
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground font-semibold">
            {!collapsed && "Exclusive Admin"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.exact} className={({
                  isActive: navIsActive
                }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${navIsActive || isActive(item.url, item.exact) ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                      `}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>Sair</span>}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}
export const AdminLayout = () => {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>;
  }
  if (!user) return null;
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-semibold text-foreground">
                Painel Administrativo
              </h1>
              <Button variant="outline" onClick={() => navigate('/')} size="sm">
                Ver Site
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 bg-background">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>;
};