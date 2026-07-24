import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Logo */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            ShopEase
          </h2>

          <p className="text-gray-400 text-sm leading-6">
            Your one-stop destination for quality products at affordable
            prices. Shop with confidence and enjoy fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" className="hover:text-white">
                Products
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>

            <li>
              <Link to="/wishlist" className="hover:text-white">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Customer Care
          </h3>

          <ul className="space-y-3">
            <li className="hover:text-white cursor-pointer">
              About Us
            </li>

            <li className="hover:text-white cursor-pointer">
              Contact
            </li>

            <li className="hover:text-white cursor-pointer">
              Privacy Policy
            </li>

            <li className="hover:text-white cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Contact
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>New Delhi, India</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>support@shopease.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} ShopEase. All Rights Reserved.</p>

          <p className="mt-2 md:mt-0">
            Made with ❤️ using React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;