import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Save, Trash2, Upload, ImageIcon, X, Loader2, SearchIcon, Tag } from "lucide-react";
import { getProducts } from "@/data/products";
import { Product } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useCategories } from "@/hooks/use-categories";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface para controlar o estado de upload
interface UploadState {
  [key: string]: {
    isUploading: boolean;
    progress: number;
    size: number;
  };
}

const EditProducts = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<Product[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({});
  const { colors } = useThemeColors();
  const { categories, addCategory, deleteCategory, updateCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);

  // Load products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const savedProducts = localStorage.getItem("productList");
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          setProductList(parsedProducts);
        } catch (error) {
          console.error("Error parsing saved products:", error);
          setProductList(getProducts());
        }
      } else {
        setProductList(getProducts());
      }
    };

    fetchProducts();
  }, []);

  // Filtrar produtos baseado no termo de busca
  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyles = [
    { backgroundColor: "#ffffff" },  // branco
    { backgroundColor: "#f5f5f5" }   // cinza claro
  ];

  const handleProductChange = (id: number, field: string, value: string | number | boolean) => {
    setProductList(productList.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    try {
      addCategory(newCategoryName.trim());
      toast({
        title: "Categoria adicionada",
        description: `A categoria "${newCategoryName}" foi adicionada com sucesso.`,
        duration: 2000,
      });
      setNewCategoryName("");
      setShowAddCategoryDialog(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEditCategory = () => {
    if (!editCategoryName.trim() || !editCategoryId) {
      toast({
        title: "Erro",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    try {
      updateCategory(editCategoryId, editCategoryName.trim());
      
      // Update category in all products that use it
      const categoryToUpdate = categories.find(cat => cat.id === editCategoryId);
      if (categoryToUpdate) {
        const updatedProducts = productList.map(product => {
          if (product.category === categoryToUpdate.name) {
            return { ...product, category: editCategoryName.trim() };
          }
          return product;
        });
        setProductList(updatedProducts);
        localStorage.setItem('productList', JSON.stringify(updatedProducts));
      }
      
      toast({
        title: "Categoria atualizada",
        description: `A categoria foi atualizada com sucesso.`,
        duration: 2000,
      });
      setEditCategoryId(null);
      setEditCategoryName("");
      setShowEditCategoryDialog(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCategoryClick = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (!categoryToDelete) return;
    
    // Confirmar exclusão
    if(confirm(`Deseja realmente excluir a categoria "${categoryToDelete.name}"? 
Produtos desta categoria serão movidos para "Outros".`)) {
      deleteCategory(id);
      toast({
        title: "Categoria excluída",
        description: `A categoria "${categoryToDelete.name}" foi excluída com sucesso.`,
        duration: 2000,
      });
    }
  };

  const startEditCategory = (id: string) => {
    const categoryToEdit = categories.find(cat => cat.id === id);
    if (categoryToEdit) {
      setEditCategoryId(id);
      setEditCategoryName(categoryToEdit.name);
      setShowEditCategoryDialog(true);
    }
  };

  const handleImageUpload = async (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive",
      });
      return;
    }

    // Limite de tamanho de 2MB (reduzido de 5MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "A imagem deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Verificar espaço disponível no localStorage
    const currentStorage = localStorage.getItem("productList");
    const currentSize = currentStorage ? currentStorage.length : 0;
    const estimatedNewSize = currentSize + file.size;
    
    // Limite de 4MB para todos os dados
    if (estimatedNewSize > 4 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Limite de armazenamento atingido. Remova alguns produtos ou use imagens menores.",
        variant: "destructive",
      });
      return;
    }

    // Iniciar o estado de upload
    const uploadId = `main-${id}`;
    setUploadState(prev => ({
      ...prev,
      [uploadId]: {
        isUploading: true,
        progress: 0,
        size: file.size
      }
    }));

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadState(prev => ({
          ...prev,
          [uploadId]: {
            ...prev[uploadId],
            progress
          }
        }));
      }
    };
    
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const imageDataUrl = reader.result as string;
        
        // Comprimir a imagem
        const compressedImage = await compressImage(imageDataUrl);
        
        setTimeout(() => {
          setProductList(productList.map(product => 
            product.id === id ? { ...product, image: compressedImage } : product
          ));
          
          setUploadState(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              isUploading: false,
              progress: 100
            }
          }));
        }, 500);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro ao carregar imagem",
        description: "Ocorreu um erro ao carregar a imagem. Tente novamente.",
        variant: "destructive",
      });
      setUploadState(prev => {
        const newState = {...prev};
        delete newState[uploadId];
        return newState;
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Função para comprimir imagem
  const compressImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular novas dimensões mantendo a proporção
        let width = img.width;
        let height = img.height;
        const maxSize = 800; // Tamanho máximo para largura ou altura
        
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Comprimir com qualidade 0.7
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    });
  };

  // Função para upload de imagens adicionais
  const handleAdditionalImageUpload = async (id: number, index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive",
      });
      return;
    }

    // Limite de tamanho de 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "A imagem deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Verificar espaço disponível no localStorage
    const currentStorage = localStorage.getItem("productList");
    const currentSize = currentStorage ? currentStorage.length : 0;
    const estimatedNewSize = currentSize + file.size;
    
    // Limite de 4MB para todos os dados
    if (estimatedNewSize > 4 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Limite de armazenamento atingido. Remova alguns produtos ou use imagens menores.",
        variant: "destructive",
      });
      return;
    }

    // Iniciar o estado de upload
    const uploadId = `additional-${id}-${index}`;
    setUploadState(prev => ({
      ...prev,
      [uploadId]: {
        isUploading: true,
        progress: 0,
        size: file.size
      }
    }));

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadState(prev => ({
          ...prev,
          [uploadId]: {
            ...prev[uploadId],
            progress
          }
        }));
      }
    };
    
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const imageDataUrl = reader.result as string;
        
        // Comprimir a imagem
        const compressedImage = await compressImage(imageDataUrl);
        
        setTimeout(() => {
          setProductList(productList.map(product => {
            if (product.id === id) {
              const additionalImages = [...product.additionalImages];
              additionalImages[index] = compressedImage;
              return { ...product, additionalImages };
            }
            return product;
          }));
          
          setUploadState(prev => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              isUploading: false,
              progress: 100
            }
          }));
        }, 500);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro ao carregar imagem",
        description: "Ocorreu um erro ao carregar a imagem adicional. Tente novamente.",
        variant: "destructive",
      });
      setUploadState(prev => {
        const newState = {...prev};
        delete newState[uploadId];
        return newState;
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Função para remover uma imagem adicional
  const handleRemoveAdditionalImage = (id: number, index: number) => {
    setProductList(productList.map(product => {
      if (product.id === id) {
        const additionalImages = [...product.additionalImages];
        additionalImages.splice(index, 1);
        return { ...product, additionalImages };
      }
      return product;
    }));
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = productList.filter(product => product.id !== id);
    setProductList(updatedProducts);
    localStorage.setItem('productList', JSON.stringify(updatedProducts));
    
    toast({
      title: "Produto excluído",
      description: "O produto foi excluído com sucesso!",
      duration: 2000,
    });
  };

  const handleAddProduct = () => {
    // Verificar limite de produtos
    if (productList.length >= 20) {
      toast({
        title: "Limite atingido",
        description: "Você pode adicionar no máximo 20 produtos.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: "Novo Produto",
      description: "Descrição do produto",
      price: 0,
      image: "",
      additionalImages: [],
      isPromotion: false,
      couponCode: "",
      discountPercent: 0,
      category: categories.length > 0 ? categories[0].name : undefined
    };
    setProductList([newProduct, ...productList]);
  };

  const handleSave = () => {
    try {
      // Manter os cupons existentes nos produtos quando salvar
      const savedProducts = localStorage.getItem("productList");
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          // Criar um mapa de IDs para cupons existentes
          const productCoupons = new Map();
          parsedProducts.forEach((product: any) => {
            if (product.couponCode && product.discountPercent) {
              productCoupons.set(product.id, {
                couponCode: product.couponCode,
                discountPercent: product.discountPercent
              });
            }
          });
          
          // Aplicar os cupons existentes aos produtos atualizados
          const updatedProducts = productList.map(product => {
            const existingCoupon = productCoupons.get(product.id);
            if (existingCoupon) {
              return {
                ...product,
                couponCode: existingCoupon.couponCode,
                discountPercent: existingCoupon.discountPercent
              };
            }
            return product;
          });
          
          localStorage.setItem('productList', JSON.stringify(updatedProducts));
        } catch (error) {
          console.error('Erro ao manter cupons existentes:', error);
          localStorage.setItem('productList', JSON.stringify(productList));
        }
      } else {
        localStorage.setItem('productList', JSON.stringify(productList));
      }
      
      toast({
        title: "Produtos salvos",
        description: "Produtos salvos com sucesso!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produtos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Função para formatar o tamanho em KB ou MB
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Renderização dos componentes
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Editar Produtos</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleAddProduct}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
            <Button 
              onClick={handleSave}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </div>
        </div>

        {/* Gerenciamento de Categorias */}
        <Card className="mb-6">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Gerenciar Categorias</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Limpar categorias do localStorage
                    localStorage.removeItem("productCategories");
                    // Recarregar a página para aplicar as categorias padrão
                    window.location.reload();
                  }}
                >
                  Redefinir Categorias
                </Button>
                <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Criar Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="new-category-name">Nome da Categoria</Label>
                      <Input 
                        id="new-category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ex: Eletrônicos, Roupas, etc."
                        className="mt-1"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddCategoryDialog(false)}>Cancelar</Button>
                      <Button onClick={handleAddNewCategory}>Adicionar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma categoria disponível. Adicione sua primeira categoria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex items-center p-2 bg-secondary/10 rounded-md"
                  >
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="mr-2">{category.name}</span>
                    <div className="flex gap-1 ml-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => startEditCategory(category.id)}
                        title="Editar categoria"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive/80"
                        onClick={() => handleDeleteCategoryClick(category.id)}
                        title="Excluir categoria"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo para editar categoria */}
        <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="edit-category-name">Nome da Categoria</Label>
              <Input 
                id="edit-category-name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditCategoryDialog(false)}>Cancelar</Button>
              <Button onClick={handleEditCategory}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Campo de busca */}
        <div className="relative max-w-md mb-8">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon size={18} />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        <div className="space-y-6">
          {filteredProducts.map((product, index) => {
            const mainUploadId = `main-${product.id}`;
            const isMainUploading = uploadState[mainUploadId]?.isUploading;
            const mainProgress = uploadState[mainUploadId]?.progress || 0;
            const mainSize = uploadState[mainUploadId]?.size || 0;
            
            return (
              <Card 
                key={product.id} 
                className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow" 
                style={cardStyles[index % 2]}
              >
                <CardHeader className="p-3 sm:p-4 flex flex-row items-center justify-between" style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#f0f0f0' }}>
                <CardTitle className="text-base sm:text-lg">
                  {product.name !== "Novo Produto" 
                    ? product.name 
                    : `Produto ${String(product.id).slice(-5)}`
                  }
                </CardTitle>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <div className="mb-3 sm:mb-4">
                      <Label htmlFor={`name-${product.id}`}>Nome do Produto</Label>
                      <Input
                        id={`name-${product.id}`}
                        value={product.name}
                        onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    {/* Seção de Categoria */}
                    <div className="mb-3 sm:mb-4">
                      <Label htmlFor={`category-${product.id}`}>Categoria</Label>
                      <Select
                        value={product.category || ""}
                        onValueChange={(value) => handleProductChange(product.id, 'category', value)}
                      >
                        <SelectTrigger id={`category-${product.id}`} className="mt-1">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mb-3 sm:mb-4">
                      <Label htmlFor={`desc-${product.id}`}>Descrição</Label>
                      <Textarea
                        id={`desc-${product.id}`}
                        value={product.description}
                        onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <Label htmlFor={`price-${product.id}`}>Preço (R$)</Label>
                      <Input
                        id={`price-${product.id}`}
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="mb-3 sm:mb-4 flex items-center justify-between">
                      <Label htmlFor={`promotion-${product.id}`} className="cursor-pointer">
                        Mostrar como promoção?
                      </Label>
                      <Switch
                        id={`promotion-${product.id}`}
                        checked={product.isPromotion}
                        onCheckedChange={(checked) => handleProductChange(product.id, 'isPromotion', checked)}
                      />
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <Label htmlFor={`image-${product.id}`}>Imagem Principal</Label>
                      <div className="mt-1">
                        <Input
                          id={`image-${product.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(product.id, e)}
                          disabled={isMainUploading}
                          className="hidden"
                        />
                        <label 
                          htmlFor={`image-${product.id}`}
                          className={`flex items-center justify-center h-10 border-2 border-dashed border-muted-foreground/30 rounded-md cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors ${isMainUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {isMainUploading ? (
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              <span>Enviando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              <span>Selecionar imagem</span>
                            </div>
                          )}
                        </label>
                      </div>
                      {isMainUploading && (
                        <div className="mt-1">
                          <Progress value={mainProgress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {mainProgress}% - {formatFileSize(mainSize)}
                          </p>
                        </div>
                      )}
                      {!isMainUploading && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selecione uma imagem (máx. 2MB)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="bg-muted rounded-lg p-3 sm:p-4 flex-1">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-36 sm:h-48 object-contain rounded-md"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-36 sm:h-48 bg-secondary/20 rounded-md">
                          <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground">Nenhuma imagem selecionada</p>
                        </div>
                      )}
                    </div>

                    {/* Seção de Imagens Adicionais */}
                    <div className="bg-muted/40 rounded-lg p-3 sm:p-4">
                      <Label className="mb-2 block text-sm">Imagens Adicionais (até 3)</Label>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {product.additionalImages.map((imgUrl, imgIndex) => (
                          <div key={imgIndex} className="relative group rounded-md overflow-hidden border border-muted">
                            <img 
                              src={imgUrl} 
                              alt={`${product.name} - Imagem ${imgIndex + 1}`}
                              className="w-full h-16 sm:h-20 object-cover"
                            />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveAdditionalImage(product.id, imgIndex)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        {Array.from({ length: 3 - product.additionalImages.length }).map((_, emptyIndex) => {
                          const imgIndex = product.additionalImages.length + emptyIndex;
                          const uploadId = `additional-${product.id}-${imgIndex}`;
                          const isUploading = uploadState[uploadId]?.isUploading;
                          const progress = uploadState[uploadId]?.progress || 0;
                          const size = uploadState[uploadId]?.size || 0;
                          
                          return (
                            <div key={`empty-${emptyIndex}`} className="flex flex-col">
                              <label 
                                htmlFor={`additional-image-${product.id}-${imgIndex}`}
                                className={`flex flex-col items-center justify-center h-16 sm:h-20 border-2 border-dashed border-muted-foreground/30 rounded-md cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                              >
                                {isUploading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mb-1 text-primary animate-spin" />
                                    <span className="text-xs text-muted-foreground/70">{progress}%</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mb-1 text-muted-foreground/70" />
                                    <span className="text-xs text-muted-foreground/70">Adicionar</span>
                                  </>
                                )}
                                <Input
                                  id={`additional-image-${product.id}-${imgIndex}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleAdditionalImageUpload(product.id, imgIndex, e)}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                              </label>
                              {isUploading && (
                                <div className="mt-1">
                                  <Progress value={progress} className="h-1" />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatFileSize(size)}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Até 3 imagens secundárias (máx. 2MB cada)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default EditProducts;
