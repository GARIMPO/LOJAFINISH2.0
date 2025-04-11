import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Facebook, Mail, Globe } from "lucide-react";
import { TiktokIcon, TelegramIcon, InstagramIcon, WhatsAppIcon, XIcon } from "@/components/SocialIcons";
import { useStoreInfo } from "@/hooks/use-store-info";

const socialIcons = {
  instagram: <InstagramIcon className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  whatsapp: <WhatsAppIcon className="h-5 w-5" />,
  x: <XIcon className="h-5 w-5" />,
  tiktok: <TiktokIcon className="h-5 w-5" />,
  telegram: <TelegramIcon className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />
};

const socialLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  x: "X (Twitter)",
  tiktok: "TikTok",
  telegram: "Telegram",
  email: "E-mail",
  website: "Website"
};

const placeholders = {
  instagram: "https://instagram.com/sua_loja",
  facebook: "https://facebook.com/sua_loja",
  whatsapp: "https://wa.me/5511999999999",
  x: "https://x.com/sua_loja",
  tiktok: "https://tiktok.com/@sua_loja",
  telegram: "https://t.me/sua_loja",
  email: "contato@sualoja.com",
  website: "www.sualoja.com"
};

const EditSocialLinks = () => {
  const navigate = useNavigate();
  const { storeInfo, updateSocialMedia } = useStoreInfo();
  const [socialLinks, setSocialLinks] = useState(storeInfo.socials);

  // Estilos para os cards alternados
  const cardStyles = [
    { backgroundColor: "#ffffff" },  // branco
    { backgroundColor: "#f5f5f5" }   // cinza claro
  ];

  // Estilos para os cabeçalhos dos cards
  const headerStyles = [
    { backgroundColor: "#f9f9f9" },  // cinza bem claro
    { backgroundColor: "#f0f0f0" }   // cinza claro
  ];

  useEffect(() => {
    document.title = "Editar Redes Sociais - Admin";
  }, []);

  const handleUrlChange = (key: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], url: value }
    }));
  };

  const handleToggleChange = (key: string, checked: boolean) => {
    setSocialLinks(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], enabled: checked }
    }));
  };

  const handleSave = () => {
    // Update each social media in the context
    Object.entries(socialLinks).forEach(([key, value]) => {
      updateSocialMedia(key, value);
    });
    
    toast.success("Links de redes sociais atualizados com sucesso!");
    setTimeout(() => navigate("/admin"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Redes Sociais</h1>
        </div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          {Object.keys(socialLinks).map((key, index) => {
            const socialKey = key as keyof typeof socialLinks;
            return (
              <Card 
                key={key} 
                className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                style={cardStyles[index % 2]}
              >
                <CardHeader 
                  className="p-3 flex flex-row items-center justify-between"
                  style={headerStyles[index % 2]}
                >
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="p-1.5 bg-primary/10 rounded-md flex items-center justify-center">
                      {socialIcons[socialKey]}
                    </span>
                    {socialLabels[socialKey]}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={socialLinks[socialKey].enabled}
                      onCheckedChange={(checked) => handleToggleChange(key, checked)}
                      id={`switch-${key}`}
                    />
                    <Label htmlFor={`switch-${key}`} className="text-sm">
                      {socialLinks[socialKey].enabled ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <Label className="mb-1.5">URL</Label>
                    <Input
                      value={socialLinks[socialKey].url}
                      onChange={(e) => handleUrlChange(key, e.target.value)}
                      placeholder={placeholders[socialKey]}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {key === 'email' ? 'Insira um endereço de e-mail' : 
                       key === 'whatsapp' ? 'Número com DDD ou link do WhatsApp' : 
                       `Endereço completo do perfil ${socialLabels[socialKey]}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-primary text-white" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSocialLinks; 