import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, ImageIcon } from "lucide-react";
import { getCarouselImages, saveCarouselImages } from "@/data/products";

interface CarouselImage {
  id: number;
  url: string;
  title: string;
  description: string;
}

const EditCarousel = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<CarouselImage[]>([]);

  const cardStyles = [
    { backgroundColor: "#ffffff" },  // branco
    { backgroundColor: "#f5f5f5" }   // cinza claro
  ];

  // Load carousel images on component mount
  useEffect(() => {
    const carouselImages = getCarouselImages();
    setImages(
      carouselImages.map((image, index) => ({
        id: index + 1,
        url: image.url,
        title: `Título do Slide ${index + 1}`,
        description: `Descrição do slide ${index + 1}. Adicione texto promocional aqui.`
      }))
    );
  }, []);

  const handleImageChange = (id: number, field: string, value: string) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.match('image.*')) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    // Limite de tamanho de 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande! O tamanho máximo é de 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageDataUrl = event.target.result as string;
        
        setImages(images.map(img => 
          img.id === id ? { ...img, url: imageDataUrl } : img
        ));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Transform the images data to the format expected by saveCarouselImages
    const formattedImages = images.map(img => ({
      url: img.url,
      alt: `Slide ${img.id}`,
      title: img.title,
      description: img.description
    }));
    
    saveCarouselImages(formattedImages);
    toast.success("Alterações no carrossel salvas com sucesso!");
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
          <h1 className="text-2xl font-bold">Editar Carrossel</h1>
        </div>
        
        <div className="space-y-6">
          {images.map((image, index) => (
            <Card 
              key={image.id} 
              className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
              style={cardStyles[index % 2]}
            >
              <CardHeader className="p-4" style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#f0f0f0' }}>
                <CardTitle className="text-lg">Slide {image.id}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <Label htmlFor={`image-upload-${image.id}`}>Imagem do Slide</Label>
                      <div className="mt-1 flex items-center">
                        <label htmlFor={`image-upload-${image.id}`} className="w-full cursor-pointer">
                          <div className="flex items-center justify-center w-full border-2 border-dashed border-muted-foreground/40 rounded-md py-3 px-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Escolher imagem</span>
                          </div>
                          <Input
                            id={`image-upload-${image.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(image.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Imagens para o carrossel devem ter proporção 16:9 para melhor visualização
                      </p>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`title-${image.id}`}>Título</Label>
                      <Input
                        id={`title-${image.id}`}
                        value={image.title}
                        onChange={(e) => handleImageChange(image.id, 'title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor={`desc-${image.id}`}>Descrição</Label>
                      <Textarea
                        id={`desc-${image.id}`}
                        value={image.description}
                        onChange={(e) => handleImageChange(image.id, 'description', e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex-1 bg-muted rounded-lg p-4">
                      {image.url ? (
                        <div className="relative h-48 rounded-md overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={`Preview ${image.id}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                            <h3 className="font-bold">{image.title}</h3>
                            <p className="text-sm line-clamp-2">{image.description}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-48 bg-secondary rounded-md">
                          <p className="text-muted-foreground">Prévia da imagem</p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Prévia de como o slide ficará no carrossel 1200x400pixels
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
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

export default EditCarousel;
