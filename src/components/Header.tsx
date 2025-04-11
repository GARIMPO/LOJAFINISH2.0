import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Key, Store, Truck, RefreshCw, User, CreditCard, Banknote, QrCode, Wallet, MapPin, X, Ticket, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, DeliveryMethod, PaymentMethod } from "@/hooks/use-cart";
import { useStoreInfo } from "@/hooks/use-store-info";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SplitText from "./SplitText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const { 
    cart, 
    removeFromCart, 
    calculateTotal,
    calculateFinalTotal,
    deliveryMethod, 
    setDeliveryMethod, 
    paymentMethod,
    setPaymentMethod,
    customerInfo, 
    setCustomerInfo,
    appliedCoupon,
    setAppliedCoupon,
    discount,
    setDiscount,
    validateCoupon
  } = useCart();
  const { storeInfo } = useStoreInfo();
  const { colors } = useThemeColors();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [addressForm, setAddressForm] = useState({
    street: customerInfo.address.street,
    number: customerInfo.address.number,
    complement: customerInfo.address.complement,
    city: customerInfo.address.city,
    zipCode: customerInfo.address.zipCode
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Atualiza o estado local do formulário quando o customerInfo mudar
  useEffect(() => {
    setAddressForm({
      street: customerInfo.address.street,
      number: customerInfo.address.number,
      complement: customerInfo.address.complement,
      city: customerInfo.address.city,
      zipCode: customerInfo.address.zipCode
    });
  }, [customerInfo.address]);

  // Verificar status de login ao carregar o componente
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStorage = localStorage.getItem("isLoggedIn") === "true" || 
                             sessionStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedInStorage);
    };
    
    checkLoginStatus();
    
    // Verificar status a cada 10 segundos para sincronizar entre abas
    const interval = setInterval(checkLoginStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const headerStyle = {
    backgroundColor: applyOpacity(colors.headerBg, colors.headerOpacity),
    borderBottomColor: applyOpacity(colors.headerBg, Math.min(colors.headerOpacity + 10, 100))
  };

  const buttonStyle = {
    backgroundColor: applyOpacity(colors.buttonBg, colors.buttonOpacity),
    borderColor: colors.buttonBg,
    color: '#ffffff'
  };

  const handleDeliveryMethodChange = (value: string) => {
    const newDeliveryMethod = value as DeliveryMethod;
    setDeliveryMethod(newDeliveryMethod);
    
    // Se mudar para entrega no endereço e não tiver endereço preenchido, abre o modal
    if (newDeliveryMethod === "delivery" && !customerInfo.address.street) {
      setIsAddressDialogOpen(true);
    }
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    if (field === "name" || field === "phone") {
      setCustomerInfo({ ...customerInfo, [field]: value });
    }
  };
  
  const handleAddressChange = (field: keyof typeof addressForm, value: string) => {
    setAddressForm({ ...addressForm, [field]: value });
  };
  
  const handleSaveAddress = () => {
    setCustomerInfo({
      ...customerInfo,
      address: {
        street: addressForm.street,
        number: addressForm.number,
        complement: addressForm.complement,
        city: addressForm.city,
        zipCode: addressForm.zipCode
      }
    });
    setIsAddressDialogOpen(false);
  };
  
  const formatAddress = () => {
    const { street, number, complement, city, zipCode } = customerInfo.address;
    let formattedAddress = "";
    
    if (street) formattedAddress += street;
    if (number) formattedAddress += `, ${number}`;
    if (complement) formattedAddress += `, ${complement}`;
    if (city) formattedAddress += `, ${city}`;
    if (zipCode) formattedAddress += `, CEP: ${zipCode}`;
    
    return formattedAddress || "Endereço não informado";
  };
  
  const getPaymentMethodText = (method: PaymentMethod) => {
    const methods = {
      money: "Dinheiro",
      pix: "Pix",
      credit: "Cartão de Crédito",
      debit: "Cartão de Débito",
      other: "Outro"
    };
    return methods[method];
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError("Digite um código de cupom");
      return;
    }

    try {
      // Limpar mensagem de erro anterior
      setCouponError("");
      
      // Validar o cupom
      const validationResult = validateCoupon(couponInput);
      
      if (validationResult.valid) {
        // Aplicar o cupom
        setAppliedCoupon(couponInput);
        // Definir o desconto
        setDiscount(validationResult.discount);
        toast({
          title: "Cupom aplicado",
          description: `Cupom "${couponInput}" aplicado com sucesso! ${validationResult.discount}% de desconto.`,
          duration: 3000,
        });
        setCouponInput("");
      } else {
        setCouponError("Cupom inválido");
        setAppliedCoupon("");
        setDiscount(0);
      }
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error);
      setCouponError("Erro ao processar o cupom");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponInput("");
    setCouponError("");
  };

  const handleFinishOrder = () => {
    // Create message with order details
    const orderDate = new Date().toLocaleDateString('pt-BR');
    const orderTime = new Date().toLocaleTimeString('pt-BR');
    
    // Detalhes dos itens do pedido
    const orderItems = cart.map(item => 
      `*${item.name}*\nQuantidade: ${item.quantity}\nValor unitário: R$ ${item.price.toFixed(2)}\nSubtotal: R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n\n');
    
    // Método de entrega
    const deliveryText = deliveryMethod === "pickup" 
      ? "Retirar na loja" 
      : "Entrega no endereço";
    
    // Endereço de entrega (se aplicável)
    const deliveryAddress = deliveryMethod === "delivery" 
      ? `*Endereço de entrega:*\n${formatAddress()}` 
      : "";
    
    // Método de pagamento
    const paymentText = getPaymentMethodText(paymentMethod);
    
    // Dados do cliente
    const customerName = customerInfo.name.trim() ? `*Nome:* ${customerInfo.name}` : "Cliente não identificado";
    
    // Resumo do pedido
    const orderSummary = `*RESUMO DO PEDIDO:*\n• Total de itens: ${cart.length}\n• Total de produtos: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n• Valor total: R$ ${calculateTotal().toFixed(2)}`;
    
    // Informações da loja
    const storeDetails = `*${storeInfo.name}*\n${storeInfo.address}`;
    
    // Monta a mensagem completa
    const message = `Olá! Gostaria de fazer um pedido:\n\n${customerName}\n\n*PRODUTOS:*\n${orderItems}\n\n${orderSummary}\n\n*Método de entrega:* ${deliveryText}${deliveryMethod === "delivery" ? `\n${deliveryAddress}` : ""}\n*Forma de pagamento:* ${paymentText}\n\n*Data:* ${orderDate} às ${orderTime}\n\n${storeDetails}\n\nObrigado!`;
    
    // Format phone number by removing non-numeric characters and ensuring correct format
    let phoneNumber = storeInfo.phone.replace(/\D/g, '');
    
    // Garantir que o número tenha o formato correto para o Brasil
    // Se não tiver o código do país (55 para Brasil), adiciona-o
    if (!phoneNumber.startsWith('55')) {
      // Se começar com 0, remove o zero e adiciona 55
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '55' + phoneNumber.substring(1);
      } else {
        phoneNumber = '55' + phoneNumber;
      }
    }
    
    // Create WhatsApp URL
    // O formato correto é: https://api.whatsapp.com/send?phone=NUMERO&text=MENSAGEM
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Close the cart drawer
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    
    // Mostrar toast de logout
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
      duration: 2000,
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b shadow-sm" style={headerStyle}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold">
              <SplitText 
                text={storeInfo.name}
                className="text-xl font-bold"
                delay={50}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,15px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing="easeOutQuint"
                threshold={0.1}
                rootMargin="-20px"
                textAlign="left"
                onLetterAnimationComplete={() => console.log('Nome animado!')}
                style={{ color: colors.primary }}
              />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                title="Sair"
              >
                <LogIn className="h-5 w-5 rotate-180" style={{ color: colors.primary }} />
              </Button>
            ) : (
              <Link to="/login" title="Entrar">
                <Button variant="ghost" size="icon">
                  <LogIn className="h-5 w-5" style={{ color: colors.primary }} />
                </Button>
              </Link>
            )}
            
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <Key className="h-5 w-5" style={{ color: colors.primary }} />
              </Button>
            </Link>
            
            <Link to="/carrinho">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" style={{ color: colors.primary }} />
                {cart.length > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 animate-bounce"
                    style={{ backgroundColor: colors.primary, color: '#ffffff' }}
                    variant="default"
                  >
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Endereço de entrega</DialogTitle>
            <DialogDescription>
              Preencha os dados do endereço para entrega
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            <div className="grid gap-1">
              <Label htmlFor="street">Rua/Avenida</Label>
              <Input
                id="street"
                value={addressForm.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Nome da rua ou avenida"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={addressForm.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  placeholder="Número"
                />
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={addressForm.complement}
                  onChange={(e) => handleAddressChange('complement', e.target.value)}
                  placeholder="Apto, Casa, etc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Cidade"
                />
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={addressForm.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddressDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveAddress}
              disabled={!addressForm.street || !addressForm.number || !addressForm.city}
              style={{backgroundColor: colors.primary, color: 'white'}}
            >
              Salvar endereço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
