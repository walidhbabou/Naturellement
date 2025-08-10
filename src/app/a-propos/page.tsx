import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="mb-10">
          <Image src="/assets/logoapropo.jpg" alt="Logo Atlas coop art" width={180} height={180} className="mx-auto rounded-lg shadow" />
        </div>
        <h1 className="text-3xl font-bold mb-4">À propos d&apos;Atlas coop art</h1>
        <section className="max-w-2xl text-center mb-8">
          <p className="mb-4 text-lg font-serif">
            <strong>Atlas coop art</strong> est une coopérative marocaine spécialisée dans la création et la vente de produits artisanaux en bois naturel. Notre marque valorise le savoir-faire traditionnel, la qualité et l’authenticité à travers des pièces uniques conçues par des artisans passionnés.
          </p>
          <p className="mb-4 text-md">
            Nous proposons une gamme variée de produits tels que des bols, assiettes plates et creuses, saladiers sculptés, plateaux et sets en bois de noyer premium. Chaque article est soigneusement travaillé pour offrir élégance, durabilité et une touche chaleureuse à votre table.
          </p>
          <p className="mb-4 text-md">
            Nos promotions régulières vous permettent de découvrir l’artisanat marocain à des prix avantageux, tout en soutenant le développement local et le respect de l’environnement.
          </p>
        </section>
        
      </main>
      <Footer />
    </>
  );
}
