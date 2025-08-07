"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Trash2, 
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

const AdminUserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, role: newRole })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        toast({
          title: "Succès",
          description: "Rôle mis à jour avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le rôle",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Erreur",
          description: errorData.error || "Impossible de supprimer l&apos;utilisateur",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-red-100 text-red-800">
        <Shield className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">
        <Users className="w-3 h-3 mr-1" />
        Utilisateur
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </CardTitle>
          <CardDescription className="text-sm">
            Gérez les utilisateurs et leurs permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="font-medium text-sm sm:text-base">Total Utilisateurs</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                <span className="font-medium text-sm sm:text-base">Administrateurs</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span className="font-medium text-sm sm:text-base">Utilisateurs</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
          </div>

          {/* Version mobile : cartes */}
          <div className="block sm:hidden space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                      {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </Badge>
                  </div>
                  
                  {user.phone && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </p>
                  )}
                  
                  {user.address && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.address}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  
                  <div className="flex gap-2 pt-2">
                    <Select 
                      value={user.role} 
                      onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-sm mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg">Supprimer l&apos;utilisateur</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            Êtes-vous sûr de vouloir supprimer {user.name} ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="text-sm">Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-sm bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Version desktop : tableau */}
          <div className="hidden sm:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d&apos;inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.address && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-xs">{user.address}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        <Select
                          value={user.role}
                          onValueChange={(newRole: 'admin' | 'user') => 
                            updateUserRole(user.id, newRole)
                          }
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur <strong>{user.name}</strong> ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManager;
