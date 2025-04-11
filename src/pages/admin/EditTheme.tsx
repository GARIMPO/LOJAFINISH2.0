import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ArrowLeft, Save, Undo2, ShoppingCart, Paintbrush } from "lucide-react";
import { useThemeColors, applyOpacity } from "@/hooks/use-theme-colors";

// Sample product for preview
const previewProduct = {
  name: "Produto de Exemplo",
  price: 99.99,
  description: "Esta é uma demonstração de como o produto aparecerá na loja com as cores selecionadas."
};

const EditTheme = () => {
  const navigate = useNavigate();
  const { colors, updateColors, resetColors } = useThemeColors();
  const [localColors, setLocalColors] = useState({ ...colors });

  useEffect(() => {
    document.title = "Editar Tema - Admin";
  }, []);

  const handleColorChange = (field: string, value: string) => {
    setLocalColors(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpacityChange = (field: string, value: number[]) => {
    setLocalColors(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };

  const handleSave = () => {
    updateColors(localColors);
    toast.success("Tema atualizado com sucesso!");
    setTimeout(() => navigate("/admin"), 1500);
  };

  const handleReset = () => {
    resetColors();
    setLocalColors({
      primary: "#0070f3",
      headerBg: "#ffffff",
      headerOpacity: 100,
      cardBg: "#ffffff",
      cardOpacity: 100,
      buttonBg: "#0070f3",
      buttonOpacity: 100,
      backgroundColor: "#ffffff",
      backgroundOpacity: 100,
      storeInfoTextColor: "#333333",
      storeInfoFontFamily: "Inter, sans-serif",
      storeInfoFontSize: 16
    });
    toast.info("Cores restauradas aos valores padrão");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Cores do Tema</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Controls */}
          <Card>
            <CardHeader className="bg-muted p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Paintbrush className="h-5 w-5" />
                Configuração de Cores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label className="font-medium">Cor Principal</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="color"
                      value={localColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={localColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Cor do Cabeçalho</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="color"
                      value={localColors.headerBg}
                      onChange={(e) => handleColorChange('headerBg', e.target.value)}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={localColors.headerBg}
                      onChange={(e) => handleColorChange('headerBg', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-sm">Opacidade: {localColors.headerOpacity}%</Label>
                    <Slider
                      defaultValue={[localColors.headerOpacity]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleOpacityChange('headerOpacity', value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Cor do Card</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="color"
                      value={localColors.cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={localColors.cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-sm">Opacidade: {localColors.cardOpacity}%</Label>
                    <Slider
                      defaultValue={[localColors.cardOpacity]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleOpacityChange('cardOpacity', value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Cor do Botão</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="color"
                      value={localColors.buttonBg}
                      onChange={(e) => handleColorChange('buttonBg', e.target.value)}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={localColors.buttonBg}
                      onChange={(e) => handleColorChange('buttonBg', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-sm">Opacidade: {localColors.buttonOpacity}%</Label>
                    <Slider
                      defaultValue={[localColors.buttonOpacity]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleOpacityChange('buttonOpacity', value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Cor de Fundo da Página Principal</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="color"
                      value={localColors.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-16 h-8 p-1"
                    />
                    <Input
                      type="text"
                      value={localColors.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="mt-2">
                    <Label className="text-sm">Opacidade: {localColors.backgroundOpacity}%</Label>
                    <Slider
                      defaultValue={[localColors.backgroundOpacity]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleOpacityChange('backgroundOpacity', value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1" 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    <Undo2 className="mr-2 h-4 w-4" /> Restaurar Padrão
                  </Button>
                  <Button 
                    className="flex-1 bg-primary text-white" 
                    onClick={handleSave}
                  >
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-muted p-4">
                <CardTitle className="text-lg">Prévia</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Visualize como ficarão as cores da sua loja com as configurações atuais.
                </p>

                {/* Preview Header */}
                <div 
                  className="border rounded-md shadow-sm mb-6"
                  style={{ backgroundColor: applyOpacity(localColors.headerBg, localColors.headerOpacity) }}
                >
                  <div className="p-4 flex justify-between items-center">
                    <div className="font-bold">Logo da Loja</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <ShoppingCart className="h-4 w-4" style={{ color: localColors.primary }} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preview Product Card */}
                <div 
                  className="rounded-md overflow-hidden border shadow-sm"
                  style={{ backgroundColor: applyOpacity(localColors.cardBg, localColors.cardOpacity) }}
                >
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Imagem do Produto</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{previewProduct.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{previewProduct.description}</p>
                    <p className="mt-2 font-bold" style={{ color: localColors.primary }}>
                      R$ {previewProduct.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 pt-0">
                    <Button 
                      className="w-full text-white"
                      style={{ 
                        backgroundColor: applyOpacity(localColors.buttonBg, localColors.buttonOpacity),
                        borderColor: localColors.buttonBg
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Comprar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Default colors for reset
const defaultColors = {
  primary: "#0070f3",
  headerBg: "#ffffff",
  headerOpacity: 100,
  cardBg: "#ffffff",
  cardOpacity: 100,
  buttonBg: "#0070f3",
  buttonOpacity: 100,
  backgroundColor: "#ffffff",
  backgroundOpacity: 100,
  storeInfoTextColor: "#333333",
  storeInfoFontFamily: "Inter, sans-serif",
  storeInfoFontSize: 16
};

export default EditTheme; 