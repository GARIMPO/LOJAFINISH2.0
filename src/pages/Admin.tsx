import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Edit, ImageIcon, ShoppingBag, Type, Phone, Paintbrush, Share2, Mail, PhoneCall, Users, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin - Loja Online";
  }, []);

  // Array de cards na ordem desejada
  const adminCards = [
    // 1. Editar Carrossel
    {
      icon: <ImageIcon className="h-5 w-5" />,
      title: "Editar Carrossel",
      description: "Gerencie as imagens e textos do carrossel da página inicial",
      path: "/admin/carrossel",
      buttonText: "Editar Carrossel"
    },
    // 2. Editar Produtos
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Editar Produtos",
      description: "Gerencie os produtos disponíveis na loja",
      path: "/admin/produtos",
      buttonText: "Editar Produtos"
    },
    // 3. Editar Nome da Loja
    {
      icon: <Type className="h-5 w-5" />,
      title: "Editar Nome da Loja",
      description: "Altere o nome da loja exibido no cabeçalho",
      path: "/admin/nome-loja",
      buttonText: "Editar Nome"
    },
    // 4. WhatsApp para Pedidos
    {
      icon: <Phone className="h-5 w-5" />,
      title: "WhatsApp para Pedidos",
      description: "Configure o número de WhatsApp para receber pedidos",
      path: "/admin/whatsapp",
      buttonText: "Editar WhatsApp"
    },
    // 5. Redes Sociais
    {
      icon: <Share2 className="h-5 w-5" />,
      title: "Redes Sociais",
      description: "Configure os links e ative/desative as redes sociais da loja",
      path: "/admin/social",
      buttonText: "Editar Links"
    },
    // 6. Cupons de Desconto
    {
      icon: <Ticket className="h-5 w-5" />,
      title: "Cupons de Desconto",
      description: "Gerencie os cupons de desconto para os produtos",
      path: "/admin/cupons",
      buttonText: "Gerenciar Cupons"
    },
    // 7. Clientes
    {
      icon: <Users className="h-5 w-5" />,
      title: "Clientes",
      description: "Visualize e gerencie clientes que fizeram pedidos na loja",
      path: "/admin/clientes",
      buttonText: "Ver Clientes"
    },
    // 8. Personalizar Cores
    {
      icon: <Paintbrush className="h-5 w-5" />,
      title: "Personalizar Cores",
      description: "Edite as cores e transparência do cabeçalho e cards de produtos",
      path: "/admin/tema",
      buttonText: "Editar Cores"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Área Admin</h1>
            <p className="text-muted-foreground">Configure sua loja online de forma simples e rápida.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card, index) => (
            <Card 
              key={card.path}
              className={`border border-blue-100 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md ${
                index % 2 === 0 
                  ? 'bg-white' 
                  : 'bg-blue-50'
              }`}
            >
              <CardHeader className="pb-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
                <CardTitle className="flex items-center gap-2 text-center justify-center mt-2">
                  <span className={`${index % 2 === 0 ? 'text-blue-600' : 'text-blue-700'}`}>
                    {card.icon}
                  </span>
                  <span className={`${index % 2 === 0 ? 'text-blue-800' : 'text-blue-900'}`}>
                    {card.title}
                  </span>
              </CardTitle>
                <CardDescription className="text-center mt-2 min-h-[40px] flex items-center justify-center">
                  {card.description}
              </CardDescription>
            </CardHeader>
              <CardContent className="pt-2 text-center pb-4">
                <Link to={card.path} className="block">
                  <Button 
                    className={`w-full font-medium ${index % 2 === 0 
                      ? 'hover:bg-blue-50 border-blue-200 text-blue-700' 
                      : 'hover:bg-blue-100 border-blue-300 bg-white text-blue-800'
                    }`} 
                    variant="outline"
                  >
                    <Edit className="mr-2 h-4 w-4" /> {card.buttonText}
                </Button>
              </Link>
            </CardContent>
          </Card>
          ))}
        </div>
        
        <div className="mt-12">
          <Separator className="mb-8" />
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 text-center">
            <h2 className="text-xl font-bold mb-4 text-blue-800">GARIMPO DE OFERTAS</h2>
          <div className="flex justify-center items-center flex-wrap gap-6 mt-2">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm">
                <PhoneCall className="h-5 w-5 text-blue-600" />
                <a href="https://wa.me/5519987156242" target="_blank" rel="noopener noreferrer" className="text-md hover:underline text-blue-800">
                (19) 9 8715-6242
              </a>
            </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm">
                <Mail className="h-5 w-5 text-blue-600" />
                <a href="mailto:garimpodeofertas2025@gmail.com" className="text-md hover:underline text-blue-800">
                garimpodeofertas2025@gmail.com
              </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
