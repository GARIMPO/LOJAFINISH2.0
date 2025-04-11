import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  // Ordenar produtos: promoções primeiro, depois por ID
  const sortedProducts = [...products].sort((a, b) => {
    // Se um é promoção e o outro não, o que é promoção vem primeiro
    if (a.isPromotion && !b.isPromotion) return -1;
    if (!a.isPromotion && b.isPromotion) return 1;
    
    // Se ambos são promoção ou ambos não são, ordenar por ID
    return a.id - b.id;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
