import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeColors = {
  primary: string;
  headerBg: string;
  headerOpacity: number;
  cardBg: string;
  cardOpacity: number;
  buttonBg: string;
  buttonOpacity: number;
  backgroundColor: string;
  backgroundOpacity: number;
  storeInfoTextColor: string;
  storeInfoFontFamily: string;
  storeInfoFontSize: number;
  storeTitleFontSize: number;
  storeSubtitleFontSize: number;
  storeSubtitle: string;
  carouselTitle: string;
  productsTitle: string;
  productsTitleColor: string;
  mapUrl: string;
  showMapLink: boolean;
  showLogo: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showSubtitle: boolean;
};

type ThemeColorsContextType = {
  colors: ThemeColors;
  updateColors: (newColors: Partial<ThemeColors>) => void;
  resetColors: () => void;
};

const defaultColors: ThemeColors = {
  primary: "#0070f3",
  headerBg: "#ffffff",
  headerOpacity: 100,
  cardBg: "#ffffff",
  cardOpacity: 100,
  buttonBg: "#0070f3",
  buttonOpacity: 100,
  backgroundColor: "#f5f5f5",
  backgroundOpacity: 100,
  storeInfoTextColor: "#333333",
  storeInfoFontFamily: "Inter, sans-serif",
  storeInfoFontSize: 16,
  storeTitleFontSize: 32,
  storeSubtitleFontSize: 18,
  storeSubtitle: "A melhor loja de tecnologia do Brasil",
  carouselTitle: "Loja Tecnológica",
  productsTitle: "Nossos Produtos",
  productsTitleColor: "#333333",
  mapUrl: "",
  showMapLink: false,
  showLogo: true,
  showAddress: true,
  showPhone: true,
  showSubtitle: true
};

const ThemeColorsContext = createContext<ThemeColorsContextType | undefined>(undefined);

export const ThemeColorsProvider = ({ children }: { children: ReactNode }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  // Load colors from localStorage on component mount
  useEffect(() => {
    const savedColors = localStorage.getItem('themeColors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  const updateColors = (newColors: Partial<ThemeColors>) => {
    setColors(prev => {
      const updatedColors = { ...prev, ...newColors };
      // Save to localStorage whenever it changes
      localStorage.setItem('themeColors', JSON.stringify(updatedColors));
      return updatedColors;
    });
  };

  const resetColors = () => {
    setColors(defaultColors);
    localStorage.setItem('themeColors', JSON.stringify(defaultColors));
  };

  return (
    <ThemeColorsContext.Provider value={{ colors, updateColors, resetColors }}>
      {children}
    </ThemeColorsContext.Provider>
  );
};

export function useThemeColors() {
  const context = useContext(ThemeColorsContext);
  if (context === undefined) {
    throw new Error("useThemeColors must be used within a ThemeColorsProvider");
  }
  return context;
}

// Helper function to apply opacity to color
export function applyOpacity(color: string, opacity: number): string {
  // Remove any existing opacity
  let hexColor = color.replace(/^#/, '');
  
  // Ensure we have a valid hex color
  if (hexColor.length === 3) {
    hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
  }
  
  // Calculate opacity value in hex
  const alpha = Math.round((opacity / 100) * 255).toString(16);
  const alphaHex = alpha.length === 1 ? '0' + alpha : alpha;
  
  return `#${hexColor}${alphaHex}`;
} 