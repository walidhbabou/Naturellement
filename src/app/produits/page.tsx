"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      // Récupère le total
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      setTotal(count || 0);
      // Récupère la page
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase.from('products').select('*').range(from, to);
      if (error) {
        setError("Erreur lors du chargement des produits");
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [page, pageSize]);

  let content;
  if (loading) {
    content = <div className="py-8">Chargement...</div>;
  } else if (error) {
    content = <div className="text-red-600 py-8">{error}</div>;
  } else {
    content = (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {products.map((product) => (
            <a key={product.id} href={`/produits/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="scale-90">
                <ProductCard product={{
                  id: product.id.toString(),
                  name: product.name,
                  image: product.image_url || "/assets/wooden-bowl.jpg",
                  originalPrice: Number(product.original_price ?? product.price ?? 0),
                  currentPrice: Number(product.price ?? 0),
                  discount: Number(product.discount ?? 0)
                }} />
              </div>
            </a>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-bold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </button>
          <span className="px-2">Page {page} / {Math.max(1, Math.ceil(total / pageSize))}</span>
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-bold disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Suivant
          </button>
        </div>
      </>
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
