import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Share2 } from "lucide-react";
import Header from "@/components/Header";
import { getProducts } from "@/data/products";
import { Product as ProductType } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";
import { Separator } from "@/components/ui/separator";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { colors } = useThemeColors();
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const buttonStyle = {
    backgroundColor: applyOpacity(colors.buttonBg, colors.buttonOpacity),
    borderColor: colors.buttonBg,
    color: '#ffffff'
  };

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Buscar produto pelo ID
    const productId = parseInt(id);
    const products = getProducts();
    const foundProduct = products.find(p => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
      setCurrentImage(foundProduct.image);
      document.title = `${foundProduct.name} - Loja Online`;
      
      // Adicionar meta tags para compartilhamento
      updateMetaTags(foundProduct);
    } else {
      navigate('/');
    }

    setLoading(false);
  }, [id, navigate]);
  
  // Função para selecionar uma imagem para exibir
  const handleSelectImage = (imgUrl: string) => {
    setCurrentImage(imgUrl);
  };

  // Função para atualizar meta tags
  const updateMetaTags = (product: ProductType) => {
    // Meta tags para Open Graph (Facebook)
    updateMetaTag('og:title', product.name);
    updateMetaTag('og:description', product.description);
    updateMetaTag('og:image', product.image);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'product');
    updateMetaTag('product:price:amount', product.price.toString());
    updateMetaTag('product:price:currency', 'BRL');
    
    // Meta tags para Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', product.name);
    updateMetaTag('twitter:description', product.description);
    updateMetaTag('twitter:image', product.image);
    
    // Meta tag para descrição geral
    updateMetaTag('description', product.description);
  };
  
  // Função utilitária para atualizar meta tags
  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[property="${name}"]`) || 
               document.querySelector(`meta[name="${name}"]`);
               
    if (!meta) {
      meta = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('product:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho.`,
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    if (!product) return;

    // Obter a URL específica do produto atual
    const productUrl = window.location.href;
    
    // Texto formatado com informações do produto
    const productText = `*${product.name}*\n💰 R$ ${product.price.toFixed(2)}\n\n${product.description}\n\nVeja mais detalhes do produto:\n${productUrl}`;
    
    // Dados para compartilhamento via Web Share API
    const shareData = {
      title: product.name,
      text: `${product.name} - R$ ${product.price.toFixed(2)}\n${product.description}`,
      url: productUrl,
    };

    try {
      // Verificar se a Web Share API está disponível
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Compartilhando",
          description: "Escolha como compartilhar este produto",
          duration: 2000,
        });
      } else {
        // Fallback específico para WhatsApp com mensagem mais detalhada
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(productText)}`;
        window.open(whatsappUrl, '_blank');
        toast({
          title: "Compartilhado",
          description: `${product.name} foi compartilhado via WhatsApp`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Verificar se o produto tem imagens adicionais
  const hasAdditionalImages = product.additionalImages && product.additionalImages.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <div className="rounded-lg overflow-hidden border mb-3">
              <img 
                src={currentImage || product.image} 
                alt={product.name} 
                className="w-full h-auto object-contain aspect-square"
              />
            </div>

            {/* Galeria de miniaturas */}
            {hasAdditionalImages && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {/* Miniatura da imagem principal */}
                <button 
                  onClick={() => handleSelectImage(product.image)}
                  className={`w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 transition-all ${
                    currentImage === product.image ? 'border-primary border-2' : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={product.image} 
                    alt={`${product.name} - Principal`}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Miniaturas das imagens adicionais */}
                {product.additionalImages.map((imgUrl, index) => (
                  <button 
                    key={index}
                    onClick={() => handleSelectImage(imgUrl)}
                    className={`w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      currentImage === imgUrl ? 'border-primary border-2' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-2xl font-bold mt-2" style={{ color: colors.primary }}>
              R$ {product.price.toFixed(2)}
            </p>
            
            <Separator className="my-4" />
            
            <div className="my-4">
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mt-auto space-y-4">
              <Button 
                className="w-full text-white"
                size="lg"
                onClick={handleAddToCart}
                style={buttonStyle}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="mr-2 h-4 w-4" /> Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product; 