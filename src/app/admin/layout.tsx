"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X } from "lucide-react";
import AdminProtection from "@/components/auth/AdminProtection";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Tableau de bord",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Produits",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Commandes",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Utilisateurs",
      href: "/admin/users",
      icon: Users,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-700 font-serif italic">
            Naturlife
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 bg-white shadow-lg border-r min-h-screen">
            <div className="p-6 border-b">
              <Link href="/" className="text-2xl font-bold text-amber-700 font-serif italic">
                Naturlife
              </Link>
              <p className="text-sm text-gray-600 mt-1">Administration</p>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-amber-100 text-amber-800 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={20} />
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-8 pt-4 border-t">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  Retour au site
                </Link>
              </div>
            </nav>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />
              <div className="relative w-64 bg-white shadow-lg">
                <div className="p-6 border-b">
                  <Link href="/" className="text-2xl font-bold text-amber-700 font-serif italic">
                    Naturlife
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">Administration</p>
                </div>
                
                <nav className="p-4">
                  <ul className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? "bg-amber-100 text-amber-800 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <Icon size={20} />
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  
                  <div className="mt-8 pt-4 border-t">
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut size={20} />
                      Retour au site
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
