"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
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
  Edit, 
  Trash2, 
  Plus,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
}

const AdminProductManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Noble Gasâa en Bois de Noyer",
      image: "/assets/wooden-set.jpg",
      originalPrice: 1400.00,
      currentPrice: 699.00,
      discount: 60,
      stock: 15,
      status: 'active',
      description: "Set complet en bois de noyer de haute qualité"
    },
    {
      id: "2",
      name: "Bol",
      image: "/assets/wooden-bowl.jpg",
      originalPrice: 318.00,
      currentPrice: 149.00,
      discount: 53,
      stock: 25,
      status: 'active',
      description: "Bol artisanal en bois"
    },
    {
      id: "3",
      name: "Saladier",
      image: "/assets/wooden-salad-bowl.jpg",
      originalPrice: 400.00,
      currentPrice: 199.00,
      discount: 50,
      stock: 8,
      status: 'active',
      description: "Grand saladier en bois naturel"
    },
    {
      id: "4",
      name: "Assiette plate",
      image: "/assets/wooden-plate.jpg",
      originalPrice: 400.00,
      currentPrice: 199.00,
      discount: 50,
      stock: 0,
      status: 'inactive',
      description: "Assiette plate en bois sculpté"
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    currentPrice: '',
    stock: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      originalPrice: product.originalPrice.toString(),
      currentPrice: product.currentPrice.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      status: product.status
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      originalPrice: '',
      currentPrice: '',
      stock: '',
      description: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.originalPrice || !formData.currentPrice || !formData.stock) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const originalPrice = parseFloat(formData.originalPrice);
    const currentPrice = parseFloat(formData.currentPrice);
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    if (editingProduct) {
      // Modification
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: formData.name,
              originalPrice,
              currentPrice,
              discount,
              stock: parseInt(formData.stock),
              description: formData.description,
              status: formData.status
            }
          : p
      ));
      toast({
        title: "Succès",
        description: "Produit modifié avec succès",
      });
    } else {
      // Ajout
      const newProduct: Product = {
        id: (products.length + 1).toString(),
        name: formData.name,
        image: "/assets/wooden-bowl.jpg", // Image par défaut
        originalPrice,
        currentPrice,
        discount,
        stock: parseInt(formData.stock),
        status: formData.status,
        description: formData.description
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Succès",
      description: "Produit supprimé avec succès",
    });
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Rupture de stock</Badge>;
    }
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    }
    return <Badge variant="secondary">Inactif</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des produits</h2>
          <p className="text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? 'Modifiez les informations du produit' 
                  : 'Ajoutez un nouveau produit à votre catalogue'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du produit"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="originalPrice">Prix original *</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="currentPrice">Prix actuel *</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du produit"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                {editingProduct ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Liste des produits
          </CardTitle>
          <CardDescription>
            {products.length} produit(s) dans votre catalogue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Remise</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.currentPrice} DH</p>
                      {product.originalPrice !== product.currentPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {product.originalPrice} DH
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.discount > 0 && (
                      <Badge variant="destructive">-{product.discount}%</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={product.stock <= 5 ? 'text-red-600 font-medium' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status, product.stock)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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
    </div>
  );
};

export default AdminProductManager;
