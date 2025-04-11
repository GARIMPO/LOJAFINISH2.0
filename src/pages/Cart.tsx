import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";
import { useStoreInfo } from "@/hooks/use-store-info";
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, Ticket, Check, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Cart = () => {
  const navigate = useNavigate();
  const { colors } = useThemeColors();
  const { storeInfo } = useStoreInfo();
  const {
    cart,
    removeFromCart,
    addToCart,
    clearCart,
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
  
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: customerInfo.address.street,
    number: customerInfo.address.number,
    complement: customerInfo.address.complement,
    city: customerInfo.address.city,
    zipCode: customerInfo.address.zipCode
  });

  // Estilos
  const headerStyle = {
    backgroundColor: applyOpacity(colors.headerBg, colors.headerOpacity),
    color: colors.primary
  };

  const buttonStyle = {
    backgroundColor: applyOpacity(colors.buttonBg, colors.buttonOpacity),
    borderColor: colors.buttonBg,
    color: '#ffffff'
  };

  // useEffect para garantir que os valores do desconto sejam atualizados no subtotal
  // e revalidar cupons quando a página for carregada
  useEffect(() => {
    if (appliedCoupon) {
      console.log("Cupom aplicado no carrinho:", appliedCoupon, "Desconto:", discount);
      
      // Revalidar o cupom para garantir que ainda é válido
      // Isso é importante especialmente após recarregar a página
      const validationResult = validateCoupon(appliedCoupon);
      if (!validationResult.valid) {
        // O cupom não é mais válido - talvez tenha sido removido do cliente
        console.log("Cupom não é mais válido após recarregar a página:", appliedCoupon);
        setAppliedCoupon("");
        setDiscount(0);
        // Não mostrar mensagem de erro para não confundir o usuário
      }
    }
  }, [appliedCoupon, discount]);

  // Handlers
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

  const handleDeliveryMethodChange = (value: string) => {
    setDeliveryMethod(value as any);
    
    // Se mudar para entrega no endereço e não tiver endereço preenchido, abre o modal
    if (value === "delivery" && !customerInfo.address.street) {
      setIsAddressDialogOpen(true);
    }
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as any);
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError("Digite um código de cupom");
      return;
    }

    try {
      // Limpar mensagem de erro anterior
      setCouponError("");
      
      // Normalizar o código do cupom
      const normalizedCoupon = couponInput.trim().toUpperCase();
      
      // Validar o cupom
      const validationResult = validateCoupon(normalizedCoupon);
      
      if (validationResult.valid) {
        // Aplicar o cupom
        setAppliedCoupon(normalizedCoupon);
        // Definir o desconto
        setDiscount(validationResult.discount);
        
        // Verificar se é um cupom personalizado baseado no resultado da validação
        if ('isPersonal' in validationResult && validationResult.isPersonal) {
          // Mensagem para cupom personalizado
          if (validationResult.discount > 0) {
            toast({
              title: "Cupom personalizado aplicado",
              description: `Seu cupom exclusivo "${normalizedCoupon}" foi aplicado com sucesso! ${validationResult.discount}% de desconto.`,
              duration: 3000,
            });
          } else {
            toast({
              title: "Cupom personalizado aplicado",
              description: `Seu cupom exclusivo "${normalizedCoupon}" foi aplicado, mas não fornece desconto (0%).`,
              duration: 3000,
            });
          }
        } else {
          // Mensagem para cupom comum
          if (validationResult.discount > 0) {
            toast({
              title: "Cupom aplicado",
              description: `Cupom "${normalizedCoupon}" aplicado com sucesso! ${validationResult.discount}% de desconto.`,
              duration: 3000,
            });
          } else {
            toast({
              title: "Cupom aplicado",
              description: `Cupom "${normalizedCoupon}" foi aplicado, mas não fornece desconto (0%).`,
              duration: 3000,
            });
          }
        }
        
        setCouponInput("");
      } else {
        // Mensagem de erro personalizada se disponível
        const errorMessage = validationResult.message || "Cupom inválido ou não disponível para este cliente";
        setCouponError(errorMessage);
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
    // Save customer data to customer database if name and phone are provided
    if (customerInfo.name.trim() && customerInfo.phone.trim()) {
      // Generate unique ID for the customer
      const customerId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Get existing customer database or initialize empty array
      const existingCustomers = JSON.parse(localStorage.getItem("customerDatabase") || "[]");
      
      // Check if this customer already exists with same name and phone
      const existingCustomerIndex = existingCustomers.findIndex(
        (customer: any) => 
          customer.name.toLowerCase() === customerInfo.name.toLowerCase() && 
          customer.phone === customerInfo.phone
      );
      
      // Process coupon if applied
      if (appliedCoupon) {
        const normalizedCoupon = appliedCoupon.trim().toUpperCase();
        
        // Encontrar o cliente que possui este cupom (se existir)
        const couponOwnerIndex = existingCustomers.findIndex(
          (customer: any) => 
            customer.couponCode && 
            customer.couponCode.toUpperCase() === normalizedCoupon
        );
        
        if (couponOwnerIndex >= 0) {
          // Verificar se o cupom é de uso único
          const isOneTimeUse = existingCustomers[couponOwnerIndex].isOneTimeUse !== false;
          
          // Se for de uso único, remover após o uso
          if (isOneTimeUse) {
            // Found the coupon owner - remove their coupon after use
            console.log("Cupom de uso único encontrado - removendo após o uso");
            existingCustomers[couponOwnerIndex].couponCode = "";
            existingCustomers[couponOwnerIndex].discountPercent = 0;
            
            toast({
              title: "Cupom utilizado",
              description: "O cupom de uso único foi aplicado com sucesso e removido após o uso.",
              duration: 3000,
            });
          } else {
            console.log("Cupom de múltiplos usos encontrado - mantendo-o ativo");
            toast({
              title: "Cupom utilizado",
              description: "O cupom foi aplicado com sucesso e poderá ser utilizado novamente.",
              duration: 3000,
            });
          }
        } else {
          console.log("Cupom de produto utilizado - não é removido após o uso");
        }
      }
      
      if (existingCustomerIndex >= 0) {
        // Customer exists - preserve their existing data but update timestamp
        existingCustomers[existingCustomerIndex].timestamp = Date.now();
      } else {
        // Only add if not a duplicate - this is a new customer
        const newCustomer = {
          id: customerId,
          name: customerInfo.name,
          phone: customerInfo.phone,
          timestamp: Date.now(),
          rating: 0, // Default rating for new customers
          couponCode: "", // Default empty coupon
          discountPercent: 0, // Default no discount
          isOneTimeUse: false // Default isOneTimeUse
        };
        
        // Add to existing customers array
        existingCustomers.push(newCustomer);
      }
      
      // Update customer database after all changes
      localStorage.setItem("customerDatabase", JSON.stringify(existingCustomers));
    }
  
    // Criar mensagem com detalhes do pedido
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
    const paymentText = getPaymentMethodText();
    
    // Dados do cliente
    const customerName = customerInfo.name.trim() ? `*Nome:* ${customerInfo.name}` : "Cliente não identificado";
    
    // Resumo do pedido com valores atualizados
    const subtotal = calculateTotal();
    const discountAmount = appliedCoupon ? subtotal * (discount / 100) : 0;
    const finalTotal = subtotal - discountAmount;
    
    const orderSummary = appliedCoupon && discount > 0
      ? `*RESUMO DO PEDIDO:*\n• Total de itens: ${cart.length}\n• Total de produtos: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n• Subtotal: R$ ${subtotal.toFixed(2)}\n• Desconto (${discount}%): -R$ ${discountAmount.toFixed(2)}\n• Total final: R$ ${finalTotal.toFixed(2)}`
      : `*RESUMO DO PEDIDO:*\n• Total de itens: ${cart.length}\n• Total de produtos: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n• Valor total: R$ ${subtotal.toFixed(2)}`;
    
    // Informações do cupom
    const couponInfo = appliedCoupon 
      ? (discount > 0 
          ? `\n\n*CUPOM APLICADO:*\n• Código: ${appliedCoupon}\n• Desconto: ${discount}%\n• Valor do desconto: R$ ${(calculateTotal() * (discount / 100)).toFixed(2)}`
          : `\n\n*CUPOM APLICADO:*\n• Código: ${appliedCoupon}\n• Sem desconto (0%)`)
      : "";
    
    // Informações da loja
    const storeDetails = `*${storeInfo.name}*\n${storeInfo.address}`;
    
    // Mensagem completa
    const message = `Olá! Gostaria de fazer um pedido:\n\n${customerName}${couponInfo}\n\n*PRODUTOS:*\n${orderItems}\n\n${orderSummary}\n\n*Método de entrega:* ${deliveryText}${deliveryMethod === "delivery" ? `\n${deliveryAddress}` : ""}\n*Forma de pagamento:* ${paymentText}\n\n*Data:* ${orderDate} às ${orderTime}\n\n${storeDetails}\n\nObrigado!`;
    
    // Format phone number by removing non-numeric characters
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
    
    // Criar URL do WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp em uma nova janela
    window.open(whatsappUrl, '_blank');
    
    // Notificar o usuário que o pedido foi enviado
    toast({
      title: "Pedido enviado!",
      description: "Seu pedido foi enviado com sucesso para o WhatsApp da loja.",
      variant: "default",
    });
  };

  // Funções auxiliares
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
  
  const getPaymentMethodText = () => {
    const methods: Record<string, string> = {
      money: "Dinheiro",
      pix: "Pix",
      credit: "Cartão de Crédito",
      debit: "Cartão de Débito",
      other: "Outro"
    };
    return methods[paymentMethod];
  };

  // Se o carrinho estiver vazio, mostrar mensagem e link para continuar comprando
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Meu Carrinho</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
            <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-30" />
            <h2 className="text-xl font-medium text-muted-foreground">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground max-w-md text-center">
              Parece que você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/")}
              style={buttonStyle}
            >
              Continuar Comprando
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Meu Carrinho</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produtos no carrinho (coluna da esquerda e do meio em desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Produtos</h2>
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-muted last:border-none">
                      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <Link to={`/produto/${item.id}`} className="text-lg font-medium hover:underline">
                          {item.name}
                        </Link>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description.slice(0, 80)}...
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="font-medium text-center w-4">
                              {item.quantity}
                            </span>
                            
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium" style={{ color: colors.primary }}>
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} x R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="flex-shrink-0 h-9 w-9"
                        onClick={() => {
                          for (let i = 0; i < item.quantity; i++) {
                            removeFromCart(item.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-muted">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/")}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continuar Comprando
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={clearCart}
                    className="text-sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Limpar Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Resumo e finalização (coluna da direita em desktop) */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({discount}%)</span>
                      <span>-R$ {(calculateTotal() * (discount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  {appliedCoupon && discount > 0 ? (
                    <>
                      <div className="flex justify-between text-muted-foreground line-through">
                        <span>Total sem desconto</span>
                        <span>R$ {calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total com desconto</span>
                        <span style={{ color: colors.primary }}>
                          R$ {calculateFinalTotal().toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span style={{ color: colors.primary }}>
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Cupom de desconto */}
                <div className="border rounded-lg p-4 mb-6 bg-muted/20">
                  <h3 className="text-sm font-medium mb-2">Cupom de Desconto</h3>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <div>
                        <p className="text-sm font-medium text-green-700 flex items-center">
                          {appliedCoupon.toUpperCase()}
                          {(() => {
                            // Verificar se é um cupom personalizado
                            const customerDatabase = JSON.parse(localStorage.getItem("customerDatabase") || "[]");
                            const customerWithCoupon = customerDatabase.find(
                              (customer: any) => 
                                customer.couponCode && 
                                customer.couponCode.toUpperCase() === appliedCoupon.trim().toUpperCase()
                            );
                            
                            if (customerWithCoupon) {
                              const isOneTimeUse = customerWithCoupon.isOneTimeUse !== false;
                              return (
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="ml-2 text-xs border-green-200 bg-green-100">
                                    Exclusivo
                                  </Badge>
                                  {isOneTimeUse && (
                                    <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-700">
                                      Uso único
                                    </Badge>
                                  )}
                                </div>
                              );
                            }
                            
                            return null;
                          })()}
                        </p>
                        <p className="text-xs text-green-600">
                          Desconto de {discount}% (R$ {(calculateTotal() * (discount / 100)).toFixed(2)})
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRemoveCoupon}
                        className="h-8 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Digite seu cupom"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError("");
                          }}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          className="h-8"
                          style={buttonStyle}
                          onClick={handleApplyCoupon}
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-500">{couponError}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Você pode aplicar um cupom de desconto para sua compra.
                        Cupons personalizados são de uso único.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Dados do cliente */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium">Seus Dados</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      placeholder="Seu telefone com DDD"
                    />
                  </div>
                </div>
                
                {/* Opções de entrega */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium">Opções de Entrega</h3>
                  
                  <RadioGroup 
                    value={deliveryMethod} 
                    onValueChange={handleDeliveryMethodChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">Retirar na loja</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">Entrega no endereço</Label>
                    </div>
                  </RadioGroup>
                  
                  {deliveryMethod === "delivery" && (
                    <div className="mt-2 p-3 bg-muted/40 rounded border">
                      <div className="flex justify-between items-center">
                        <p className="text-sm line-clamp-1">
                          {customerInfo.address.street ? formatAddress() : "Endereço não informado"}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs ml-2"
                          onClick={() => setIsAddressDialogOpen(true)}
                        >
                          {customerInfo.address.street ? "Editar" : "Adicionar"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Forma de pagamento */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium">Forma de Pagamento</h3>
                  
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={handlePaymentMethodChange}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="money" id="pay-money" />
                      <Label htmlFor="pay-money" className="flex-1 cursor-pointer text-sm">Dinheiro</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="pix" id="pay-pix" />
                      <Label htmlFor="pay-pix" className="flex-1 cursor-pointer text-sm">PIX</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="credit" id="pay-credit" />
                      <Label htmlFor="pay-credit" className="flex-1 cursor-pointer text-sm">Cartão de Crédito</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="debit" id="pay-debit" />
                      <Label htmlFor="pay-debit" className="flex-1 cursor-pointer text-sm">Cartão de Débito</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Botão de finalizar pedido */}
                <Button 
                  className="w-full text-white"
                  size="lg" 
                  onClick={handleFinishOrder}
                  style={buttonStyle}
                  disabled={deliveryMethod === "delivery" && !customerInfo.address.street}
                >
                  <Check className="mr-2 h-4 w-4" /> Finalizar Pedido
                </Button>
                
                {deliveryMethod === "delivery" && !customerInfo.address.street && (
                  <p className="text-xs text-center mt-2 text-orange-500">
                    É necessário informar o endereço de entrega
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {storeInfo.name} feito por{" "}
            <a 
              href="https://garimpodeofertas.com.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              Garimpo de ofertas
            </a>
            . Todos os direitos reservados.
          </p>
        </div>
      </footer>
      
      {/* Modal de endereço */}
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
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            Valor do frete cobrado separadamente
          </p>
          
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
              style={buttonStyle}
            >
              Salvar endereço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart; 