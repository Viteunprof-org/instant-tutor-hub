import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Mail, Copy, Check, MessageCircle, CreditCard, UserMinus, BookOpen, HelpCircle, Clock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  icon: React.ReactNode;
  category: "cours" | "credits" | "compte";
}

const studentFAQItems: FAQItem[] = [
  {
    id: "demander-cours",
    question: "Comment demander un cours ?",
    answer: (
      <div className="space-y-2">
        <p>Pour demander un cours, assure-toi d’avoir des crédits disponibles sur ton compte.</p>
        <p>Depuis ton tableau de bord, clique sur « Demander un cours », choisis ta matière et ton niveau, puis valide.</p>
        <p>Un professeur disponible accepte ta demande et le cours démarre immédiatement.</p>
      </div>
    ),
    icon: <BookOpen className="h-5 w-5" />,
    category: "cours",
  },
  {
    id: "temps-attente",
    question: "Combien de temps dois-je attendre pour avoir un prof ?",
    answer:
      "En général, un professeur accepte ta demande en quelques minutes. Aux heures de pointe, c'est encore plus rapide ! Si aucun prof n'est disponible, tu seras notifié et tes crédits ne seront pas débités.",
    icon: <Clock className="h-5 w-5" />,
    category: "cours",
  },
  {
    id: "prix-cours",
    question: "Combien coûte un cours ?",
    answer:
      "Les cours sont facturés à la minute : 1 minute = 1 crédit. Le prix d’un crédit varie entre 0,36 € et 0,49 € selon le pack choisi. Un cours d’une heure correspond donc à 60 crédits.",
    icon: <Coins className="h-5 w-5" />,
    category: "credits",
  },
  {
    id: "acheter-credits",
    question: "Comment acheter des crédits ?",
    answer:
      "Depuis ton tableau de bord, clique sur « Recharger mes crédits » ou bien « Voir tous les packs » . Choisis ton pack, applique ton code promo si tu en as un, puis paie par carte bancaire de manière sécurisée. Les crédits sont disponibles immédiatement.",
    icon: <CreditCard className="h-5 w-5" />,
    category: "credits",
  },
  {
    id: "credits-non-visibles",
    question: "J’ai acheté des crédits mais je ne les vois pas",
    answer:
      "Commence par actualiser la page de ton tableau de bord. Si tes crédits n’apparaissent toujours pas après quelques instants, contacte-nous et on réglera ça rapidement.",
    icon: <Coins className="h-5 w-5" />,
    category: "credits",
  },
  {
    id: "remboursement",
    question: "Puis-je me faire rembourser mes crédits ?",
    answer:
      "Les crédits achetés ne sont pas remboursables. Cependant, si tu rencontres un problème avec un cours (professeur absent, problème technique), contacte-nous et on créditera ton compte.",
    icon: <CreditCard className="h-5 w-5" />,
    category: "credits",
  },
  {
    id: "debit-credits",
    question: "Quand mes crédits sont-ils débités ?",
    answer:
      "Tes crédits sont débités uniquement à la fin du cours, en fonction de la durée réelle. Si le cours n’a pas lieu ou si aucun professeur ne se connecte, aucun crédit ne sera débité.",
    icon: <Clock className="h-5 w-5" />,
    category: "credits",
  },
  {
    id: "probleme-cours",
    question: "Que faire si j'ai un problème pendant un cours ?",
    answer: (
      <div className="space-y-2">
        <p>En cas de problème technique ou de souci avec un professeur, contacte-nous immédiatement par email.</p>
        <p>Décris la situation et on intervient rapidement pour t'aider. Si le cours n'a pas pu avoir lieu, on recrédite ton compte.</p>
      </div>
    ),
    icon: <HelpCircle className="h-5 w-5" />,
    category: "cours",
  },
  {
    id: "desinscription",
    question: "Comment supprimer mon compte ?",
    answer:
      "Pour supprimer ton compte ViteUnProf, envoie-nous un email avec ta demande. On traite ta demande sous 48h. Note que les crédits restants ne pourront pas être remboursés.",
    icon: <UserMinus className="h-5 w-5" />,
    category: "compte",
  },
  {
    id: "changer-email",
    question: "Comment modifier mes informations personnelles ?",
    answer:
      "Pour modifier ton email ou tes informations personnelles, envoie-nous un email en précisant les changements souhaités. On met à jour ton profil rapidement.",
    icon: <UserMinus className="h-5 w-5" />,
    category: "compte",
  },
];

export default function StudentFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@viteunprof.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const categories = [
    { key: "cours", label: "Les cours", color: "bg-blue-100 text-blue-700" },
    { key: "credits", label: "Crédits & Paiement", color: "bg-green-100 text-green-700" },
    { key: "compte", label: "Mon compte", color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* En-tête */}
        <div className="mb-8">
          <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions fréquentes</h1>
          <p className="text-gray-600">Tout ce que tu dois savoir pour bien utiliser ViteUnProf.</p>
        </div>

        {/* Questions par catégorie */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.key}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>{category.label}</span>
              </h2>

              <div className="space-y-3">
                {studentFAQItems
                  .filter((item) => item.category === category.key)
                  .map((item) => (
                    <Card key={item.id} className={`overflow-hidden transition-all ${openItems.includes(item.id) ? "ring-2 ring-blue-200" : ""}`}>
                      <button onClick={() => toggleItem(item.id)} className="w-full text-left">
                        <CardHeader className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{item.icon}</div>
                              <CardTitle className="text-base font-medium">{item.question}</CardTitle>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-400 transition-transform ${openItems.includes(item.id) ? "rotate-180" : ""}`}
                            />
                          </div>
                        </CardHeader>
                      </button>

                      {openItems.includes(item.id) && (
                        <CardContent className="pt-0 pb-4">
                          <div className="pl-12 text-gray-600 text-sm leading-relaxed">{item.answer}</div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <Card className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tu n'as pas trouvé ta réponse ?</h3>
                <p className="text-gray-600 mt-1">Pas de souci, écris-nous et on te répond rapidement !</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <a
                  href="mailto:contact@viteunprof.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  contact@viteunprof.com
                </a>
                <Button variant="outline" size="icon" onClick={handleCopyEmail} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {copied && <p className="text-sm text-green-600">Email copié !</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
