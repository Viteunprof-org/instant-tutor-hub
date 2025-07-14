import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Star, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vup-navy via-primary to-vup-navy">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-white">vite</span>
            <span className="text-2xl font-bold text-vup-yellow">un</span>
            <span className="text-2xl font-bold text-white">prof</span>
          </div>
          
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-vup-navy">
                Se connecter
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90">
                Commencer
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Votre cours particulier,<br />
            <span className="text-vup-yellow">tout de suite 🚀</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Commander un cours particulier instantanément<br />
            n'a jamais été aussi simple !
          </p>
          <Link to="/register">
            <Button className="bg-vup-yellow text-vup-navy text-lg px-8 py-6 rounded-full hover:bg-vup-yellow/90 transform hover:scale-105 transition-all">
              Prendre un cours
            </Button>
          </Link>
        </div>

        {/* Key Features */}
        <div className="text-center mb-16">
          <div className="text-6xl md:text-8xl font-bold text-vup-yellow mb-4">
            30 secondes.
          </div>
          <p className="text-xl text-gray-200">
            C'est le temps qu'il nous faut pour vous trouver un professeur.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-vup-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Instantané</h3>
              <p className="text-gray-200">
                Trouvez un professeur disponible en moins de 30 secondes
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-vup-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Experts</h3>
              <p className="text-gray-200">
                Professeurs issus des meilleures écoles et universités
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-vup-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Qualité</h3>
              <p className="text-gray-200">
                Note moyenne de 4.9/5 sur plus de 10 000 cours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Apprenez avec les meilleurs
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Accédez en un instant aux meilleurs étudiants et professeurs pour être aidé(e) dans la matière de votre choix.
          </p>
          <Link to="/register">
            <Button className="bg-vup-yellow text-vup-navy text-lg px-8 py-4 rounded-full hover:bg-vup-yellow/90 transform hover:scale-105 transition-all">
              <Zap className="mr-2 h-5 w-5" />
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
