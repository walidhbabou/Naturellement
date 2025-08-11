import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { CartItem } from "@/types";

export default function CartPanel({ onClose, onCheckout }: { onClose: () => void; onCheckout: () => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  const handleRemove = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl font-bold">×</button>
        <h2 className="text-xl font-bold mb-4">Mon panier</h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">Votre panier est vide.</div>
        ) : (
          <>
            <ul className="mb-4">
              {cart.map(item => (
                <li key={item.id} className="flex items-center gap-3 mb-3">
                  <Image src={item.image_url || "/assets/wooden-bowl.jpg"} alt={item.name} width={40} height={40} className="rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.quantity} × {item.price} DH</div>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-red-500 text-lg">×</button>
                </li>
              ))}
            </ul>
            <div className="font-bold text-lg mb-4">Sous-total: {subtotal.toFixed(2)} DH</div>
            <div className="flex gap-4">
              <button onClick={onCheckout} className="bg-neutral-800 text-white px-4 py-2 rounded font-bold flex-1">Commander</button>
              <button onClick={onClose} className="bg-gray-100 text-neutral-800 px-4 py-2 rounded font-bold flex-1">Ajouter d&apos;autres articles</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
