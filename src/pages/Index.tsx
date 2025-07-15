import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Star, Zap, Play, CheckCircle, BookOpen } from 'lucide-react';

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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Votre cours particulier,<br />
              <span className="text-vup-yellow">tout de suite 🚀</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Commander un cours particulier instantanément<br />
              n'a jamais été aussi simple !
            </p>
            <Link to="/register">
              <Button className="bg-vup-yellow text-vup-navy text-lg px-8 py-4 rounded-lg hover:bg-vup-yellow/90 transform hover:scale-105 transition-all">
                Prendre un cours
              </Button>
            </Link>
          </div>
          
          {/* Mobile App Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-vup-navy to-primary rounded-2xl h-full p-4 text-white">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <span className="text-lg font-bold">vite</span>
                      <span className="text-lg font-bold text-vup-yellow">un</span>
                      <span className="text-lg font-bold">prof</span>
                    </div>
                    <p className="text-sm opacity-80">Bienvenue Max 👋</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm">
                      <p className="font-semibold mb-2">1. Choisis ta matière 📚</p>
                      <div className="flex gap-2">
                        <div className="bg-green-500 px-3 py-1 rounded-full text-xs">Mathématiques</div>
                        <div className="bg-blue-500 px-3 py-1 rounded-full text-xs">Français</div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-semibold mb-2">2. Choisis la durée ⏰</p>
                      <div className="flex gap-2">
                        <div className="bg-orange-500 px-3 py-1 rounded-full text-xs">20 min</div>
                        <div className="bg-orange-500 px-3 py-1 rounded-full text-xs">40 min</div>
                        <div className="bg-vup-yellow text-vup-navy px-3 py-1 rounded-full text-xs">60 min</div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-semibold mb-2">3. Décris le sujet du cours 📝</p>
                      <div className="bg-white/10 rounded-lg p-2 text-xs">
                        Je suis bloqué sur mes DM de mathématiques...
                      </div>
                    </div>
                    
                    <Button className="w-full bg-vup-yellow text-vup-navy hover:bg-vup-yellow/90">
                      Trouve-moi un prof !
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 30 seconds section */}
        <div className="text-center mb-20">
          <div className="text-6xl md:text-8xl font-bold text-vup-yellow mb-4">
            30 secondes.
          </div>
          <p className="text-xl md:text-2xl text-white">
            C'est le temps qu'il nous faut pour vous trouver un professeur.
          </p>
        </div>

        {/* Apprenez avec les meilleurs */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Apprenez avec les meilleurs
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Accédez en un instant aux meilleurs étudiants et professeurs pour être aidé(e) dans la matière de votre choix.
          </p>
          <p className="text-md text-gray-300 mb-12 max-w-2xl mx-auto">
            Nos professeurs sont issus des plus grandes écoles d'ingénieurs et de commerce et des universités les plus prestigieuses.
          </p>
          
          <Link to="/register" className="inline-block mb-16">
            <Button className="bg-vup-yellow text-vup-navy text-lg px-8 py-4 rounded-lg hover:bg-vup-yellow/90 transform hover:scale-105 transition-all">
              Prendre un cours
            </Button>
          </Link>

          {/* Logos des écoles */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-70">
            <div className="bg-white rounded-lg p-4 h-16 flex items-center justify-center">
              <span className="text-vup-navy font-bold text-sm">Centrale</span>
            </div>
            <div className="bg-white rounded-lg p-4 h-16 flex items-center justify-center">
              <span className="text-vup-navy font-bold text-sm">ENSTA</span>
            </div>
            <div className="bg-white rounded-lg p-4 h-16 flex items-center justify-center">
              <span className="text-vup-navy font-bold text-sm">Audencia</span>
            </div>
            <div className="bg-white rounded-lg p-4 h-16 flex items-center justify-center">
              <span className="text-vup-navy font-bold text-sm">Polytechnique</span>
            </div>
            <div className="bg-white rounded-lg p-4 h-16 flex items-center justify-center">
              <span className="text-vup-navy font-bold text-sm">ESSEC</span>
            </div>
            <div className="bg-white rounded-lg p-4 h-16 flex items-center justify-center">
              <span className="text-vup-navy font-bold text-sm">Sorbonne</span>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-vup-yellow text-center mb-16">
            Prendre un cours particulier n'a jamais été aussi simple 📲
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="bg-vup-yellow text-vup-navy w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Choisissez</h3>
              <p className="text-gray-200 mb-6">
                Votre matière, la durée du cours et une photo du problème.
              </p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-vup-yellow mx-auto mb-2" />
                <p className="text-sm text-gray-300">Interface simple et intuitive</p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="bg-vup-yellow text-vup-navy w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Patientez</h3>
              <p className="text-gray-200 mb-6">
                Maximum 10 minutes, le temps que votre professeur se connecte.
              </p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Clock className="h-12 w-12 text-vup-yellow mx-auto mb-2" />
                <p className="text-sm text-vup-yellow font-semibold">Temps d'attente moyen de 30 secondes ⚡️</p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="bg-vup-yellow text-vup-navy w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Apprenez</h3>
              <p className="text-gray-200 mb-6">
                Votre cours peut commencer, demandez tout ce que vous voulez à notre super enseignant.
              </p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Play className="h-12 w-12 text-vup-yellow mx-auto mb-2" />
                <p className="text-sm text-gray-300">Cours en visioconférence HD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Large choix de matières */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Un large choix de matières
          </h2>
          <p className="text-xl text-gray-200 text-center mb-16">
            Trouvez de l'aide instantanément et commencez enfin à progresser 📈
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Maths', color: 'bg-blue-500' },
              { name: 'SVT', color: 'bg-green-500' },
              { name: 'Physique-Chimie', color: 'bg-purple-500' },
              { name: 'Économie', color: 'bg-orange-500' },
              { name: 'Histoire-Géo', color: 'bg-red-500' },
              { name: 'Droit', color: 'bg-indigo-500' },
              { name: 'Informatique', color: 'bg-cyan-500' },
              { name: 'Technologie', color: 'bg-pink-500' },
              { name: 'Anglais', color: 'bg-yellow-500' },
              { name: 'Français', color: 'bg-teal-500' },
              { name: 'Philosophie', color: 'bg-violet-500' },
              { name: 'Espagnol', color: 'bg-emerald-500' }
            ].map((subject, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${subject.color} rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white font-medium text-sm">{subject.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Commandez votre cours dès maintenant !
          </h2>
          <Link to="/register">
            <Button className="bg-vup-yellow text-vup-navy text-lg px-12 py-6 rounded-lg hover:bg-vup-yellow/90 transform hover:scale-105 transition-all">
              C'est parti !
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
