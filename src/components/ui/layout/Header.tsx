import { LogOut, User, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export interface HeaderProps {
  isAvailable?: boolean;
  onAvailabilityChange?: (available: boolean) => void;
  isVerified?: boolean;
}

export function Header({ isAvailable, onAvailabilityChange, isVerified = true }: HeaderProps = {}) {
  const { user, logout } = useAuth();
  console.log("Header user:", user);
  return (
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
                  <span className="text-sm font-medium">{user.creditBalance + user.freeCreditBalance || 0} crédits</span>
                </div>
              )}
              {/* Disponibilité pour les professeurs */}
              {user.type === "teacher" && isAvailable !== undefined && onAvailabilityChange && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-vup-gray">Disponible</span>
                        <Switch
                          checked={isVerified ? isAvailable : false}
                          onCheckedChange={isVerified ? onAvailabilityChange : undefined}
                          disabled={!isVerified}
                        />
                        <div className={`w-2 h-2 rounded-full ${isVerified && isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
                      </div>
                    </TooltipTrigger>
                    {!isVerified && (
                      <TooltipContent>
                        <p>Vous devez être vérifié avant de pouvoir donner des cours</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}

              <span className="text-sm text-vup-gray">{user.type === "student" ? "Élève" : "Professeur"}</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src={user.avatar} alt={user.firstName} /> */}
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
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
                  {/* <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to={user.type === "teacher" ? "/teacher/profile" : "/student/profile"} className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem> */}
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
  );
}
