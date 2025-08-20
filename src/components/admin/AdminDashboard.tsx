"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Users,
  Loader2
} from "lucide-react";

interface Stats {
  totalSales: number;
  todaySales: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  activeCustomers: number;
}

interface RecentOrder {
  id: string;
  user_id: string;
  montant_total: number;
  statut: string;
  date_commande: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const today = new Date(); 
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      // Appels API en parallèle
      const [ordersData, productsCountData, topProductsData] = await Promise.all([
        supabase.from('commandes').select('montant_total, date_commande, statut, user_id'),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.rpc('get_top_products', { limit_count: 5 })
      ]);

      // Calcul des statistiques
      const orders = ordersData.data || [];
      const totalSales = orders.reduce((sum, order) => sum + order.montant_total, 0);
      const todaySales = orders
        .filter(order => new Date(order.date_commande) >= today)
        .reduce((sum, order) => sum + order.montant_total, 0);
      const pendingOrders = orders.filter(order => order.statut === 'en attente').length;
      const activeCustomers = new Set(orders
        .filter(order => new Date(order.date_commande) >= thirtyDaysAgo)
        .map(order => order.user_id)
      ).size;

      setStats({
        totalSales,
        todaySales,
        totalProducts: productsCountData.count ?? 0,
        totalOrders: orders.length,
        pendingOrders,
        activeCustomers
      });

      // Commandes récentes
      const sortedOrders = [...orders].sort((a, b) => new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime());
      setRecentOrders(sortedOrders.slice(0, 5));

      // Meilleurs produits
      setTopProducts(topProductsData.data || []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "livrée":
        return <Badge className="bg-green-100 text-green-800">Livrée</Badge>;
      case "en attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "expédiée":
        return <Badge className="bg-blue-100 text-blue-800">Expédiée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ventes totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats?.totalSales.toLocaleString()} DH</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ventes aujourd'hui</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats?.todaySales.toLocaleString()} DH</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats?.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Commandes totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats?.pendingOrders} en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Clients (30j)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats?.activeCustomers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Commande #{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.date_commande).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col sm:text-right items-center sm:items-end justify-between mt-2 sm:mt-0">
                    <p className="font-medium text-sm">{order.montant_total} DH</p>
                    <div className="mt-0 sm:mt-1">{getStatusBadge(order.statut)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Produits les plus vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-medium flex-shrink-0">{index + 1}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm">{product.revenue.toLocaleString()} DH</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
