import UserMenu from "../ui/UserMenu";
import { useAuth } from "../../hooks/auth/useAuth.js";
const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center px-6 py-4 shadow bg-white">

      <h1 className="text-xl font-bold text-indigo-600">
        E-Commerce
      </h1>

      <div>
        {user ? (
          <UserMenu />
        ) : (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;