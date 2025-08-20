"use client";

import { useEffect, useState } from "react";
import type { Product, CartItem } from "@/types";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Dynamic reviews state (move hooks to top level)
  const [reviews, setReviews] = useState<{id: number, name: string, rating: number, comment: string, created_at: string}[]>([]);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string; rating: number; comment: string }>({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);

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

  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      setReviewLoading(true);
      setReviewError(null);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });
      if (error) {
        setReviewError("Erreur lors du chargement des avis");
      } else {
        setReviews(data || []);
      }
      setReviewLoading(false);
    };
    fetchReviews();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) : 0;
  const ratingBreakdown = [
    reviews.filter(r => r.rating === 5).length,
    reviews.filter(r => r.rating === 4).length,
    reviews.filter(r => r.rating === 3).length,
    reviews.filter(r => r.rating === 2).length,
    reviews.filter(r => r.rating === 1).length,
  ];

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.rating) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: product?.id,
      name: form.name,
      rating: form.rating,
      comment: form.comment,
    });
    setSubmitting(false);
    if (error) {
      alert("Erreur lors de l'enregistrement de l'avis");
    } else {
      setForm({ name: '', rating: 5, comment: '' });
      setShowForm(false);
      // Refresh reviews
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product?.id)
        .order('created_at', { ascending: false });
      setReviews(data || []);
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <>
      <Header />
      <main className="flex flex-col gap-8 p-8 min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">
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
            {/* Note moyenne et nombre d'avis */}
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(averageRating) ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</span>
              ))}
              <span className="text-sm font-medium text-gray-700">{totalReviews} avis</span>
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
        </div>

        {/* Avis Clients Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-4 mt-8">
          <h2 className="text-2xl font-bold text-center mb-6">Avis Clients</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
                <span className="font-bold text-lg">{averageRating.toFixed(2)} sur 5</span>
              </div>
              <div className="text-gray-600">Basé sur {totalReviews} avis</div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              {[5, 4, 3, 2, 1].map((star, idx) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {[...Array(star)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base">★</span>
                    ))}
                  </span>
                  <div className="w-32 h-3 bg-gray-200 rounded overflow-hidden">
                    <div className="bg-black h-3 rounded" style={{ width: `${(ratingBreakdown[idx] / totalReviews) * 100 || 0}%` }}></div>
                  </div>
                  <span className="ml-2 text-sm">{ratingBreakdown[idx]}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex justify-center">
              <button className="bg-black text-white px-6 py-2 rounded hover:bg-neutral-700 transition" onClick={() => setShowForm(true)}>Écrire un avis</button>
            </div>
          </div>
          {/* Formulaire d'ajout d'avis */}
          {showForm && (
            <form className="bg-gray-50 rounded-xl shadow p-4 mb-4" onSubmit={handleSubmitReview}>
              <h3 className="font-semibold mb-2">Laisser un avis</h3>
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="border rounded px-3 py-2 flex-1"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <select
                  className="border rounded px-3 py-2 flex-1"
                  value={form.rating}
                  onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                  required
                >
                  {[5,4,3,2,1].map(star => (
                    <option key={star} value={star}>{star} ★</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Votre commentaire (optionnel)"
                className="border rounded px-3 py-2 w-full mb-2"
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-neutral-700 transition" disabled={submitting}>
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </button>
                <button type="button" className="bg-gray-200 px-6 py-2 rounded" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </div>
            </form>
          )}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Plus récents</h3>
            {reviewLoading ? (
              <div>Chargement des avis...</div>
            ) : reviewError ? (
              <div className="text-red-600">{reviewError}</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                {reviews.length === 0 ? (
                  <div>Aucun avis pour ce produit.</div>
                ) : reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-base">★</span>
                        ))}
                      </span>
                      <span className="text-gray-500 text-sm ml-auto">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                      </span>
                      <span className="font-semibold">{review.name}</span>
                    </div>
                    <div className="text-gray-700">{review.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
