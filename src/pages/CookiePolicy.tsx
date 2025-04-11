import { useEffect } from "react";
import Header from "@/components/Header";
import { useStoreInfo } from "@/hooks/use-store-info";
import { useThemeColors } from "@/hooks/use-theme-colors";

const CookiePolicy = () => {
  const { storeInfo } = useStoreInfo();
  const { colors } = useThemeColors();
  
  useEffect(() => {
    document.title = `Política de Cookies | ${storeInfo.name}`;
    // Rolar para o topo quando a página carregar
    window.scrollTo(0, 0);
  }, [storeInfo.name]);
  
  const currentYear = new Date().getFullYear();
  const lastUpdate = "01/06/2024";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.primary }}>Política de Cookies</h1>
        
        <div className="prose prose-sm md:prose-base max-w-none">
          <p>
            <strong>Última atualização:</strong> {lastUpdate}
          </p>
          
          <h2>1. O que são cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet, smartphone) 
            quando você navega em nosso site. Esses arquivos contêm informações que permitem que o site lembre de suas ações, 
            preferências e configurações, melhorando sua experiência e tornando suas próximas visitas mais eficientes.
          </p>
          
          <h2>2. Quais tipos de cookies utilizamos?</h2>
          <p>Utilizamos os seguintes tipos de cookies em nosso site:</p>
          
          <h3>2.1. Cookies Essenciais</h3>
          <p>
            São cookies necessários para o funcionamento básico do site. Eles permitem que você navegue pelo site e utilize 
            recursos essenciais, como áreas seguras, carrinho de compras e configurações de privacidade. Sem esses cookies, o site não 
            funcionaria corretamente.
          </p>
          
          <h3>2.2. Cookies de Preferências</h3>
          <p>
            Estes cookies permitem que o site lembre de informações que mudam a aparência ou o comportamento do site, como seu 
            idioma preferido ou a região em que você está. Eles ajudam a melhorar sua experiência, mas não são essenciais para o 
            funcionamento do site.
          </p>
          
          <h3>2.3. Cookies Analíticos</h3>
          <p>
            Usamos esses cookies para coletar informações sobre como você utiliza nosso site, incluindo as páginas que visita com 
            mais frequência e se você recebe mensagens de erro. Todos os dados coletados são anônimos e ajudam a melhorar o 
            desempenho do site.
          </p>
          
          <h3>2.4. Cookies de Marketing</h3>
          <p>
            Estes cookies são utilizados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes e envolventes 
            para o usuário individual, tornando-os mais valiosos para editores e anunciantes terceiros.
          </p>
          
          <h2>3. Como gerenciar os cookies?</h2>
          <p>
            Você pode gerenciar os cookies através das configurações do seu navegador. Os métodos para gerenciar cookies variam 
            de navegador para navegador, por isso, consulte o menu de ajuda do seu navegador para instruções específicas.
          </p>
          <p>
            Ao desativar os cookies, algumas funcionalidades do nosso site podem não estar disponíveis, o que afetará sua 
            experiência de navegação.
          </p>
          
          <h2>4. Cookies de terceiros</h2>
          <p>
            Nosso site pode utilizar serviços de terceiros que também utilizam cookies, como Google Analytics, Facebook Pixel, 
            entre outros. Esses serviços coletam informações sobre sua navegação em nosso site e em outros sites da internet.
          </p>
          <p>
            Não temos controle sobre os cookies de terceiros. Para obter mais informações sobre como esses serviços utilizam 
            cookies, consulte as políticas de privacidade deles.
          </p>
          
          <h2>5. Por quanto tempo os cookies permanecem no meu dispositivo?</h2>
          <p>
            Os cookies podem permanecer no seu dispositivo por diferentes períodos de tempo:
          </p>
          <ul>
            <li>
              <strong>Cookies de Sessão:</strong> Estes cookies são temporários e expiram quando você fecha o navegador.
            </li>
            <li>
              <strong>Cookies Persistentes:</strong> Estes cookies permanecem no seu dispositivo até que expirem ou até que 
              sejam excluídos manualmente.
            </li>
          </ul>
          
          <h2>6. Alterações na Política de Cookies</h2>
          <p>
            Reservamos o direito de modificar esta política de cookies a qualquer momento. Recomendamos que você revise 
            esta página regularmente para estar ciente de quaisquer alterações. Alterações significativas serão notificadas 
            por meio de um aviso em nosso site.
          </p>
          
          <p className="mt-8">
            <em>
              Esta Política de Cookies foi atualizada pela última vez em {lastUpdate} e aplica-se ao site {storeInfo.name}.
            </em>
          </p>
          <p>
            <em>
              &copy; {currentYear} {storeInfo.name}. Todos os direitos reservados.
            </em>
          </p>
        </div>
      </main>
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} {storeInfo.name} feito por{" "}
            <a 
              href="https://garimpodeofertas.com.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              Garimpo de ofertas
            </a>
            . Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CookiePolicy; 