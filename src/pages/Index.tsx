import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Star, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vup-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center space-x-1">
            <span className="text-3xl font-black text-white tracking-tight">vite</span>
            <span className="text-3xl font-black text-vup-gold tracking-tight">un</span>
            <span className="text-3xl font-black text-white tracking-tight">prof</span>
          </div>
          
          <div className="space-x-3">
            <Link to="/login">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 rounded-xl px-6 py-2.5 font-medium transition-all duration-300"
              >
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-accent text-vup-navy hover:shadow-glow rounded-xl px-6 py-2.5 font-semibold transition-all duration-300 transform hover:scale-105">
                Commencer
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center text-white mb-24 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            Votre cours particulier,<br />
            <span className="text-transparent bg-gradient-accent bg-clip-text animate-glow">tout de suite</span>
            <span className="text-5xl md:text-6xl ml-4">✨</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
            Commander un cours particulier instantanément<br />
            n'a jamais été aussi simple qu'aujourd'hui
          </p>
          <Link to="/register">
            <Button className="bg-gradient-accent text-vup-navy text-lg px-12 py-6 rounded-2xl hover:shadow-glow font-semibold transition-all duration-500 transform hover:scale-110 shadow-large">
              Prendre un cours
            </Button>
          </Link>
        </div>

        {/* Key Features */}
        <div className="text-center mb-24 animate-slide-up">
          <div className="text-7xl md:text-9xl font-black text-transparent bg-gradient-accent bg-clip-text mb-6 animate-glow">
            30 secondes
          </div>
          <p className="text-xl md:text-2xl text-white/70 font-light">
            C'est le temps qu'il nous faut pour vous trouver un professeur
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <Card className="group bg-gradient-surface border-white/10 backdrop-blur-xl rounded-3xl hover:shadow-large transition-all duration-500 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-vup-navy" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instantané</h3>
              <p className="text-white/70 leading-relaxed">
                Trouvez un professeur disponible en moins de 30 secondes grâce à notre technologie
              </p>
            </CardContent>
          </Card>
          
          <Card className="group bg-gradient-surface border-white/10 backdrop-blur-xl rounded-3xl hover:shadow-large transition-all duration-500 transform hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-vup-navy" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Experts</h3>
              <p className="text-white/70 leading-relaxed">
                Professeurs issus des meilleures écoles et universités françaises
              </p>
            </CardContent>
          </Card>
          
          <Card className="group bg-gradient-surface border-white/10 backdrop-blur-xl rounded-3xl hover:shadow-large transition-all duration-500 transform hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-vup-navy" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Excellence</h3>
              <p className="text-white/70 leading-relaxed">
                Note moyenne de 4.9/5 sur plus de 15 000 cours dispensés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            Apprenez avec les <span className="text-transparent bg-gradient-accent bg-clip-text">meilleurs</span>
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Accédez en un instant aux meilleurs étudiants et professeurs pour être aidé(e) dans la matière de votre choix, partout en France.
          </p>
          <Link to="/register">
            <Button className="bg-gradient-accent text-vup-navy text-xl px-12 py-6 rounded-2xl hover:shadow-glow font-semibold transition-all duration-500 transform hover:scale-110 shadow-large group">
              <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
