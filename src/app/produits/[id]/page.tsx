"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row gap-8 p-8 min-h-screen">
        <div className="md:w-1/2 flex flex-col items-center">
          <Image src={product.image_url || "/assets/wooden-bowl.jpg"} alt={product.name} width={500} height={500} className="rounded-lg object-cover" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-2">
            {product.original_price && product.original_price !== product.price && (
              <span className="line-through text-gray-400 text-xl">{product.original_price} DH</span>
            )}
            <span className="text-2xl font-bold text-neutral-900">{product.price} DH</span>
          </div>
          <div className="mb-2 font-bold">La livraison gratuite</div>
          <div className="mb-4">
            <p>{product.description}</p>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <button
              className="border rounded px-3 py-2 text-xl"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="text-xl font-bold w-8 text-center">{quantity}</span>
            <button
              className="border rounded px-3 py-2 text-xl"
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
          <button
            className="bg-neutral-800 text-white px-6 py-3 rounded font-bold text-lg hover:bg-neutral-700 transition w-full max-w-xl"
            onClick={handleAddToCart}
          >
            AJOUTER AU PANIER
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
