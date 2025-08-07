'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'products' | 'orders' | 'users';
}

const AdminLayout = ({ children, currentPage }: AdminLayoutProps) => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      key: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      href: '/admin'
    },
    {
      key: 'products',
      label: 'Produits',
      icon: Package,
      href: '/admin/products'
    },
    {
      key: 'orders',
      label: 'Commandes',
      icon: ShoppingCart,
      href: '/admin/orders'
    },
    {
      key: 'users',
      label: 'Utilisateurs',
      icon: Users,
      href: '/admin/users'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const currentItem = navigationItems.find(item => item.key === currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">Naturlife</h1>
            <p className="text-sm text-gray-600">Administration</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-80 h-full shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">Navigation</h2>
                <p className="text-sm text-gray-600">Administration</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.key === currentPage;
                  
                  return (
                    <Button
                      key={item.key}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-12",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-4 border-t">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="w-full justify-start gap-3 h-12 mb-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Retour au site
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 h-12"
                >
                  <LogOut className="h-5 w-5" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-primary">Naturlife</h1>
            <p className="text-sm text-gray-600">Administration</p>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === currentPage;
                
                return (
                  <Button
                    key={item.key}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-12",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full justify-start gap-3 h-10 mb-2"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full justify-start gap-3 h-10"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Page Header */}
          <div className="hidden lg:block bg-white border-b px-6 py-4">
            <div className="flex items-center gap-3">
              {currentItem && (
                <>
                  <currentItem.icon className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold">{currentItem.label}</h1>
                </>
              )}
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
