"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        setError("Erreur lors du chargement des produits");
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  let content;
  if (loading) {
    content = <div className="py-8">Chargement...</div>;
  } else if (error) {
    content = <div className="text-red-600 py-8">{error}</div>;
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {products.map((product) => (
          <a
            key={product.id}
            href={`/produits/${product.id}`}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:ring-2 hover:ring-orange-400 transition cursor-pointer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Image src={product.image_url || "/assets/wooden-bowl.jpg"} alt={product.name} width={180} height={180} className="rounded mb-2 object-cover" />
            <h2 className="font-serif font-medium text-lg mb-2 text-center">{product.name}</h2>
            <div className="flex flex-col items-center mb-2">
              {product.original_price && product.original_price !== product.price && (
                <span className="line-through text-gray-400 text-sm">{product.original_price} DH</span>
              )}
              <span className="text-xl font-bold text-orange-700">{product.price} DH</span>
            </div>
            {(product.discount ?? 0) > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2">-{product.discount}%</span>
            )}
            <p className="text-sm text-gray-600 text-center mb-2">{product.description}</p>
            {/* Stock non affiché */}
          </a>
        ))}
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center min-h-screen px-4">
        {content}
      </main>
      <Footer />
    </>
  );
}
