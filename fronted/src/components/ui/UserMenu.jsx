import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth.js";
import { getInitials } from "../../utils/getInitials.js";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">

      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            className="w-9 h-9 rounded-full border"
          />
        ) : (
          <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-full">
            {getInitials(user.username)}
          </div>
        )}

        <div className="text-sm">
          <p className="font-semibold">
            {user.username}
          </p>

          <p className="text-xs text-gray-500">
            {user.role}
          </p>
        </div>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border">

          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Profile
          </button>

          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Orders
          </button>

          {user.role === "admin" && (
            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
              Admin Panel
            </button>
          )}

          <hr />

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;