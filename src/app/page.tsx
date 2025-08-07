import Header from "@/components/Header"; 
import ProductGrid from "@/components/ProductGrid"; 
import Footer from "@/components/Footer"; 
 
export default function Home() { 
  return ( 
    <div className="min-h-screen bg-background"> 
      <Header /> 
      <ProductGrid /> 
      <Footer /> 
    </div> 
  ); 
} 
