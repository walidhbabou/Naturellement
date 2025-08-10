import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PromotionPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Promotion</h1>
        <p>Bienvenue sur la page des promotions !</p>
      </main>
      <Footer />
    </>
  );
}
