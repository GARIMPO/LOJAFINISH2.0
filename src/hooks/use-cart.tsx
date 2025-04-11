import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
}

export type DeliveryMethod = "pickup" | "delivery";
export type PaymentMethod = "money" | "pix" | "credit" | "debit" | "other";

export interface CustomerInfo {
  name: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    zipCode: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  appliedCoupon: string;
  setAppliedCoupon: (coupon: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  calculateFinalTotal: () => number;
  validateCoupon: (coupon: string) => { 
    valid: boolean; 
    discount: number; 
    message?: string;
    isPersonal?: boolean;
    isOneTimeUse?: boolean;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("money");
  const [appliedCoupon, _setAppliedCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: {
      street: "",
      number: "",
      complement: "",
      city: "",
      zipCode: ""
    }
  });

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    
    // Load delivery method from localStorage
    const savedDeliveryMethod = localStorage.getItem("deliveryMethod");
    if (savedDeliveryMethod) {
      try {
        setDeliveryMethod(savedDeliveryMethod as DeliveryMethod);
      } catch (error) {
        console.error("Failed to parse delivery method from localStorage:", error);
      }
    }
    
    // Load payment method from localStorage
    const savedPaymentMethod = localStorage.getItem("paymentMethod");
    if (savedPaymentMethod) {
      try {
        setPaymentMethod(savedPaymentMethod as PaymentMethod);
      } catch (error) {
        console.error("Failed to parse payment method from localStorage:", error);
      }
    }
    
    // Load customer info from localStorage
    const savedCustomerInfo = localStorage.getItem("customerInfo");
    if (savedCustomerInfo) {
      try {
        setCustomerInfo(JSON.parse(savedCustomerInfo));
      } catch (error) {
        console.error("Failed to parse customer info from localStorage:", error);
      }
    }

    // Load applied coupon from localStorage
    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      _setAppliedCoupon(savedCoupon);
    }

    // Load discount from localStorage
    const savedDiscount = localStorage.getItem("discount");
    if (savedDiscount) {
      try {
        setDiscount(parseFloat(savedDiscount));
      } catch (error) {
        console.error("Failed to parse discount from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  // Save delivery method to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("deliveryMethod", deliveryMethod);
  }, [deliveryMethod]);
  
  // Save payment method to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("paymentMethod", paymentMethod);
  }, [paymentMethod]);
  
  // Save customer info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
  }, [customerInfo]);

  // Save applied coupon to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("appliedCoupon", appliedCoupon);
  }, [appliedCoupon]);

  // Save discount to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("discount", discount.toString());
  }, [discount]);

  // Validate coupon code
  const validateCoupon = (coupon: string) => {
    // Verificar se o código está vazio
    if (!coupon || !coupon.trim()) {
      return { valid: false, discount: 0 };
    }
    
    // Normalizar o código do cupom (para maiúsculas)
    const normalizedCoupon = coupon.trim().toUpperCase();
    
    // 1. Verificar cupons personalizados de clientes
    const customerDatabase = JSON.parse(localStorage.getItem("customerDatabase") || "[]");
    const customerWithCoupon = customerDatabase.find((customer: any) => 
      customer.couponCode && 
      customer.couponCode.toUpperCase() === normalizedCoupon && 
      customer.discountPercent >= 0
    );
    
    if (customerWithCoupon) {
      // Verificar se o cliente do cupom coincide com o cliente atual (pelo telefone)
      const isPhoneMatch = customerInfo.phone && 
                          customerWithCoupon.phone === customerInfo.phone;
                          
      // Verificar se o cliente do cupom coincide com o cliente atual (pelo nome)
      const isNameMatch = customerInfo.name && 
                         customerWithCoupon.name.toLowerCase() === customerInfo.name.toLowerCase();
      
      // Se o código é de cliente, mas os dados não batem, o cupom é inválido
      if (!isPhoneMatch && !isNameMatch) {
        console.log("Cupom de cliente encontrado, mas não corresponde ao cliente atual");
        console.log("Cliente do cupom:", customerWithCoupon.name, customerWithCoupon.phone);
        console.log("Cliente atual:", customerInfo.name, customerInfo.phone);
        return { valid: false, discount: 0, message: "Este cupom é exclusivo para outro cliente" };
      }
      
      console.log("Cupom de cliente encontrado e válido:", customerWithCoupon);
      setDiscount(customerWithCoupon.discountPercent);
      
      // Verificar se é um cupom de uso único
      const isOneTimeUse = customerWithCoupon.isOneTimeUse !== false;
      
      // Persistir informações para garantir consistência após atualização da página
      localStorage.setItem("appliedCoupon", normalizedCoupon);
      localStorage.setItem("discount", customerWithCoupon.discountPercent.toString());
      
      return { 
        valid: true, 
        discount: customerWithCoupon.discountPercent,
        isPersonal: true,
        isOneTimeUse: isOneTimeUse
      };
    }
    
    // 2. Verificar cupons de produtos (cupons globais)
    const globalCouponCode = localStorage.getItem("globalCouponCode");
    const globalDiscountPercent = localStorage.getItem("globalDiscountPercent");
    
    // Verificar se o cupom global existe e corresponde ao cupom inserido
    if (globalCouponCode && 
        globalCouponCode.trim().toUpperCase() === normalizedCoupon) {
      
      const discountValue = parseFloat(globalDiscountPercent || "0");
      
      // Um cupom com desconto 0 é considerado válido mas sem efeito
      console.log("Cupom global encontrado:", globalCouponCode, "Desconto:", discountValue);
      setDiscount(discountValue);
      
      // Persistir informações para garantir consistência
      localStorage.setItem("appliedCoupon", normalizedCoupon);
      localStorage.setItem("discount", discountValue.toString());
      
      return { 
        valid: true, 
        discount: discountValue,
        isPersonal: false
      };
    }
    
    // Verificação antiga dos produtos (para compatibilidade)
    const allProducts = JSON.parse(localStorage.getItem("productList") || "[]");
    const productWithCoupon = allProducts.find((product: any) => 
      product.couponCode && 
      product.couponCode.toUpperCase() === normalizedCoupon
    );

    if (productWithCoupon) {
      const discountValue = productWithCoupon.discountPercent || 0;
      console.log("Cupom de produto encontrado:", productWithCoupon);
      setDiscount(discountValue);
      
      // Persistir informações para garantir consistência após atualização da página
      localStorage.setItem("appliedCoupon", normalizedCoupon);
      localStorage.setItem("discount", discountValue.toString());
      
      return { 
        valid: true, 
        discount: discountValue,
        isPersonal: false
      };
    }

    // Nenhum cupom válido encontrado
    console.log("Nenhum cupom válido encontrado para:", normalizedCoupon);
    return { valid: false, discount: 0 };
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        return prevCart.filter((item) => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    _setAppliedCoupon("");
    setDiscount(0);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateFinalTotal = () => {
    const total = calculateTotal();
    const discountAmount = total * (discount / 100);
    console.log("Calculando total final:", total, "Desconto:", discount, "Valor do desconto:", discountAmount);
    return total - discountAmount;
  };

  const setAppliedCoupon = (coupon: string) => {
    // Armazenar o cupom aplicado
    localStorage.setItem("appliedCoupon", coupon);
    _setAppliedCoupon(coupon);
    
    // Se estiver limpando o cupom, também limpa o desconto
    if (!coupon) {
      setDiscount(0);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      calculateTotal,
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
      calculateFinalTotal,
      validateCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
