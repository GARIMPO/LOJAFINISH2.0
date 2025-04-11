import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { LogIn, Mail, KeyRound, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useStoreInfo } from "@/hooks/use-store-info";

const Login = () => {
  const navigate = useNavigate();
  const { colors } = useThemeColors();
  const { storeInfo } = useStoreInfo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    
    // Simulação de login
    setIsLoading(true);
    
    // Aqui seria feita a validação com o backend
    setTimeout(() => {
      setIsLoading(false);
      
      // Apenas o superadministrador tem acesso
      const validCredentials = [
        { email: "marcos.rherculano@gmail.com", password: "#Markinhos1986" }
      ];
      
      // Verificar se as credenciais são válidas
      const isValidCredential = validCredentials.some(
        cred => cred.email === email && cred.password === password
      );
      
      if (isValidCredential) {
        // Salvar informações do login se "lembrar de mim" estiver marcado
        if (rememberMe) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
        } else {
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userEmail", email);
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para a área administrativa",
          duration: 3000,
        });
        
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        setError("Email ou senha incorretos");
      }
    }, 1500);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Por favor, informe seu email");
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de envio de email para recuperação de senha
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para recuperar sua senha",
        duration: 3000,
      });
      setIsPasswordResetMode(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <LogIn className="h-6 w-6" style={{ color: colors.primary }} />
              {isPasswordResetMode ? "Recuperar Senha" : "Entrar"}
            </CardTitle>
            <CardDescription>
              {isPasswordResetMode 
                ? "Informe seu email para receber instruções de recuperação de senha" 
                : "Faça login para acessar a área administrativa"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={isPasswordResetMode ? handlePasswordReset : handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {!isPasswordResetMode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {!isPasswordResetMode && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">
                        Lembrar de mim
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPasswordResetMode(true)}
                      className="text-sm font-medium text-primary hover:underline"
                      disabled={isLoading}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isPasswordResetMode ? "Enviando..." : "Entrando..."}
                    </>
                  ) : (
                    <>{isPasswordResetMode ? "Enviar email de recuperação" : "Entrar"}</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            {isPasswordResetMode && (
              <Button
                variant="outline"
                onClick={() => setIsPasswordResetMode(false)}
                className="w-full"
                disabled={isLoading}
              >
                Voltar para o login
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {storeInfo.name} feito por{" "}
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

export default Login; 