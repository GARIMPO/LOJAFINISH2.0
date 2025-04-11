import { Product } from "@/types";

// Default products data
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Smartphone Premium",
    description: "Smartphone de última geração com câmera de alta qualidade e desempenho excepcional.",
    price: 1999.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=500&fit=crop",
    additionalImages: [],
    isPromotion: true,
    couponCode: "",
    discountPercent: 0,
    category: "Smartphones"
  },
  {
    id: 2,
    name: "Notebook Ultrafino",
    description: "Notebook leve e potente para produtividade em qualquer lugar.",
    price: 3499.99,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=500&fit=crop",
    additionalImages: [],
    isPromotion: false,
    couponCode: "",
    discountPercent: 0,
    category: "Notebooks"
  },
  {
    id: 3,
    name: "Fones de Ouvido Bluetooth",
    description: "Fones com cancelamento de ruído e qualidade de som excepcional.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop",
    additionalImages: [],
    isPromotion: true,
    couponCode: "",
    discountPercent: 0,
    category: "Acessórios"
  },
  {
    id: 4,
    name: "Smartwatch Fitness",
    description: "Monitore sua saúde e atividades com este relógio inteligente resistente à água.",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=500&fit=crop",
    additionalImages: [],
    isPromotion: false,
    couponCode: "",
    discountPercent: 0,
    category: "Wearables"
  },
  {
    id: 5,
    name: "Tablet Profissional",
    description: "Tablet com tela de alta resolução ideal para designers e profissionais criativos.",
    price: 2799.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=500&fit=crop",
    additionalImages: [],
    isPromotion: false,
    couponCode: "",
    discountPercent: 0,
    category: "Tablets"
  },
  {
    id: 6,
    name: "Câmera Mirrorless 4K",
    description: "Captura imagens e vídeos em alta resolução com qualidade profissional.",
    price: 4299.99,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop",
    additionalImages: [],
    isPromotion: true,
    couponCode: "",
    discountPercent: 0,
    category: "Câmeras"
  }
];

// Default carousel images
const defaultCarouselImages = [
  {
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=500&fit=crop",
    alt: "Promoção de smartphones"
  },
  {
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=500&fit=crop",
    alt: "Lançamento de notebooks"
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=500&fit=crop",
    alt: "Fones de ouvido com desconto"
  }
];

// Load products from localStorage or use defaults
export const getProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('productList');
  return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
};

// Save products to localStorage
export const saveProducts = (products: Product[]): void => {
  localStorage.setItem('productList', JSON.stringify(products));
};

// Load carousel images from localStorage or use defaults
export const getCarouselImages = (): Array<{url: string, alt: string}> => {
  const savedImages = localStorage.getItem('carouselImages');
  return savedImages ? JSON.parse(savedImages) : defaultCarouselImages;
};

// Save carousel images to localStorage
export const saveCarouselImages = (images: Array<{url: string, alt: string, title?: string, description?: string}>): void => {
  localStorage.setItem('carouselImages', JSON.stringify(images));
};

// Export current data (initially loaded from localStorage or defaults)
export const products = getProducts();
export const carouselImages = getCarouselImages();
