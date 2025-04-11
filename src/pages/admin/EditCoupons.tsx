import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Ticket, Info, X } from "lucide-react";
import { useThemeColors } from "@/hooks/use-theme-colors";

const EditCoupons = () => {
  const navigate = useNavigate();
  const [globalCouponCode, setGlobalCouponCode] = useState<string>("");
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const { colors } = useThemeColors();

  // Carregar cupom ao montar o componente
  useEffect(() => {
    // Carregar cupom global salvo anteriormente
    const savedCouponCode = localStorage.getItem("globalCouponCode");
    const savedDiscountPercent = localStorage.getItem("globalDiscountPercent");
    
    if (savedCouponCode) {
      setGlobalCouponCode(savedCouponCode);
    }
    
    if (savedDiscountPercent) {
      setGlobalDiscountPercent(parseFloat(savedDiscountPercent));
    }
  }, []);

  // Função para salvar o cupom global
  const handleSave = () => {
    try {
      // Validar e normalizar os valores do cupom
      const trimmedCouponCode = globalCouponCode.trim().toUpperCase();
      const validDiscountPercent = Math.min(100, Math.max(0, globalDiscountPercent));
      
      // Salvar o cupom global
      localStorage.setItem('globalCouponCode', trimmedCouponCode);
      localStorage.setItem('globalDiscountPercent', validDiscountPercent.toString());
      
      // Atualizar o estado com os valores normalizados
      setGlobalCouponCode(trimmedCouponCode);
      setGlobalDiscountPercent(validDiscountPercent);
      
      // Atualizar produtos com o cupom
      const savedProducts = localStorage.getItem("productList");
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          const updatedProducts = parsedProducts.map((product: any) => ({
            ...product,
            couponCode: trimmedCouponCode,
            discountPercent: validDiscountPercent
          }));
          
          localStorage.setItem('productList', JSON.stringify(updatedProducts));
        } catch (error) {
          console.error('Erro ao atualizar produtos com cupom:', error);
        }
      }
      
      // Mensagem de sucesso diferente dependendo se o cupom está ativo ou não
      if (trimmedCouponCode !== "" && validDiscountPercent > 0) {
        toast({
          title: "Cupom salvo",
          description: `Cupom global "${trimmedCouponCode}" com ${validDiscountPercent}% de desconto aplicado a todos os produtos.`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Cupom desativado",
          description: "Nenhum cupom de desconto está ativo atualmente.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erro ao salvar cupom:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar o cupom. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Função para limpar o cupom global
  const handleClearCoupon = () => {
    setGlobalCouponCode("");
    setGlobalDiscountPercent(0);
    localStorage.removeItem("globalCouponCode");
    localStorage.removeItem("globalDiscountPercent");
    
    // Também remover o cupom de todos os produtos
    const savedProducts = localStorage.getItem("productList");
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        const updatedProducts = parsedProducts.map((product: any) => ({
          ...product,
          couponCode: "",
          discountPercent: 0
        }));
        
        localStorage.setItem('productList', JSON.stringify(updatedProducts));
      } catch (error) {
        console.error('Erro ao remover cupom dos produtos:', error);
      }
    }
    
    toast({
      title: "Cupom removido",
      description: "O cupom global foi removido com sucesso de todos os produtos.",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Cupom de Desconto</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleSave}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
            {(globalCouponCode.trim() !== "" || globalDiscountPercent > 0) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCoupon}
                className="flex-1 sm:flex-none text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>
        
        {/* Seção de Cupom Global */}
        <Card className="border shadow-sm">
          <CardHeader className="p-4 flex flex-row items-center justify-between bg-muted/30">
            <CardTitle className="text-lg flex items-center">
              <Ticket className="h-5 w-5 mr-2" />
              Cupom de Desconto Global
              {(globalCouponCode.trim() !== "" && globalDiscountPercent > 0) ? (
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 font-medium rounded-full">
                  Ativo
                </span>
              ) : (
                <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-full">
                  Inativo
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="global-coupon">Código do Cupom</Label>
                  <Input
                    id="global-coupon"
                    value={globalCouponCode}
                    onChange={(e) => setGlobalCouponCode(e.target.value)}
                    className="mt-1 uppercase"
                    placeholder="Ex: DESCONTO20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite um código personalizado que funcionará como senha
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="global-discount">Porcentagem de Desconto</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="global-discount"
                      type="number"
                      value={globalDiscountPercent}
                      onChange={(e) => setGlobalDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="mt-1"
                      min={0}
                      max={100}
                      step={1}
                    />
                    <span className="text-sm">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Defina a porcentagem de desconto a ser aplicada
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-sm flex items-start sm:items-center">
                <Info className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 text-green-600 shrink-0" />
                <span>
                  {globalCouponCode && globalDiscountPercent > 0
                    ? `Quando o cliente inserir o código "${globalCouponCode}", receberá ${globalDiscountPercent}% de desconto no valor total da compra.`
                    : "O cupom está atualmente desativado. Defina um código e porcentagem maior que zero para ativá-lo."
                  }
                </span>
              </p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-base font-medium mb-2">Instruções:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>O cupom é opcional. Você pode deixá-lo vazio ou com porcentagem zero para desativá-lo.</li>
                <li>Quando ativo, será aplicado automaticamente a todos os produtos.</li>
                <li>Os clientes poderão aplicar o cupom no carrinho para receber o desconto.</li>
                <li>Este desconto será aplicado sobre o total da compra.</li>
                <li>Para remover o cupom, clique no botão "Limpar" acima.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditCoupons; 