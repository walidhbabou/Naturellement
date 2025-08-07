import ProductCard from "./ProductCard";

const products = [
  {
    id: "1",
    name: "Noble Gasâa en Bois de Noyer Premium",
    image: "/assets/wooden-set.jpg",
    originalPrice: 1400.00,
    currentPrice: 699.00,
    discount: 60,
  },
  {
    id: "2",
    name: "Bol Artisanal en Bois Noble",
    image: "/assets/wooden-bowl.jpg",
    originalPrice: 318.00,
    currentPrice: 149.00,
    discount: 53,
  },
  {
    id: "3",
    name: "Saladier Traditionnel Sculpté",
    image: "/assets/wooden-salad-bowl.jpg",
    originalPrice: 400.00,
    currentPrice: 199.00,
    discount: 50,
  },
  {
    id: "4",
    name: "Assiette Plate Authentique",
    image: "/assets/wooden-plate.jpg",
    originalPrice: 400.00,
    currentPrice: 199.00,
    discount: 50,
  },
  {
    id: "5",
    name: "Assiette Creuse Élégante",
    image: "/assets/wooden-bowl.jpg",
    originalPrice: 400.00,
    currentPrice: 129.00,
    discount: 73,
  },
  {
    id: "6",
    name: "Grand Bol Artisanal Raffiné",
    image: "/assets/wooden-salad-bowl.jpg",
    originalPrice: 350.00,
    currentPrice: 129.00,
    discount: 63,
  },
  {
    id: "7",
    name: "Plateau en Bois Sculpté",
    image: "/assets/wooden-plate.jpg",
    originalPrice: 280.00,
    currentPrice: 129.00,
    discount: 54,
  },
  {
    id: "8",
    name: "Collection de Bols Précieux",
    image: "/assets/wooden-set.jpg",
    originalPrice: 500.00,
    currentPrice: 199.00,
    discount: 60,
  },
  {
    id: "9",
    name: "Assiette Décorative Sculptée",
    image: "/assets/wooden-plate.jpg",
    originalPrice: 320.00,
    currentPrice: 129.00,
    discount: 60,
  },
  {
    id: "10",
    name: "Bol à Salade Prestige",
    image: "/assets/wooden-bowl.jpg",
    originalPrice: 450.00,
    currentPrice: 189.00,
    discount: 58,
  },
];

const ProductGrid = () => {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;