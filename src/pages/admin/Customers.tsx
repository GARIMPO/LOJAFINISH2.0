import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Search, Trash2, User, Star, Ticket, Percent, X } from "lucide-react";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define the customer interface
interface Customer {
  id: string;
  name: string;
  phone: string;
  timestamp: number;
  rating: number; // 1-5 star rating
  couponCode?: string; // Código de cupom personalizado para o cliente
  discountPercent?: number; // Percentual de desconto do cupom
  isOneTimeUse?: boolean; // Indica se o cupom deve ser de uso único
}

// Star Rating component
interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating = ({ rating, onChange, readOnly = false }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} p-0.5`}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          disabled={readOnly}
        >
          <Star 
            size={18} 
            className={`${
              (hoverRating || rating) >= star 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

const Customers = () => {
  const navigate = useNavigate();
  const { colors } = useThemeColors();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "rating" | "coupon">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showActiveCouponsOnly, setShowActiveCouponsOnly] = useState(false);

  // Count active coupons
  const activeCouponsCount = customers.filter(customer => 
    customer.couponCode && customer.couponCode.trim() !== "" && customer.discountPercent > 0
  ).length;

  // Toggle sort order and field
  const handleSort = (field: "name" | "rating" | "coupon") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "name" ? "asc" : "desc"); // Default to ascending for name, descending for others
    }

    // If sorting by coupon and it's the first time, show active coupons only
    if (field === "coupon" && sortBy !== "coupon") {
      setShowActiveCouponsOnly(true);
    } else if (field !== "coupon") {
      setShowActiveCouponsOnly(false);
    }
  };

  // Sort customers based on current sort criteria and filter by active coupons if needed
  const sortCustomers = (customerList: Customer[]) => {
    let filteredList = customerList;
    
    // Filter by active coupons if needed
    if (showActiveCouponsOnly) {
      filteredList = customerList.filter(customer => 
        customer.couponCode && customer.couponCode.trim() !== "" && customer.discountPercent > 0
      );
    }
    
    return [...filteredList].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "rating") {
        return sortOrder === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else { // coupon
        // Sort by whether they have a coupon first
        const aHasCoupon = a.couponCode && a.couponCode.trim() !== "" && a.discountPercent > 0;
        const bHasCoupon = b.couponCode && b.couponCode.trim() !== "" && b.discountPercent > 0;
        
        if (aHasCoupon && !bHasCoupon) return sortOrder === "asc" ? 1 : -1;
        if (!aHasCoupon && bHasCoupon) return sortOrder === "asc" ? -1 : 1;
        
        // Then sort by discount percentage
        if (aHasCoupon && bHasCoupon) {
          return sortOrder === "asc"
            ? (a.discountPercent || 0) - (b.discountPercent || 0)
            : (b.discountPercent || 0) - (a.discountPercent || 0);
        }
        
        // Fall back to name if neither has coupon
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
  };

  // Load customers on component mount
  useEffect(() => {
    const loadCustomers = () => {
      const savedCustomers = localStorage.getItem("customerDatabase");
      if (savedCustomers) {
        try {
          const parsedCustomers = JSON.parse(savedCustomers);
          // Ensure all customers have rating, couponCode, discountPercent and isOneTimeUse properties
          const customersWithDefaults = parsedCustomers.map((customer: Customer) => ({
            ...customer,
            rating: customer.rating !== undefined ? customer.rating : 0,
            couponCode: customer.couponCode || "",
            discountPercent: customer.discountPercent !== undefined ? customer.discountPercent : 0,
            isOneTimeUse: customer.isOneTimeUse !== undefined ? customer.isOneTimeUse : true
          }));
          
          // Set customers with proper sorting
          setCustomers(customersWithDefaults);
          setFilteredCustomers(sortCustomers(customersWithDefaults));
          
          // Update localStorage with the properties added
          localStorage.setItem("customerDatabase", JSON.stringify(customersWithDefaults));
        } catch (error) {
          console.error("Error parsing saved customers:", error);
          setCustomers([]);
          setFilteredCustomers([]);
        }
      } else {
        setCustomers([]);
        setFilteredCustomers([]);
      }
    };

    loadCustomers();
  }, []);

  // Filter customers when search query or sort criteria changes
  useEffect(() => {
    let filtered = customers;
    
    if (searchQuery.trim() !== "") {
      filtered = customers.filter(
        customer => 
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          customer.phone.includes(searchQuery)
      );
    }
    
    setFilteredCustomers(sortCustomers(filtered));
  }, [searchQuery, customers, sortBy, sortOrder, showActiveCouponsOnly]);

  // Style objects
  const headerStyle = {
    backgroundColor: applyOpacity(colors.headerBg, colors.headerOpacity),
    color: colors.primary
  };

  const buttonStyle = {
    backgroundColor: applyOpacity(colors.buttonBg, colors.buttonOpacity),
    borderColor: colors.buttonBg,
    color: '#ffffff'
  };

  // Delete a customer
  const handleDeleteCustomer = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      setCustomers(updatedCustomers);
      localStorage.setItem("customerDatabase", JSON.stringify(updatedCustomers));
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido da base de dados.",
        duration: 3000,
      });
    }
  };

  // Format phone number for display
  const formatPhone = (phone: string) => {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Create WhatsApp link
  const createWhatsAppLink = (phone: string) => {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if the number has country code (Brazil default)
    const numberWithCountryCode = cleaned.startsWith('55') 
      ? cleaned 
      : `55${cleaned}`;
    
    return `https://wa.me/${numberWithCountryCode}`;
  };

  // Update customer rating
  const handleRatingChange = (id: string, newRating: number) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customer, rating: newRating } : customer
    );
    
    setCustomers(updatedCustomers);
    
    // Filter and sort customers
    let filtered = updatedCustomers;
    if (searchQuery.trim() !== "") {
      filtered = updatedCustomers.filter(
        customer => 
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          customer.phone.includes(searchQuery)
      );
    }
    setFilteredCustomers(sortCustomers(filtered));
    
    // Save to localStorage
    localStorage.setItem("customerDatabase", JSON.stringify(updatedCustomers));
    
    toast({
      title: "Classificação atualizada",
      description: `A classificação do cliente foi atualizada para ${newRating} estrelas.`,
      duration: 3000,
    });
  };

  // Update customer coupon code
  const handleCouponChange = (id: string, couponCode: string, discountPercent: number, isOneTimeUse: boolean = true) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { 
        ...customer, 
        couponCode: couponCode.trim(), 
        discountPercent: discountPercent,
        isOneTimeUse: isOneTimeUse
      } : customer
    );
    
    setCustomers(updatedCustomers);
    setFilteredCustomers(
      searchQuery.trim() === "" 
        ? sortCustomers(updatedCustomers) 
        : sortCustomers(updatedCustomers.filter(customer => 
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            customer.phone.includes(searchQuery)
          ))
    );
    
    // Save to localStorage
    localStorage.setItem("customerDatabase", JSON.stringify(updatedCustomers));
    
    const useTypeText = isOneTimeUse ? "uso único" : "múltiplos usos";
    
    toast({
      title: "Cupom atualizado",
      description: `O cupom "${couponCode}" com ${discountPercent}% de desconto (${useTypeText}) foi atribuído ao cliente.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 pt-24">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/admin')} 
            style={buttonStyle}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Clientes</h1>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 flex items-center">
              <div className="bg-blue-500 text-white p-3 rounded-full mr-4 flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Total de Clientes</p>
                <h3 className="text-2xl font-bold text-blue-900">{customers.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4 flex items-center">
              <div className="bg-green-500 text-white p-3 rounded-full mr-4 flex-shrink-0">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-green-700">Cupons Ativos</p>
                <h3 className="text-2xl font-bold text-green-900">{activeCouponsCount}</h3>
                <p className="text-xs text-green-600">{activeCouponsCount > 0 ? `${Math.round((activeCouponsCount / customers.length) * 100)}% dos clientes` : "Nenhum cupom ativo"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-100 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-amber-500 text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Média de Desconto</p>
                  <h3 className="text-2xl font-bold text-amber-900">
                    {customers.some(c => c.couponCode && c.discountPercent > 0)
                      ? `${Math.round(
                          customers
                            .filter(c => c.couponCode && c.discountPercent > 0)
                            .reduce((sum, c) => sum + (c.discountPercent || 0), 0) / 
                          customers.filter(c => c.couponCode && c.discountPercent > 0).length
                        )}%`
                      : "0%"
                    }
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Badge>{filteredCustomers.length} cliente(s) encontrado(s)</Badge>
                
                {sortBy === "coupon" && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${showActiveCouponsOnly ? '' : 'bg-muted'}`}
                      onClick={() => setShowActiveCouponsOnly(!showActiveCouponsOnly)}
                    >
                      {showActiveCouponsOnly 
                        ? <><Ticket className="h-3 w-3 mr-1" /> Mostrar todos</>
                        : <><Ticket className="h-3 w-3 mr-1" /> Apenas com cupons</>
                      }
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Lista de Clientes
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
              <span>Ordenar por:</span>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={sortBy === "name" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="h-8 px-2 text-xs"
                >
                  Nome
                  {sortBy === "name" && (
                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </Button>
                <Button 
                  variant={sortBy === "rating" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleSort("rating")}
                  className="h-8 px-2 text-xs flex items-center"
                >
                  Classificação
                  {sortBy === "rating" && (
                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </Button>
                <Button 
                  variant={sortBy === "coupon" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleSort("coupon")}
                  className="h-8 px-2 text-xs flex items-center relative"
                >
                  <Ticket className="h-3 w-3 mr-1" />
                  Cupons
                  {activeCouponsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                      {activeCouponsCount}
                    </Badge>
                  )}
                  {sortBy === "coupon" && (
                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length > 0 ? (
              <div className="grid gap-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className={`flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:bg-muted/30 transition-colors ${customer.couponCode ? 'border-l-4 border-l-green-500' : ''}`}>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center">
                          <h3 className="font-medium text-lg">{customer.name}</h3>
                          {customer.couponCode && (
                            <span className="ml-2 flex h-2 w-2 rounded-full bg-green-500"></span>
                          )}
                        </div>
                        <div className="flex items-center mt-1 md:mt-0">
                          <div className="relative group">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/75 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                              Classificação do cliente
                            </div>
                            <StarRating 
                              rating={customer.rating} 
                              onChange={(newRating) => handleRatingChange(customer.id, newRating)} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
                        <a 
                          href={createWhatsAppLink(customer.phone)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {formatPhone(customer.phone)}
                        </a>
                        
                        <span className="text-muted-foreground md:before:content-['•'] md:before:mx-2 md:before:text-muted-foreground/40">
                          {new Date(customer.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      
                      {customer.couponCode && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex items-center">
                            <Ticket className="h-3 w-3 mr-1" />
                            {customer.couponCode} ({customer.discountPercent}%)
                          </Badge>
                          {customer.isOneTimeUse !== false && (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                              Uso único
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3 md:mt-0 md:ml-4">
                      <Button
                        variant="outline" 
                        className="flex-1 md:flex-none text-blue-600 flex items-center gap-1"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setDialogOpen(true);
                        }}
                        title="Gerenciar cupom"
                      >
                        <Ticket className="h-4 w-4" />
                        <span className="md:hidden">Gerenciar cupom</span>
                      </Button>
                      <Button
                        variant="ghost" 
                        className="flex-1 md:flex-none text-destructive flex items-center gap-1"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        title="Excluir cliente"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="md:hidden">Excluir</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery 
                  ? "Nenhum cliente encontrado com essa busca." 
                  : showActiveCouponsOnly
                    ? "Nenhum cliente com cupom ativo no momento."
                    : "Nenhum cliente cadastrado ainda."}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Dialog para edição de cupom */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Cupom do Cliente</DialogTitle>
            <DialogDescription>
              Defina um código de cupom personalizado e o percentual de desconto para {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="coupon-code" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> Código do Cupom
                </Label>
                <Input
                  id="coupon-code"
                  placeholder="Ex: CLIENTE10"
                  defaultValue={selectedCustomer.couponCode || ""}
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount-percent" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" /> Percentual de Desconto
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="discount-percent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ex: 10"
                    defaultValue={selectedCustomer.discountPercent || ""}
                  />
                  <span>%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="one-time-use"
                  defaultChecked={selectedCustomer.isOneTimeUse !== false}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  onChange={(e) => {
                    // Atualizar a mensagem de nota quando o checkbox for alterado
                    const note = document.getElementById('coupon-usage-note');
                    if (note) {
                      note.textContent = e.target.checked 
                        ? " O cupom será automaticamente removido após ser utilizado."
                        : " O cupom poderá ser utilizado múltiplas vezes pelo cliente.";
                    }
                  }}
                />
                <Label htmlFor="one-time-use" className="text-sm font-medium cursor-pointer">
                  Cupom de uso único (será removido após utilização)
                </Label>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm">
                <p className="text-amber-800">
                  <strong>Nota:</strong> O cliente poderá usar este cupom durante o checkout para receber o desconto.
                  <span id="coupon-usage-note">
                    {" "}Se marcado como uso único, o cupom será automaticamente removido após ser utilizado.
                  </span>
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => {
                if (selectedCustomer) {
                  const couponCode = (document.getElementById('coupon-code') as HTMLInputElement).value;
                  const discountPercent = parseInt((document.getElementById('discount-percent') as HTMLInputElement).value || "0");
                  const isOneTimeUse = (document.getElementById('one-time-use') as HTMLInputElement).checked;
                  
                  if (!couponCode.trim()) {
                    // Se o código estiver vazio, remover o cupom
                    handleCouponChange(selectedCustomer.id, "", 0, true);
                  } else if (discountPercent <= 0 || discountPercent > 100) {
                    toast({
                      title: "Erro ao salvar cupom",
                      description: "O percentual de desconto deve estar entre 1% e 100%",
                      variant: "destructive",
                      duration: 3000,
                    });
                    return;
                  } else {
                    handleCouponChange(selectedCustomer.id, couponCode.toUpperCase(), discountPercent, isOneTimeUse);
                  }
                  
                  setDialogOpen(false);
                }
              }}
              className="w-full sm:w-auto"
            >
              Salvar Cupom
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedCustomer) {
                  handleCouponChange(selectedCustomer.id, "", 0, true);
                  setDialogOpen(false);
                  toast({
                    title: "Cupom excluído",
                    description: "O cupom do cliente foi removido com sucesso.",
                    duration: 3000,
                  });
                }
              }}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-1" /> Excluir Cupom
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers; 