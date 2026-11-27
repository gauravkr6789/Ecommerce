import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TicketPercent,
  CreditCard,
  RefreshCcw,
  Truck,
  ChartNoAxesCombined,
  Settings,
  X,
  Store,
  LogOut,
} from "lucide-react";

const menuGroups = [
  {
    title: "MAIN MENU",
    items: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Products", path: "/admin/products", icon: Package },
      { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
      { name: "Customers", path: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Coupons", path: "/admin/coupons", icon: TicketPercent },
      { name: "Payments", path: "/admin/payments", icon: CreditCard },
      { name: "Refunds", path: "/admin/refunds", icon: RefreshCcw },
      { name: "Delivery", path: "/admin/delivery", icon: Truck },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Analytics",
        path: "/admin/analytics",
        icon: ChartNoAxesCombined,
      },
      { name: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

const AdminSidebar = ({ open, setOpen }) => {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111827] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500 p-2">
              <Store size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">ShopAdmin</h2>
              <p className="text-[10px] tracking-widest text-gray-400">
                CONTROL PANEL
              </p>
            </div>
          </div>

          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-gray-500">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/admin"}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={19} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Back to Store
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
