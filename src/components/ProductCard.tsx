import { ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { colors } = useThemeColors();

  const cardStyle = {
    backgroundColor: applyOpacity(colors.cardBg, colors.cardOpacity),
    borderColor: applyOpacity(colors.cardBg, Math.min(colors.cardOpacity + 10, 100))
  };

  const buttonStyle = {
    backgroundColor: applyOpacity(colors.buttonBg, colors.buttonOpacity),
    borderColor: colors.buttonBg,
    color: '#ffffff'
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
      duration: 2000,
    });
  };

  const handleShare = async () => {
    // Obter a URL atual do site
    const baseUrl = window.location.origin;
    
    // Criar uma URL para o produto 
    const productUrl = `${baseUrl}/produto/${product.id}`;
    
    // Dados para compartilhamento
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
        // Fallback para navegadores que não suportam a Web Share API
        const fallbackUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${shareData.title} - R$ ${product.price.toFixed(2)}\n${shareData.text}\n${shareData.url}`
        )}`;
        window.open(fallbackUrl, '_blank');
        toast({
          title: "Compartilhado",
          description: `${product.name} foi compartilhado.`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-lg relative" style={cardStyle}>
      <div className="aspect-square overflow-hidden relative">
        <Link to={`/produto/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute bottom-2 right-2 rounded-full h-8 w-8 shadow-md"
          style={{backgroundColor: colors.primary, color: 'white'}}
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        
        {product.isPromotion && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md z-10 uppercase tracking-wider">
            Promoção
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <Link to={`/produto/${product.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 font-bold text-lg" style={{ color: colors.primary }}>
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full text-white"
          onClick={handleAddToCart}
          style={buttonStyle}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Comprar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
