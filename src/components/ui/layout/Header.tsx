import { useState } from "react";
import { LogOut, User, Coins, HelpCircle, Mail, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export interface HeaderProps {
  isAvailable?: boolean;
  onAvailabilityChange?: (available: boolean) => void;
  isVerified?: boolean;
}

export function Header({ isAvailable, onAvailabilityChange, isVerified = true }: HeaderProps = {}) {
  const { user, logout } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@viteunprof.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const faqPath = user?.type === "teacher" ? "/teacher/faq" : "/student/faq";

  return (
    <>
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <img src="/logo.svg" className="w-48" />
              </div>
            </Link>

            {user && (
              <div className="flex items-center space-x-4">
                {/* Affichage des crédits pour les élèves */}
                {user.type === "student" && (
                  <div className="flex items-center space-x-2 bg-vup-yellow/10 text-vup-navy px-3 py-1 rounded-full border border-vup-yellow/20">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">{(user?.creditBalance || 0) + (user?.freeCreditBalance || 0)} crédits</span>
                  </div>
                )}

                <span className="text-sm text-vup-gray">{user.type === "student" ? "Élève" : "Professeur"}</span>

                {/* Bouton Aide */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200"
                        onClick={() => setHelpOpen(true)}
                      >
                        <HelpCircle className="h-6 w-6 text-blue-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aide</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-base">
                          {user.firstName[0].toUpperCase()}
                          {user.lastName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal d'aide */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Besoin d'aide ?
            </DialogTitle>
            <DialogDescription>Tu as un problème ou une question ? N'hésite pas à nous contacter !</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Contact email */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <p className="text-sm text-gray-700">Contacte-nous par email, on te répond rapidement :</p>
              <div className="flex items-center gap-2">
                <a
                  href="mailto:contact@viteunprof.com"
                  className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">contact@viteunprof.com</span>
                </a>
                <Button variant="outline" size="icon" onClick={handleCopyEmail} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && <p className="text-xs text-green-600">Email copié !</p>}
            </div>

            {/* Lien FAQ */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">Tu trouveras peut-être ta réponse dans notre FAQ :</p>
              <Link
                to={faqPath}
                onClick={() => setHelpOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Consulter la FAQ</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
