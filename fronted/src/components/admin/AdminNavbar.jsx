import { Menu, Search, Bell, ChevronDown } from "lucide-react";

const AdminNavbar = ({ setOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur-md sm:px-7">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900">Admin Workspace</h1>
          <p className="hidden text-xs text-gray-400 sm:block">
            Manage your store operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 md:flex">
          <Search size={17} className="text-gray-400" />
          <input
            placeholder="Search anything..."
            className="w-40 bg-transparent text-sm outline-none"
          />
          <span className="text-xs text-gray-400">⌘ K</span>
        </div>

        <button className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-100 pl-3 sm:pl-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>

          <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
