import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import ProductGrid from "@/components/ProductGrid";
import { getProducts, getCarouselImages } from "@/data/products";
import { useStoreInfo } from "@/hooks/use-store-info";
import { SocialMediaIcons } from "@/components/SocialIcons";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Product } from "@/types";

const Index = () => {
  const { storeInfo } = useStoreInfo();
  const { colors } = useThemeColors();
  const products = getProducts();
  const carouselImages = getCarouselImages();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Extract unique categories from products
  const categories = ["Todas", ...Array.from(new Set(products.map(product => product.category || "Outros")))];

  // Aplicar cor de fundo personalizada
  const backgroundStyle = {
    backgroundColor: applyOpacity(colors.backgroundColor, colors.backgroundOpacity)
  };
  
  useEffect(() => {
    document.title = `${storeInfo.name} - Produtos de Tecnologia`;
  }, [storeInfo.name]);

  // Properly map image objects to the format expected by the Carousel component
  const carouselImagesWithTitles = carouselImages.map((image, index) => ({
    url: image.url,
    alt: image.alt,
    title: `Oferta Especial ${index + 1}`,
    description: "Aproveite nossas ofertas exclusivas com preços imperdíveis!"
  }));

  // Verificar se há pelo menos uma rede social ativa e com url
  const hasSocialMedia = Object.values(storeInfo.socials).some(
    (social) => social.enabled && social.url
  );

  // Filtrar produtos baseado no termo de busca e categoria selecionada
  useEffect(() => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== "Todas") {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow" style={backgroundStyle}>
        {/* Hero Carousel */}
        <section className="w-full">
          <Carousel images={carouselImagesWithTitles} />
        </section>
        
        {/* Store Info */}
        <section className="bg-secondary/20 py-6">
          <div className="container mx-auto px-4 text-center">
            <h1 
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ 
                color: colors.storeInfoTextColor,
                fontFamily: colors.storeInfoFontFamily,
                fontSize: `${colors.storeTitleFontSize || 32}px`
              }}
            >
              {colors.carouselTitle}
            </h1>
            
            {colors.showSubtitle && (
              <p 
                className="text-lg text-muted-foreground mb-4"
                style={{ 
                  color: colors.storeInfoTextColor,
                  fontFamily: colors.storeInfoFontFamily,
                  fontSize: `${colors.storeSubtitleFontSize || 18}px`
                }}
              >
                {colors.storeSubtitle}
              </p>
            )}
            
            {/* Logo da Loja */}
            {storeInfo.logoUrl && colors.showLogo && (
              <div className="flex justify-center my-4">
                <img 
                  src={storeInfo.logoUrl} 
                  alt={`Logo ${storeInfo.name}`} 
                  className="w-[230px] h-[230px] object-contain rounded-md"
                />
              </div>
            )}
            
            {/* Endereço e Telefone */}
            {(colors.showAddress || colors.showPhone) && (
              <p 
                style={{ 
                  color: colors.storeInfoTextColor,
                  fontFamily: colors.storeInfoFontFamily,
                  fontSize: `${Math.max(colors.storeInfoFontSize - 2, 12)}px` 
                }}
              >
                {colors.showPhone && storeInfo.phone}
                {colors.showPhone && colors.showAddress && " • "}
                {colors.showAddress && storeInfo.address}
              </p>
            )}
            
            {colors.showMapLink && colors.mapUrl && (
              <a 
                href={colors.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 underline"
                style={{ 
                  color: colors.primary,
                  fontFamily: colors.storeInfoFontFamily,
                  fontSize: `${Math.max(colors.storeInfoFontSize - 2, 12)}px` 
                }}
              >
                Ver loja no mapa
              </a>
            )}

            {/* Ícones de Redes Sociais */}
            {hasSocialMedia && (
              <div className="mt-3">
                <SocialMediaIcons socials={storeInfo.socials} />
              </div>
            )}
          </div>
        </section>
        
        {/* Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: colors.productsTitleColor }}
          >
            {colors.productsTitle}
          </h2>
          
          {/* Filtro por categoria */}
          <div className="max-w-md mx-auto mb-6">
            <h3 className="text-lg font-medium mb-2 text-center">Buscar produtos por categoria</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === "Todas" ? "" : category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    (category === "Todas" && selectedCategory === "") || 
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Campo de busca */}
          <div className="relative max-w-md mx-auto mb-8">
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
          
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedCategory 
                ? `Nenhum produto encontrado na categoria "${selectedCategory}"${searchTerm ? ` com o termo "${searchTerm}"` : ''}`
                : `Nenhum produto encontrado${searchTerm ? ` com o termo "${searchTerm}"` : ''}`
              }
            </div>
          )}
        </section>
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
    </div>
  );
};

export default Index;
