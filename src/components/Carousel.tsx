import { useState, useEffect, useRef, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
}

const Carousel = ({ images, autoPlayInterval = 5000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (transitioning) return;

    setTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    
    // Permitir nova transição após a animação terminar
    setTimeout(() => {
      setTransitioning(false);
    }, 600); // Um pouco mais que a duração da transição (500ms)
  };

  const prevSlide = () => {
    if (transitioning) return;

    setTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    // Permitir nova transição após a animação terminar
    setTimeout(() => {
      setTransitioning(false);
    }, 600); // Um pouco mais que a duração da transição (500ms)
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Reiniciar o timer quando o slide mudar manualmente
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);
  };

  // Lidar com gestos de toque/deslize
  const handleTouchStart = (e: TouchEvent) => {
    if (transitioning) return;
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (transitioning) return;
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (transitioning) return;
    
    const touchDiff = touchStartRef.current - touchEndRef.current;
    
    // Se o deslize for significativo (maior que 50px)
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Deslizou para a esquerda
        nextSlide();
      } else {
        // Deslizou para a direita
        prevSlide();
      }
    }
    
    // Reiniciar o timer após interação do usuário
    resetTimer();
  };

  // Configurar o carrossel automático
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlayInterval]);

  return (
    <div 
      className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex transition-transform duration-500 ease-out h-full will-change-transform"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          WebkitTransform: `translateX(-${currentIndex * 100}%)` 
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full w-full h-full flex-shrink-0 flex-grow-0 relative">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              style={{ 
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            />
            {(image.title || image.description) && (
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                {image.title && (
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{image.title}</h2>
                )}
                {image.description && (
                  <p className="text-sm md:text-base max-w-lg">{image.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apenas um indicador sutil de qual slide está ativo */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 opacity-70 ${
              currentIndex === index ? "bg-white" : "bg-white/30"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
