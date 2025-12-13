import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Mail, Copy, Check, MessageCircle, CreditCard, UserMinus, Bell, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  icon: React.ReactNode;
  category: "cours" | "paiement" | "compte";
}

const teacherFAQItems: FAQItem[] = [
  {
    id: "tarif",
    question: "Combien suis-je payé par heure de cours ?",
    answer: "Tu es rémunéré 15€ par heure de cours donnée. Ce montant est crédité sur ton solde après chaque cours validé.",
    icon: <CreditCard className="h-5 w-5" />,
    category: "paiement",
  },
  {
    id: "cashout",
    question: "Comment puis-je retirer mon argent ?",
    answer: (
      <div className="space-y-2">
        <p>Pour retirer ton argent, envoie-nous un email avec les documents suivants :</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Ton RIB</li>
          <li>Une copie de ta pièce d'identité</li>
          <li>Un justificatif de domicile récent</li>
        </ul>
        <p>On traite ta demande et on t'envoie une confirmation par mail dans les plus brefs délais.</p>
        <p className="text-blue-600 font-medium mt-3">
          🚀 Bonne nouvelle : bientôt, tu pourras retirer ton argent en un clic directement depuis ton tableau de bord !
        </p>
      </div>
    ),
    icon: <CreditCard className="h-5 w-5" />,
    category: "paiement",
  },
  {
    id: "prendre-cours",
    question: "Comment ça marche pour prendre un cours ?",
    answer: (
      <div className="space-y-2">
        <p>C'est simple ! Dès qu'un élève demande un cours dans l'une de tes matières, tu reçois une notification WhatsApp instantanée.</p>
        <p>
          <strong>Le premier prof qui se connecte et accepte le cours le remporte.</strong> Sois réactif pour maximiser tes chances !
        </p>
        <p className="text-amber-600 mt-2">💡 Astuce : garde les notifications WhatsApp activées et reste disponible aux heures de forte demande.</p>
      </div>
    ),
    icon: <BookOpen className="h-5 w-5" />,
    category: "cours",
  },
  {
    id: "modifier-matieres",
    question: "Comment ajouter ou retirer des matières de mon profil ?",
    answer:
      "Pour modifier tes matières ou niveaux enseignés, envoie-nous simplement un email en précisant les changements que tu souhaites effectuer. On met à jour ton profil rapidement.",
    icon: <BookOpen className="h-5 w-5" />,
    category: "compte",
  },
  {
    id: "notifications",
    question: "Comment désactiver les notifications WhatsApp ?",
    answer:
      "Si tu souhaites ne plus recevoir de notifications WhatsApp (temporairement ou définitivement), envoie-nous un email. On désactivera les alertes pour ton compte.",
    icon: <Bell className="h-5 w-5" />,
    category: "compte",
  },
  {
    id: "desinscription",
    question: "Comment supprimer mon compte de la plateforme ?",
    answer:
      "Pour te désinscrire de ViteUnProf, envoie-nous un email avec ta demande de suppression de compte. On traite ta demande sous 48h et on te confirme la suppression par email.",
    icon: <UserMinus className="h-5 w-5" />,
    category: "compte",
  },
  {
    id: "probleme-cours",
    question: "Que faire si j'ai un problème pendant un cours ?",
    answer: (
      <div className="space-y-2">
        <p>En cas de problème technique ou de souci avec un élève, contacte-nous immédiatement par email.</p>
        <p>Décris la situation et on intervient rapidement pour t'aider à résoudre le problème.</p>
      </div>
    ),
    icon: <HelpCircle className="h-5 w-5" />,
    category: "cours",
  },
  {
    id: "paiement-delai",
    question: "Quand mon solde est-il crédité après un cours ?",
    answer:
      "Ton solde est mis à jour automatiquement à la fin de chaque cours validé. Tu peux consulter ton historique et ton solde actuel depuis ton tableau de bord.",
    icon: <CreditCard className="h-5 w-5" />,
    category: "paiement",
  },
];

export default function TeacherFAQ() {
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
    { key: "paiement", label: "Paiement & Rémunération", color: "bg-green-100 text-green-700" },
    { key: "compte", label: "Mon compte", color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* En-tête */}
        <div className="mb-8">
          <Link to="/teacher/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions fréquentes</h1>
          <p className="text-gray-600">Tout ce que tu dois savoir pour bien utiliser ViteUnProf en tant que professeur.</p>
        </div>

        {/* Questions par catégorie */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.key}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>{category.label}</span>
              </h2>

              <div className="space-y-3">
                {teacherFAQItems
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
