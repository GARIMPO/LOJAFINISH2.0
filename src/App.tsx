import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { StoreInfoProvider } from "@/hooks/use-store-info";
import { ThemeColorsProvider } from "@/hooks/use-theme-colors";
import { CategoriesProvider } from "@/hooks/use-categories";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import EditCarousel from "./pages/admin/EditCarousel";
import EditProducts from "./pages/admin/EditProducts";
import EditCoupons from "./pages/admin/EditCoupons";
import EditStoreName from "./pages/admin/EditStoreName";
import EditWhatsApp from "./pages/admin/EditWhatsApp";
import EditTheme from "./pages/admin/EditTheme";
import EditSocialLinks from "./pages/admin/EditSocialLinks";
import Customers from "./pages/admin/Customers";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import CookiePolicy from "./pages/CookiePolicy";
import CookieBanner from "./components/CookieBanner";
import { ReactNode } from "react";

const queryClient = new QueryClient();

interface PrivateRouteProps {
  children: ReactNode;
}

// Componente para proteger rotas administrativas
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || 
                     sessionStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

  if (!isLoggedIn) {
    // Redireciona para o login se não estiver autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreInfoProvider>
        <ThemeColorsProvider>
          <CategoriesProvider>
            <CartProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/produto/:id" element={<Product />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/politica-cookies" element={<CookiePolicy />} />
                  <Route path="/admin" element={
                    <PrivateRoute>
                      <Admin />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/carrossel" element={
                    <PrivateRoute>
                      <EditCarousel />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/produtos" element={
                    <PrivateRoute>
                      <EditProducts />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/cupons" element={
                    <PrivateRoute>
                      <EditCoupons />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/nome-loja" element={
                    <PrivateRoute>
                      <EditStoreName />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/whatsapp" element={
                    <PrivateRoute>
                      <EditWhatsApp />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/tema" element={
                    <PrivateRoute>
                      <EditTheme />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/social" element={
                    <PrivateRoute>
                      <EditSocialLinks />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/clientes" element={
                    <PrivateRoute>
                      <Customers />
                    </PrivateRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <CookieBanner />
              </BrowserRouter>
            </CartProvider>
          </CategoriesProvider>
        </ThemeColorsProvider>
      </StoreInfoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
