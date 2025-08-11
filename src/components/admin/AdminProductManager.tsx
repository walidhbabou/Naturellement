"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) {
        setError("Erreur lors du chargement des produits");
      } else {
        setProducts(
          (data || []).map((p) => ({
            id: p.id.toString(),
            name: p.name,
            image: p.image_url ? p.image_url : "/assets/wooden-bowl.jpg",
            originalPrice: p.original_price ?? p.price,
            currentPrice: p.price,
            discount: p.discount ?? 0,
            stock: p.stock ?? 0,
            status: p.status ?? 'active',
            description: p.description ?? ''
          })) as Product[]
        );
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    currentPrice: '',
    stock: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    imageFile: null as File | null,
    imageUrl: ''
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      originalPrice: product.originalPrice.toString(),
      currentPrice: product.currentPrice.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      status: product.status,
      imageFile: null,
      imageUrl: product.image
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
      status: 'active',
      imageFile: null,
      imageUrl: ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
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

    let imageUrl = formData.imageUrl;
    // Upload image if a new file is selected
    if (formData.imageFile) {
      // Vérification du type MIME
      if (!formData.imageFile.type.startsWith('image/')) {
        toast({ title: "Erreur image", description: "Le fichier sélectionné n'est pas une image valide.", variant: "destructive" });
        return;
      }
      const fileExt = formData.imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, formData.imageFile, {
          cacheControl: '3600',
          upsert: false
        });
      if (uploadError || !uploadData) {
        toast({ title: "Erreur upload image", description: (uploadError?.message || 'Upload échoué') + ' (Vérifiez le format et les permissions du bucket Supabase)', variant: "destructive" });
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      imageUrl = publicUrlData?.publicUrl || '';
      if (!imageUrl) {
        toast({ title: "Erreur image", description: "Impossible de récupérer l'URL publique de l'image.", variant: "destructive" });
        return;
      }
    }

    if (editingProduct) {
      // Modification
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          original_price: originalPrice,
          price: currentPrice,
          discount,
          stock: parseInt(formData.stock),
          image_url: imageUrl,
          status: formData.status,
          description: formData.description
        })
        .eq('id', editingProduct.id);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Produit modifié avec succès" });
        // Recharger les produits
        const { data } = await supabase.from('products').select('*');
        setProducts((data || []).map((p) => ({
          id: p.id.toString(),
          name: p.name,
          image: p.image_url ? p.image_url : "/assets/wooden-bowl.jpg",
          originalPrice: p.original_price ?? p.price,
          currentPrice: p.price,
          discount: p.discount ?? 0,
          stock: p.stock ?? 0,
          status: p.status ?? 'active',
          description: p.description ?? ''
        })) as Product[]);
      }
    } else {
      // Ajout
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            original_price: originalPrice,
            price: currentPrice,
            discount,
            stock: parseInt(formData.stock),
            image_url: imageUrl,
            status: formData.status,
            description: formData.description
          }
        ]);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Produit ajouté avec succès" });
        // Recharger les produits
        const { data } = await supabase.from('products').select('*');
        setProducts((data || []).map((p) => ({
          id: p.id.toString(),
          name: p.name,
          image: p.image_url ? p.image_url : "/assets/wooden-bowl.jpg",
          originalPrice: p.original_price ?? p.price,
          currentPrice: p.price,
          discount: p.discount ?? 0,
          stock: p.stock ?? 0,
          status: p.status ?? 'active',
          description: p.description ?? ''
        })) as Product[]);
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Produit supprimé avec succès" });
      // Recharger les produits
      const { data } = await supabase.from('products').select('*');
  setProducts((data || []).map((p) => ({
        id: p.id.toString(),
        name: p.name,
        image: p.image_url ? p.image_url : "/assets/wooden-bowl.jpg",
        originalPrice: p.original_price ?? p.price,
        currentPrice: p.price,
        discount: p.discount ?? 0,
        stock: p.stock ?? 0,
        status: p.status ?? 'active',
        description: p.description ?? ''
      })) as Product[]);
    }
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
              <div>
                <Label htmlFor="image">Image du produit</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, imageFile: file });
                  }}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <Image src={formData.imageUrl} alt="Aperçu" width={80} height={80} className="rounded" />
                  </div>
                )}
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
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
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
          {loading ? (
            <div className="text-center py-8">Chargement des produits...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductManager;

