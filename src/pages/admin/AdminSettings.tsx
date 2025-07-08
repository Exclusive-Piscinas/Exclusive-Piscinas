import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Share2,
  Database,
  Shield,
  Palette,
  Bell
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const { content, updateContent } = useSiteContent();
  const [loading, setLoading] = useState(false);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    site_name: 'Exclusive Piscinas',
    site_description: 'Especialistas em piscinas de fibra e produtos aquáticos premium',
    site_url: 'https://exclusive-piscinas.com',
    logo_url: '',
    favicon_url: '',
    maintenance_mode: false,
  });

  // Contact Settings
  const [contactSettings, setContactSettings] = useState({
    email: 'contato@exclusive-piscinas.com',
    phone: '(11) 99999-9999',
    whatsapp: '11999999999',
    address: 'Rua das Piscinas, 123 - São Paulo - SP',
    business_hours: '08:00 - 18:00',
    google_maps_embed: '',
  });

  // Social Media Settings
  const [socialSettings, setSocialSettings] = useState({
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    twitter: '',
  });

  // SEO Settings
  const [seoSettings, setSeoSettings] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    google_analytics: '',
    google_tag_manager: '',
    facebook_pixel: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    quote_notifications: true,
    contact_notifications: true,
    newsletter_notifications: false,
  });

  // Load WhatsApp number from database on mount
  useEffect(() => {
    const whatsappContent = content.find(item => item.key === 'whatsapp_number');
    if (whatsappContent?.content) {
      setContactSettings(prev => ({ ...prev, whatsapp: whatsappContent.content }));
    }
  }, [content]);

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    try {
      // Save WhatsApp number to site_content when saving contact settings
      if (section === 'contato') {
        const whatsappContent = content.find(item => item.key === 'whatsapp_number');
        if (whatsappContent) {
          await updateContent(whatsappContent.id, {
            ...whatsappContent,
            content: contactSettings.whatsapp,
          });
        }
      }
      
      // Simulate other settings save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas!",
        description: `As configurações de ${section} foram atualizadas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Configure todos os aspectos do seu site e sistema administrativo.
        </p>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Site Settings */}
        <TabsContent value="site" forceMount>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Gerais do Site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nome do Site</Label>
                  <Input
                    id="site_name"
                    value={siteSettings.site_name}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site_url">URL do Site</Label>
                  <Input
                    id="site_url"
                    value={siteSettings.site_url}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, site_url: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Descrição do Site</Label>
                <Textarea
                  id="site_description"
                  value={siteSettings.site_description}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, site_description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL do Logo</Label>
                  <Input
                    id="logo_url"
                    value={siteSettings.logo_url}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">URL do Favicon</Label>
                  <Input
                    id="favicon_url"
                    value={siteSettings.favicon_url}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance_mode"
                  checked={siteSettings.maintenance_mode}
                  onCheckedChange={(checked) => setSiteSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                />
                <Label htmlFor="maintenance_mode">Modo de Manutenção</Label>
                {siteSettings.maintenance_mode && (
                  <Badge variant="destructive">Ativo</Badge>
                )}
              </div>

              <Button 
                onClick={() => handleSaveSettings('site')}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" forceMount>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Principal</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={contactSettings.phone}
                    onChange={(e) => setContactSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (só números)</Label>
                  <Input
                    id="whatsapp"
                    value={contactSettings.whatsapp}
                    onChange={(e) => setContactSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="11999999999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_hours">Horário de Funcionamento</Label>
                  <Input
                    id="business_hours"
                    value={contactSettings.business_hours}
                    onChange={(e) => setContactSettings(prev => ({ ...prev, business_hours: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={contactSettings.address}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_maps_embed">Google Maps Embed Code</Label>
                <Textarea
                  id="google_maps_embed"
                  value={contactSettings.google_maps_embed}
                  onChange={(e) => setContactSettings(prev => ({ ...prev, google_maps_embed: e.target.value }))}
                  placeholder="<iframe src='...' ></iframe>"
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => handleSaveSettings('contato')}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" forceMount>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={socialSettings.facebook}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={socialSettings.instagram}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={socialSettings.youtube}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={socialSettings.linkedin}
                    onChange={(e) => setSocialSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSettings('redes sociais')}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" forceMount>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de SEO e Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Título Global</Label>
                <Input
                  id="meta_title"
                  value={seoSettings.meta_title}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, meta_title: e.target.value }))}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.meta_title.length}/60 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Descrição Global</Label>
                <Textarea
                  id="meta_description"
                  value={seoSettings.meta_description}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.meta_description.length}/160 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Palavras-chave (separadas por vírgula)</Label>
                <Input
                  id="meta_keywords"
                  value={seoSettings.meta_keywords}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="piscinas, fibra, spa, aquecimento"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="google_analytics">Google Analytics ID</Label>
                  <Input
                    id="google_analytics"
                    value={seoSettings.google_analytics}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, google_analytics: e.target.value }))}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="google_tag_manager">Google Tag Manager ID</Label>
                  <Input
                    id="google_tag_manager"
                    value={seoSettings.google_tag_manager}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, google_tag_manager: e.target.value }))}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook_pixel">Facebook Pixel ID</Label>
                <Input
                  id="facebook_pixel"
                  value={seoSettings.facebook_pixel}
                  onChange={(e) => setSeoSettings(prev => ({ ...prev, facebook_pixel: e.target.value }))}
                  placeholder="123456789012345"
                />
              </div>

              <Button 
                onClick={() => handleSaveSettings('SEO')}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" forceMount>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_notifications">Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações gerais do sistema por e-mail
                    </p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quote_notifications">Notificações de Orçamentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Ser notificado quando novos orçamentos forem recebidos
                    </p>
                  </div>
                  <Switch
                    id="quote_notifications"
                    checked={notificationSettings.quote_notifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, quote_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="contact_notifications">Notificações de Contato</Label>
                    <p className="text-sm text-muted-foreground">
                      Ser notificado quando mensagens de contato forem enviadas
                    </p>
                  </div>
                  <Switch
                    id="contact_notifications"
                    checked={notificationSettings.contact_notifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, contact_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletter_notifications">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber newsletter com atualizações do sistema
                    </p>
                  </div>
                  <Switch
                    id="newsletter_notifications"
                    checked={notificationSettings.newsletter_notifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newsletter_notifications: checked }))}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSettings('notificações')}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" forceMount>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configurações Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h4 className="font-medium text-destructive mb-2">Zona de Perigo</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    As ações abaixo são irreversíveis. Use com extremo cuidado.
                  </p>
                  
                  <div className="space-y-2">
                    <Button variant="destructive" className="w-full">
                      Limpar Cache do Sistema
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Resetar Configurações para Padrão
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Exportar Dados do Sistema
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Versão do Sistema:</Label>
                    <p className="text-muted-foreground">v1.0.0</p>
                  </div>
                  <div>
                    <Label className="font-medium">Última Atualização:</Label>
                    <p className="text-muted-foreground">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Ambiente:</Label>
                    <Badge variant="default">Produção</Badge>
                  </div>
                  <div>
                    <Label className="font-medium">Status do Banco:</Label>
                    <Badge variant="default">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;