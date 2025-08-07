import { Facebook, Instagram, MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Main Footer Section */}
      <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 py-12">
        <div className="container mx-auto px-4">
          {/* Contact Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-amber-900 mb-2 tracking-wide font-serif italic">
              Entrez en Contact
            </h3>
            <p className="text-amber-800 mb-6 font-serif italic text-lg">
              Découvrez l&apos;Art de l&apos;Artisanat Authentique
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mb-8 rounded-full"></div>
            
            {/* Social Icons */}
            <div className="flex justify-center items-center space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-blue-100 hover:border-blue-300 group"
              >
                <Facebook size={24} className="text-blue-600 group-hover:animate-pulse" />
              </a>
              
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-pink-100 hover:border-pink-300 group"
              >
                <Instagram size={24} className="text-pink-600 group-hover:animate-pulse" />
              </a>
              
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-green-100 hover:border-green-300 group"
              >
                <MessageCircle size={24} className="text-green-600 group-hover:animate-pulse" />
              </a>
              
              <a
                href="tel:+1234567890"
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-amber-100 hover:border-amber-300 group"
              >
                <Phone size={24} className="text-amber-700 group-hover:animate-pulse" />
              </a>
            </div>
            
            <div className="mt-8 text-amber-800 font-serif italic">
              <p className="text-sm">Suivez-nous pour découvrir nos dernières créations</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm font-serif italic tracking-wide">
              © 2025 Tous Droits Réservés • <span className="font-bold">Naturlife.shop</span> • L&apos;Art du Bois Noble
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;