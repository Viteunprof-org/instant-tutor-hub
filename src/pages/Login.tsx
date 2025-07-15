import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password, userType);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur ViteUnProf !",
      });
      navigate(userType === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vup-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <Card className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-gradient-surface border-white/10 rounded-3xl shadow-large">
        <CardHeader className="space-y-6 p-8">
          <div className="flex items-center justify-center space-x-1 mb-6">
            <span className="text-3xl font-black text-vup-navy tracking-tight">vite</span>
            <span className="text-3xl font-black text-vup-gold tracking-tight">un</span>
            <span className="text-3xl font-black text-vup-navy tracking-tight">prof</span>
          </div>
          <CardTitle className="text-3xl text-center font-black text-foreground">Connexion</CardTitle>
          <CardDescription className="text-center text-lg text-muted-foreground font-light">
            Accédez à votre espace personnel
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs value={userType} onValueChange={(value) => setUserType(value as 'student' | 'teacher')}>
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1 border border-white/10">
              <TabsTrigger value="student" className="rounded-xl font-medium">Élève</TabsTrigger>
              <TabsTrigger value="teacher" className="rounded-xl font-medium">Professeur</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-6 mt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-vup-gold/50 focus:ring-vup-gold/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-foreground font-medium">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-foreground focus:border-vup-gold/50 focus:ring-vup-gold/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-accent text-vup-navy hover:shadow-glow font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se connecter comme élève
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="teacher" className="space-y-6 mt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-vup-gold/50 focus:ring-vup-gold/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-foreground font-medium">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-foreground focus:border-vup-gold/50 focus:ring-vup-gold/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-vup-navy text-white hover:bg-vup-navy/90 font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se connecter comme professeur
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-vup-gold hover:text-vup-gold/80 font-medium transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}