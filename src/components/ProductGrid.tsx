"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/lib/supabaseClient";


interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
}

const truncateDescription = (desc?: string) => {
  if (!desc) return "";
  if (desc.length <= 40) return desc;
  return desc.slice(0, 40) + "... Lire la suite";
};


const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        setError("Erreur lors du chargement des produits");
      } else {
        // Mappe les données pour adapter le champ image
        const mapped = (data || []).map((p: any) => ({
          id: p.id?.toString(),
          name: p.name,
          image: p.image_url || p.image || "/assets/wooden-bowl.jpg",
          originalPrice: Number(p.original_price ?? p.price ?? 0),
          currentPrice: Number(p.price ?? 0),
          discount: Number(p.discount ?? 0),
          description: p.description ?? ""
        }));
        setProducts(mapped);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-8 text-center">
            <span className="italic font-serif tracking-wide">Assiettes et bols</span>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mt-4 rounded-full"></div>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-serif italic leading-relaxed">
            Découvrez notre collection exclusive d&apos;assiettes et bols artisanaux, 
            sculptés à la main dans les plus nobles essences de bois. 
            Chaque pièce raconte une histoire, celle d&apos;un savoir-faire ancestral 
            transmis de génération en génération.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-4 text-sm text-muted-foreground font-serif">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
              Bois Noble Certifié
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
              Fait Main au Maroc
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
              Pièces Uniques
            </span>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Chargement des produits...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(products ?? []).map((product) => (
              <ProductCard key={product.id} product={{ ...product, description: truncateDescription(product.description) }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;