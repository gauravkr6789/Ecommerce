import UserMenu from "../ui/UserMenu";
import { useAuth } from "../../hooks/auth/useAuth.js";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">

        {/* LOGO */}
        <h1 className="text-2xl font-extrabold text-indigo-600">
          ShopMate
        </h1>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            placeholder="Search products..."
            className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <span className="text-xl cursor-pointer">🛒</span>

          {user ? (
            <UserMenu />
          ) : (
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full">
              Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;