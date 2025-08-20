"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";

export default function PromotionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      setError(null);
      // Get total count
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_promo', true);
      setTotal(count || 0);
      // Get current page
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase.from('products').select('*').eq('is_promo', true).range(from, to);
      if (error) {
        setError("Erreur lors du chargement des promotions");
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchPromos();
  }, [page, pageSize]);

  let content;
  if (loading) {
    content = <div className="py-8">Chargement des promotions...</div>;
  } else if (error) {
    content = <div className="text-red-600 py-8">{error}</div>;
  } else if (products.length === 0) {
    content = <div className="py-8">Aucune promotion en cours.</div>;
  } else {
    content = (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {products.map((product) => (
            <div key={product.id} className="flex justify-center items-center">
              <div className="w-[160px] h-[260px] sm:w-[180px] sm:h-[280px] md:w-[200px] md:h-[300px] lg:w-[220px] lg:h-[320px] bg-white rounded shadow-sm flex flex-col">
                <ProductCard product={{
                  id: product.id.toString(),
                  name: product.name,
                  image: product.image_url || "/assets/wooden-bowl.jpg",
                  originalPrice: Number(product.original_price ?? product.price ?? 0),
                  currentPrice: Number(product.price ?? 0),
                  discount: Number(product.discount ?? 0)
                }} />
              </div>
            </div>
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
        <div className="w-full flex flex-col items-center mt-6 mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span role="img" aria-label="party">🎉</span>
            PACK PROMO
          </h1>
        </div>
        {content}
      </main>
      <Footer />
    </>
  );
}
