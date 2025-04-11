import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useThemeColors } from "@/hooks/use-theme-colors";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useThemeColors();

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted') === 'true';
    if (!hasAcceptedCookies) {
      // Mostrar o banner após um pequeno delay para melhorar UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookiesRejected', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Nós utilizamos cookies</h3>
            <p className="text-sm text-muted-foreground">
              Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com a nossa{' '}
              <Link to="/politica-cookies" className="underline font-medium" style={{ color: colors.primary }}>
                Política de Cookies
              </Link>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <Button variant="outline" onClick={handleReject} className="text-sm h-9">
              Rejeitar
            </Button>
            <Button 
              onClick={handleAccept} 
              className="text-sm h-9"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Aceitar
            </Button>
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute top-2 right-2 md:hidden p-1 rounded-full hover:bg-muted"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner; 