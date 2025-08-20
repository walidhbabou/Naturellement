"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Eye, 
  Trash2, 
  ShoppingCart,
  Filter,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'en attente' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
  customer: {
    name: string;
    email: string;
  };
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

const AdminSalesManager = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('commandes')
        .select(`
          id,
          date_commande,
          montant_total,
          statut,
          users ( name, email ),
          commande_produits (
            quantite,
            prix_unitaire,
            products ( name )
          )
        `);

      if (error) {
        console.error('Error fetching orders:', error);
        toast({ title: "Erreur", description: "Impossible de charger les commandes.", variant: "destructive" });
      } else if (data) {
        const formattedOrders = data.map((order: any) => ({
          id: order.id.toString(),
          date: new Date(order.date_commande).toLocaleDateString(),
          total: order.montant_total,
          status: order.statut,
          customer: {
            name: order.users?.name || 'N/A',
            email: order.users?.email || 'N/A',
          },
          items: order.commande_produits.map((item: any) => ({
            productName: item.products?.name || 'Produit inconnu',
            quantity: item.quantite,
            price: item.prix_unitaire,
          })),
        }));
        setOrders(formattedOrders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [toast]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('commandes')
      .update({ statut: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({ title: "Erreur", description: "La mise à jour a échoué.", variant: "destructive" });
    } else {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      toast({ title: "Succès", description: "Statut de la commande mis à jour." });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const { error: itemError } = await supabase
      .from('commande_produits')
      .delete()
      .eq('commande_id', orderId);

    if (itemError) {
      toast({ title: "Erreur", description: "Impossible de supprimer les articles de la commande.", variant: "destructive" });
      return;
    }

    const { error: orderError } = await supabase
      .from('commandes')
      .delete()
      .eq('id', orderId);

    if (orderError) {
      toast({ title: "Erreur", description: "La suppression de la commande a échoué.", variant: "destructive" });
    } else {
      setOrders(orders.filter(order => order.id !== orderId));
      toast({ title: "Succès", description: "Commande supprimée avec succès." });
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'en attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'confirmée':
        return <Badge className="bg-blue-100 text-blue-800">Confirmée</Badge>;
      case 'expédiée':
        return <Badge className="bg-purple-100 text-purple-800">Expédiée</Badge>;
      case 'livrée':
        return <Badge className="bg-green-100 text-green-800">Livrée</Badge>;
      case 'annulée':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const totalRevenue = orders
    .filter(order => order.status === 'livrée')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === 'en attente').length;

  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Gestion des ventes</h2>
          <p className="text-gray-600">Gérez vos commandes et suivez vos ventes</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} DH</p>
              <p className="text-sm text-gray-600">Revenus totaux</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Label>Filtrer par statut:</Label>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en attente">En attente</SelectItem>
            <SelectItem value="confirmée">Confirmées</SelectItem>
            <SelectItem value="expédiée">Expédiées</SelectItem>
            <SelectItem value="livrée">Livrées</SelectItem>
            <SelectItem value="annulée">Annulées</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Tableau des commandes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Commandes ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Liste de toutes les commandes passées sur votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} article(s)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <p className="font-medium">{order.total} DH</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{order.paymentMethod}</p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => 
                        handleUpdateStatus(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog pour voir les détails de la commande */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Informations complètes sur cette commande
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Informations client */}
              <div>
                <h3 className="font-semibold mb-3">Informations client</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Nom:</strong> {selectedOrder.customer.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p><strong>Téléphone:</strong> {selectedOrder.customer.phone}</p>
                    <p><strong>Adresse:</strong> {selectedOrder.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Articles commandés */}
              <div>
                <h3 className="font-semibold mb-3">Articles commandés</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.price * item.quantity} DH</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé de la commande */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Date:</strong> {selectedOrder.date}</p>
                    <p><strong>Paiement:</strong> {selectedOrder.paymentMethod}</p>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{selectedOrder.total} DH</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSalesManager;
