
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error || !data) {
        setError("Produit introuvable");
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="md:w-1/2 flex flex-col items-center">
        <Image src={product.image_url || "/assets/wooden-bowl.jpg"} alt={product.name} width={500} height={500} className="rounded-lg object-cover" />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg font-semibold mb-4">{product.price} DH</p>
        <p className="mb-4">{product.description}</p>
        {/* Ajoutez ici d'autres champs si besoin */}
        <button className="bg-neutral-800 text-white px-6 py-2 rounded hover:bg-neutral-700 transition">Ajouter au panier</button>
      </div>
    </div>
  );
}
