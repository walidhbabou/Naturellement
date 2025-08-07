"use client";

import { ShoppingCart, Truck, Settings, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthForm from "@/components/auth/AuthForm";

const Header = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top Banner with sliding animation */}
      <div className="bg-primary text-primary-foreground py-2 px-4 overflow-hidden relative">
        <div className="container mx-auto flex items-center justify-center text-sm">
          <div className="flex items-center animate-pulse">
            <Truck className="w-4 h-4 mr-2 animate-bounce" />
            <span className="animate-fade-in font-serif italic">Livraison Gracieuse dans Tout le Royaume</span>
          </div>
        </div>
        {/* Animated background shimmer */}
        <div className="absolute inset-0 -skew-x-12 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Main Header */}
      <div className="bg-background border-b border-border py-4 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Navigation with hover animations */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 relative group font-serif">
                Promotions Exclusives
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 relative group font-serif">
                Nos Créations
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 relative group font-serif">
                Notre Histoire
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Logo with breathing animation */}
            <div className="flex-1 text-center md:flex-none">
              <Link href="/">
                <h1 className="text-4xl font-bold text-primary animate-fade-in-up">
                  <span className="italic font-serif hover:animate-pulse cursor-pointer transition-all duration-500 hover:text-4xl inline-block transform hover:rotate-2 tracking-wider">
                    Naturlife
                  </span>
                  <div className="text-xs font-light tracking-widest text-muted-foreground mt-1 font-serif italic">
                    Artisanat Authentique
                  </div>
                </h1>
              </Link>
            </div>

            {/* Cart and Auth with bounce animation */}
            <div className="flex items-center gap-2">
              {isAuthenticated() ? (
                <>
                  {isAdmin() && (
                    <Link href="/admin">
                      <button className="p-2 hover:bg-accent rounded-lg transition-all duration-300 transform hover:scale-110 group">
                        <Settings className="w-6 h-6 text-foreground group-hover:animate-spin" />
                      </button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-2 hover:bg-accent rounded-lg transition-all duration-300 transform hover:scale-110 group">
                        <User className="w-6 h-6 text-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="flex flex-col items-start">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-sm text-muted-foreground">{user?.email}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-2 hover:bg-accent rounded-lg transition-all duration-300 transform hover:scale-110 group">
                      <User className="w-6 h-6 text-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AuthForm onClose={() => setIsAuthDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
              
              <div className="relative">
                <button className="p-2 hover:bg-accent rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 group">
                  <ShoppingCart className="w-6 h-6 text-foreground group-hover:animate-bounce" />
                  <span className="absolute -top-1 -right-1 bg-sale text-sale-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-slow">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-sale opacity-75 animate-ping"></span>
                    <span className="relative">0</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;