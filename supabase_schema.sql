-- Table pour stocker les commandes
CREATE TABLE public.commandes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    date_commande TIMESTAMPTZ DEFAULT now() NOT NULL,
    montant_total NUMERIC(10, 2) NOT NULL,
    statut TEXT DEFAULT 'en attente' NOT NULL -- ex: en attente, expédiée, livrée, annulée
);

-- Table pour stocker les articles de chaque commande (table de liaison)
CREATE TABLE public.commande_produits (
    id BIGSERIAL PRIMARY KEY,
    commande_id BIGINT REFERENCES public.commandes(id) ON DELETE CASCADE NOT NULL,
    produit_id INT REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire NUMERIC(10, 2) NOT NULL
);

-- Activer RLS pour les commandes
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Allow users to view their own orders" ON public.commandes
FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer des commandes pour eux-mêmes
CREATE POLICY "Allow users to create their own orders" ON public.commandes
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activer RLS pour les produits des commandes
ALTER TABLE public.commande_produits ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les produits de leurs propres commandes
CREATE POLICY "Allow users to view items in their own orders" ON public.commande_produits
FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.commandes
    WHERE commandes.id = commande_produits.commande_id AND commandes.user_id = auth.uid()
));

-- Les utilisateurs peuvent insérer des produits dans leurs propres commandes
CREATE POLICY "Allow users to insert items into their own orders" ON public.commande_produits
FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.commandes
    WHERE commandes.id = commande_produits.commande_id AND commandes.user_id = auth.uid()
));

