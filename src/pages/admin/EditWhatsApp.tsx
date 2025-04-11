import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, Phone } from "lucide-react";
import { useStoreInfo } from "@/hooks/use-store-info";

const EditWhatsApp = () => {
  const navigate = useNavigate();
  const { storeInfo, updateStoreInfo } = useStoreInfo();
  const [whatsappNumber, setWhatsappNumber] = useState(storeInfo.phone);

  useEffect(() => {
    document.title = "Editar WhatsApp - Admin";
    setWhatsappNumber(storeInfo.phone);
  }, [storeInfo.phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsappNumber(e.target.value);
  };

  const handleSave = () => {
    updateStoreInfo({ phone: whatsappNumber });
    toast.success("Número de WhatsApp atualizado com sucesso!");
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
          <h1 className="text-2xl font-bold">Editar WhatsApp</h1>
        </div>
        
        <Card className="max-w-lg mx-auto">
          <CardHeader className="bg-muted p-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Configuração do WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="whatsapp-number">Número de WhatsApp</Label>
                <Input
                  id="whatsapp-number"
                  value={whatsappNumber}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Ex: 5511999998888"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Insira o número no formato internacional, sem espaços ou caracteres especiais.
                  Ex: 5511999998888 (55 = Brasil, 11 = DDD, 999998888 = número)
                </p>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-primary text-white" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditWhatsApp; 