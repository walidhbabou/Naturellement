import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Users,
  Eye
} from "lucide-react";

const AdminDashboard = () => {
  // Données simulées - dans un vrai projet, ces données viendraient d'une API
  const stats = {
    totalSales: 45230,
    todaySales: 1250,
    totalProducts: 10,
    totalOrders: 156,
    activeCustomers: 89,
    pendingOrders: 12
  };

  const recentOrders = [
    { id: "ORD-001", customer: "Marie Dubois", amount: 199, status: "completed", date: "2025-08-06" },
    { id: "ORD-002", customer: "Jean Martin", amount: 149, status: "pending", date: "2025-08-06" },
    { id: "ORD-003", customer: "Sophie Bernard", amount: 699, status: "completed", date: "2025-08-05" },
    { id: "ORD-004", customer: "Pierre Leroy", amount: 129, status: "shipped", date: "2025-08-05" },
    { id: "ORD-005", customer: "Anne Moreau", amount: 189, status: "pending", date: "2025-08-04" },
  ];

  const topProducts = [
    { name: "Noble Gasâa en Bois de Noyer", sales: 25, revenue: 17475 },
    { name: "Bol", sales: 18, revenue: 2682 },
    { name: "Saladier", sales: 15, revenue: 2985 },
    { name: "Assiette plate", sales: 12, revenue: 2388 },
    { name: "Grand Bol Artisanal", sales: 10, revenue: 1290 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Expédié</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête mobile */}
      <div className="block sm:hidden mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
        <p className="text-sm text-gray-600">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ventes totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats.totalSales.toLocaleString()} DH</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ventes aujourd&apos;hui</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats.todaySales.toLocaleString()} DH</div>
            <p className="text-xs text-muted-foreground">
              +5% par rapport à hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produits disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Commandes totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Clients actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Taux de conversion</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-lg sm:text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Commandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Commandes récentes</CardTitle>
            <CardDescription className="text-sm">
              Les dernières commandes passées sur votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col sm:text-right items-center sm:items-end justify-between sm:justify-start">
                    <p className="font-medium text-sm sm:text-base">{order.amount} DH</p>
                    <div className="mt-0 sm:mt-1">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produits les plus vendus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Produits les plus vendus</CardTitle>
            <CardDescription className="text-sm">
              Top 5 des produits par nombre de ventes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-xs sm:text-sm">{product.revenue.toLocaleString()} DH</p>
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
