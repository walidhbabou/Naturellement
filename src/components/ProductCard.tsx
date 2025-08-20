import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Sécurise les prix pour éviter les erreurs toFixed
  const originalPrice = Number(product.originalPrice) || 0;
  const currentPrice = Number(product.currentPrice) || 0;
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-amber-100 hover:border-amber-300">
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={256}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.discount}%
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 bg-gradient-to-b from-white to-amber-50/30">
        <h3 className="font-serif text-foreground mb-4 text-center text-lg font-medium italic leading-relaxed min-h-[3rem] flex items-center justify-center">
          {product.name}
        </h3>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-muted-foreground line-through text-sm font-serif">
              {originalPrice.toFixed(2)} DH
            </span>
            <span className="text-amber-700 font-bold text-lg font-serif">
              {currentPrice.toFixed(2)} DH
            </span>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;