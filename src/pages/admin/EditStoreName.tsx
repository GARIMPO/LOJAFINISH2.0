import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, ImageIcon, Upload, Type } from "lucide-react";
import { useStoreInfo } from "@/hooks/use-store-info";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Slider } from "@/components/ui/slider";

const EditStoreName = () => {
  const navigate = useNavigate();
  const { storeInfo, updateStoreInfo } = useStoreInfo();
  const { colors, updateColors } = useThemeColors();
  const [formData, setFormData] = useState({
    name: storeInfo.name,
    phone: storeInfo.phone,
    address: storeInfo.address,
    logoUrl: storeInfo.logoUrl
  });
  const [themeData, setThemeData] = useState({
    storeInfoTextColor: colors.storeInfoTextColor,
    storeInfoFontFamily: colors.storeInfoFontFamily,
    storeInfoFontSize: colors.storeInfoFontSize,
    storeTitleFontSize: colors.storeTitleFontSize || 32,
    storeSubtitleFontSize: colors.storeSubtitleFontSize || 18,
    storeSubtitle: colors.storeSubtitle || "A melhor loja de tecnologia do Brasil",
    carouselTitle: colors.carouselTitle || "Loja Tecnológica",
    productsTitle: colors.productsTitle,
    productsTitleColor: colors.productsTitleColor,
    mapUrl: colors.mapUrl || "",
    showMapLink: colors.showMapLink || false,
    showLogo: colors.showLogo !== undefined ? colors.showLogo : true,
    showAddress: colors.showAddress !== undefined ? colors.showAddress : true,
    showPhone: colors.showPhone !== undefined ? colors.showPhone : true,
    showSubtitle: colors.showSubtitle !== undefined ? colors.showSubtitle : true
  });
  const [previewImage, setPreviewImage] = useState<string | null>(storeInfo.logoUrl || null);

  useEffect(() => {
    setFormData({
      name: storeInfo.name,
      phone: storeInfo.phone,
      address: storeInfo.address,
      logoUrl: storeInfo.logoUrl
    });
    setPreviewImage(storeInfo.logoUrl || null);
    setThemeData({
      storeInfoTextColor: colors.storeInfoTextColor,
      storeInfoFontFamily: colors.storeInfoFontFamily,
      storeInfoFontSize: colors.storeInfoFontSize,
      storeTitleFontSize: colors.storeTitleFontSize || 32,
      storeSubtitleFontSize: colors.storeSubtitleFontSize || 18,
      storeSubtitle: colors.storeSubtitle || "A melhor loja de tecnologia do Brasil",
      carouselTitle: colors.carouselTitle || "Loja Tecnológica",
      productsTitle: colors.productsTitle,
      productsTitleColor: colors.productsTitleColor,
      mapUrl: colors.mapUrl || "",
      showMapLink: colors.showMapLink || false,
      showLogo: colors.showLogo !== undefined ? colors.showLogo : true,
      showAddress: colors.showAddress !== undefined ? colors.showAddress : true,
      showPhone: colors.showPhone !== undefined ? colors.showPhone : true,
      showSubtitle: colors.showSubtitle !== undefined ? colors.showSubtitle : true
    });
  }, [storeInfo, colors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('store-', '')]: value
    }));
  };

  const handleThemeChange = (field: string, value: string | number | boolean) => {
    setThemeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    // Limite de tamanho de 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande! O tamanho máximo é de 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageDataUrl = event.target.result as string;
        setPreviewImage(imageDataUrl);
        setFormData(prev => ({ ...prev, logoUrl: imageDataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateStoreInfo(formData);
    updateColors(themeData);
    toast.success("Informações da loja atualizadas com sucesso!");
    setTimeout(() => navigate("/admin"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Informações da Loja</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
          <CardHeader className="bg-muted p-4">
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
            <CardDescription>
              Edite o nome da loja, título do carrossel e outras informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="store-name">Nome da Loja</Label>
                <Input
                  id="store-name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este nome aparecerá no cabeçalho do site e nos rodapés
                </p>
              </div>
              
              <div>
                <Label htmlFor="carousel-title">Título Abaixo do Carrossel</Label>
                <Input
                  id="carousel-title"
                  value={themeData.carouselTitle}
                  onChange={(e) => handleThemeChange('carouselTitle', e.target.value)}
                  className="mt-1"
                  placeholder="Ex: Loja Tecnológica"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este título aparecerá logo abaixo do carrossel na página inicial
                </p>
              </div>
              
              <div>
                <Label htmlFor="store-subtitle">Subtítulo da Loja</Label>
                <Input
                  id="store-subtitle"
                  value={themeData.storeSubtitle}
                  onChange={(e) => handleThemeChange('storeSubtitle', e.target.value)}
                  className="mt-1"
                  placeholder="Ex: A melhor loja de tecnologia do Brasil"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este texto aparecerá abaixo do título na página inicial
                </p>
              </div>
              
              <div>
                <Label htmlFor="store-phone">Telefone</Label>
                <Input
                  id="store-phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="store-address">Endereço</Label>
                <Input
                  id="store-address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
                <div>
                  <Label htmlFor="store-map-url">Link do Mapa (Google Maps)</Label>
                  <Input
                    id="store-map-url"
                    value={themeData.mapUrl}
                    onChange={(e) => handleThemeChange('mapUrl', e.target.value)}
                    className="mt-1"
                    placeholder="https://maps.google.com/?q=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Cole o link do Google Maps para a localização da sua loja
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Configurações de Visibilidade</h3>
                  <div className="space-y-3 bg-muted/20 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-logo"
                        checked={themeData.showLogo}
                        onChange={(e) => handleThemeChange('showLogo', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="show-logo" className="text-sm cursor-pointer">
                        Exibir logo da loja na página inicial
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-subtitle"
                        checked={themeData.showSubtitle}
                        onChange={(e) => handleThemeChange('showSubtitle', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="show-subtitle" className="text-sm cursor-pointer">
                        Exibir subtítulo na página inicial
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-address"
                        checked={themeData.showAddress}
                        onChange={(e) => handleThemeChange('showAddress', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="show-address" className="text-sm cursor-pointer">
                        Exibir endereço na página inicial
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="show-phone"
                        checked={themeData.showPhone}
                        onChange={(e) => handleThemeChange('showPhone', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="show-phone" className="text-sm cursor-pointer">
                        Exibir telefone na página inicial
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-map-link"
                    checked={themeData.showMapLink}
                    onChange={(e) => handleThemeChange('showMapLink', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="show-map-link" className="text-sm cursor-pointer">
                    Mostrar link "Ver loja no mapa" na página inicial
                  </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo da Loja
              </CardTitle>
              <CardDescription>
                A logo será exibida abaixo do nome da loja na página principal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Upload da Logo</Label>
                  <div className="mt-1 flex items-center">
                    <label htmlFor="logo-upload" className="w-full cursor-pointer">
                      <div className="flex items-center justify-center w-full border-2 border-dashed border-muted-foreground/40 rounded-md py-3 px-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Escolher imagem</span>
                      </div>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    A imagem deve ter dimensões próximas a 230x230px para melhor visualização
                  </p>
                </div>
                
                <div className="mt-4">
                  <Label>Prévia da Logo</Label>
                  <div className="mt-2 flex justify-center p-4 bg-muted/30 rounded-md border">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Logo da loja" 
                        className="max-w-[230px] max-h-[230px] object-contain"
                      />
                    ) : (
                      <div className="w-[230px] h-[230px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-md">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Nenhuma logo definida
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Personalização da Aparência */}
        <Card className="mt-6 overflow-hidden">
          <CardHeader className="bg-muted p-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Type className="h-5 w-5" />
              Personalização das Informações
            </CardTitle>
            <CardDescription>
              Personalize a aparência das informações da sua loja na página principal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Informações da Loja</h3>
                  <div>
                    <Label className="font-medium">Cor do Texto</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="color"
                        value={themeData.storeInfoTextColor}
                        onChange={(e) => handleThemeChange('storeInfoTextColor', e.target.value)}
                        className="w-16 h-8 p-1"
                      />
                      <Input
                        type="text"
                        value={themeData.storeInfoTextColor}
                        onChange={(e) => handleThemeChange('storeInfoTextColor', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="font-medium">Tipo de Fonte</Label>
                    <select
                      value={themeData.storeInfoFontFamily}
                      onChange={(e) => handleThemeChange('storeInfoFontFamily', e.target.value)}
                      className="w-full mt-2 p-2 border rounded-md"
                    >
                      <option value="Inter, sans-serif">Inter (Padrão)</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                      <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                      <option value="'Segoe UI', sans-serif">Segoe UI</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="font-medium">Tamanho da Fonte do Título</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="number"
                        min={20}
                        max={48}
                        value={themeData.storeTitleFontSize}
                        onChange={(e) => handleThemeChange('storeTitleFontSize', parseInt(e.target.value) || 32)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">px</span>
                      <Slider
                        defaultValue={[themeData.storeTitleFontSize]}
                        min={20}
                        max={48}
                        step={1}
                        onValueChange={(value) => handleThemeChange('storeTitleFontSize', value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="font-medium">Tamanho da Fonte do Subtítulo</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="number"
                        min={14}
                        max={32}
                        value={themeData.storeSubtitleFontSize}
                        onChange={(e) => handleThemeChange('storeSubtitleFontSize', parseInt(e.target.value) || 18)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">px</span>
                      <Slider
                        defaultValue={[themeData.storeSubtitleFontSize]}
                        min={14}
                        max={32}
                        step={1}
                        onValueChange={(value) => handleThemeChange('storeSubtitleFontSize', value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="font-medium">Tamanho da Fonte para Informações</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="number"
                        min={12}
                        max={24}
                        value={themeData.storeInfoFontSize}
                        onChange={(e) => handleThemeChange('storeInfoFontSize', parseInt(e.target.value) || 16)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">px</span>
                      <Slider
                        defaultValue={[themeData.storeInfoFontSize]}
                        min={12}
                        max={24}
                        step={1}
                        onValueChange={(value) => handleThemeChange('storeInfoFontSize', value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Seção de Produtos</h3>
                  <div>
                    <Label className="font-medium">Título da Seção</Label>
                    <Input
                      value={themeData.productsTitle}
                      onChange={(e) => handleThemeChange('productsTitle', e.target.value)}
                      className="mt-2"
                      placeholder="Nossos Produtos"
                    />
                  </div>
                  
                  <div>
                    <Label className="font-medium">Cor do Título</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="color"
                        value={themeData.productsTitleColor}
                        onChange={(e) => handleThemeChange('productsTitleColor', e.target.value)}
                        className="w-16 h-8 p-1"
                      />
                      <Input
                        type="text"
                        value={themeData.productsTitleColor}
                        onChange={(e) => handleThemeChange('productsTitleColor', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-secondary/20">
                <h3 className="font-bold text-center mb-5">Prévia</h3>
                
                <div className="text-center mb-6">
                  <h2 
                    className="font-bold text-lg mb-1"
                    style={{ 
                      color: themeData.storeInfoTextColor,
                      fontFamily: themeData.storeInfoFontFamily,
                      fontSize: `${themeData.storeTitleFontSize}px`
                    }}
                  >
                    {themeData.carouselTitle}
                  </h2>
                  
                  {themeData.showSubtitle && (
                  <p 
                    className="mb-1"
                    style={{ 
                      color: themeData.storeInfoTextColor,
                      fontFamily: themeData.storeInfoFontFamily,
                      fontSize: `${themeData.storeSubtitleFontSize}px` 
                    }}
                  >
                    {themeData.storeSubtitle}
                  </p>
                  )}

                  {/* Prévia da Logo */}
                  {previewImage && themeData.showLogo && (
                    <div className="flex justify-center my-3">
                      <img 
                        src={previewImage} 
                        alt="Logo da loja" 
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Prévia de Endereço e Telefone */}
                  {(themeData.showAddress || themeData.showPhone) && (
                  <p 
                    style={{ 
                      color: themeData.storeInfoTextColor,
                      fontFamily: themeData.storeInfoFontFamily,
                      fontSize: `${themeData.storeInfoFontSize}px` 
                    }}
                  >
                      {themeData.showPhone && formData.phone}
                      {themeData.showPhone && themeData.showAddress && " • "}
                      {themeData.showAddress && formData.address}
                  </p>
                  )}
                  
                  {themeData.showMapLink && themeData.mapUrl && (
                    <p 
                      className="mt-1 underline cursor-pointer"
                      style={{ 
                        color: colors.primary,
                        fontFamily: themeData.storeInfoFontFamily,
                        fontSize: `${themeData.storeInfoFontSize}px` 
                      }}
                    >
                      Ver loja no mapa
                    </p>
                  )}
                </div>

                <Separator />

                <div className="text-center mt-6">
                  <h2 
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: themeData.productsTitleColor }}
                  >
                    {themeData.productsTitle}
                  </h2>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <Separator className="my-6" />
          <div className="flex justify-end">
            <Button className="bg-primary text-white" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditStoreName;
