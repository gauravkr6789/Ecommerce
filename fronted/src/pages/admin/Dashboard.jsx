import React from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TicketPercent,
  Tags,
  CreditCard,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  IndianRupee,
  UserRound,
  Plus,
  AlertTriangle,
  MoreHorizontal,
  Menu,
  Moon,
  Sun,
  BarChart3,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useProducts } from "../../hooks/product/useProduct.js";

// ======================================================
// TEMPORARY DASHBOARD DATA
// ======================================================

const orderStatusData = [
  {
    name: "Delivered",
    value: 72,
  },
  {
    name: "Shipped",
    value: 12,
  },
  {
    name: "Processing",
    value: 8,
  },
  {
    name: "Cancelled",
    value: 5,
  },
  {
    name: "Returned",
    value: 3,
  },
];

const statusColors = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

const recentOrders = [
  {
    id: "#ORD-10024",
    customer: "Rahul Sharma",
    amount: "₹2,499",
    status: "Delivered",
    payment: "Razorpay",
    date: "May 7, 2025",
  },
  {
    id: "#ORD-10023",
    customer: "Priya Singh",
    amount: "₹1,299",
    status: "Shipped",
    payment: "Razorpay",
    date: "May 7, 2025",
  },
  {
    id: "#ORD-10022",
    customer: "Amit Kumar",
    amount: "₹3,799",
    status: "Processing",
    payment: "Razorpay",
    date: "May 7, 2025",
  },
  {
    id: "#ORD-10021",
    customer: "Sneha Patel",
    amount: "₹999",
    status: "Pending",
    payment: "COD",
    date: "May 6, 2025",
  },
];

const recentUsers = [
  {
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "Customer",
    joined: "May 6, 2025",
  },
  {
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    role: "Customer",
    joined: "May 5, 2025",
  },
  {
    name: "Rohit Sharma",
    email: "rohit@gmail.com",
    role: "Customer",
    joined: "May 4, 2025",
  },
  {
    name: "Admin",
    email: "admin@shopease.com",
    role: "Admin",
    joined: "Apr 12, 2025",
  },
];

// ======================================================
// MENU
// ======================================================

const menuSections = [
  {
    title: "E-COMMERCE",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
      },
      {
        name: "Products",
        icon: Package,
        path: "/admin/products",
      },
      {
        name: "Orders",
        icon: ShoppingCart,
        path: "/admin/orders",
      },
      {
        name: "Users",
        icon: Users,
        path: "/admin/users",
      },
      {
        name: "Coupons",
        icon: TicketPercent,
        path: "/admin/coupons",
      },
      {
        name: "Categories",
        icon: Tags,
        path: "/categories",
      },
    ],
  },

  {
    title: "PAYMENTS",
    items: [
      {
        name: "Transactions",
        icon: CreditCard,
        path: "/admin/transactions",
      },
    ],
  },

  {
    title: "SETTINGS",
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
  },
];

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
  subtitle,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            {value}
          </h2>

          {subtitle && (
            <p className="text-xs text-slate-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  const styles = {
    Delivered: "bg-emerald-50 text-emerald-600",
    Shipped: "bg-blue-50 text-blue-600",
    Processing: "bg-amber-50 text-amber-600",
    Pending: "bg-orange-50 text-orange-600",
    Cancelled: "bg-red-50 text-red-600",
    Returned: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

// ======================================================
// ADMIN DASHBOARD
// ======================================================

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    React.useState(false);

  const [darkMode, setDarkMode] =
    React.useState(false);

  // ====================================================
  // PRODUCTS
  // ====================================================

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useProducts();

  // ====================================================
  // LOW STOCK
  // ====================================================

  const lowStockProducts = products
    .filter(
      (product) => Number(product.stock) <= 10
    )
    .slice(0, 5);

  // ====================================================
  // TOP PRODUCTS
  // ====================================================

  const topProducts = products.slice(0, 5);

  // ====================================================
  // IMAGE URL
  // ====================================================

  const getImageUrl = (product) => {
    const imagePath = product?.images?.[0]?.url;

    if (!imagePath) {
      return null;
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `${import.meta.env.VITE_API_URLL}${imagePath}`;
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950"
          : "bg-slate-50"
      }`}
    >
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-[250px]
          bg-slate-950
          text-white
          transform transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* LOGO */}

        <div className="h-[72px] px-6 flex items-center border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <ShoppingCart size={20} />
          </div>

          <div className="ml-3">
            <h1 className="text-lg font-bold">
              ShopEase
            </h1>

            <p className="text-[11px] text-slate-500">
              Admin Console
            </p>
          </div>
        </div>

        {/* NAVIGATION */}

        <div className="px-3 py-5 overflow-y-auto h-[calc(100vh-72px)]">
          {menuSections.map((section) => (
            <div
              key={section.title}
              className="mb-7"
            >
              <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.15em] text-slate-600">
                {section.title}
              </p>

              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.path === "/admin";

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3
                      px-3 py-2.5 mb-1
                      rounded-xl text-sm
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }
                    `}
                  >
                    <Icon size={18} />

                    <span className="flex-1 text-left">
                      {item.name}
                    </span>

                    {item.name !==
                      "Dashboard" && (
                      <ChevronRight
                        size={14}
                        className="opacity-50"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* SIDEBAR FOOTER */}

          <div className="mt-8 p-4 border border-slate-800 rounded-2xl bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Package
                  size={17}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  ShopEase
                </p>

                <p className="text-[11px] text-slate-500">
                  Store Management
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="lg:ml-[250px]">
        {/* ==================================================
            HEADER
        ================================================== */}

        <header
          className={`
            h-[72px]
            border-b
            px-5 lg:px-7
            flex items-center justify-between
            sticky top-0 z-30
            ${
              darkMode
                ? "bg-slate-950 border-slate-800"
                : "bg-white/95 border-slate-200 backdrop-blur"
            }
          `}
        >
          <div className="flex items-center gap-4">
            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="lg:hidden text-slate-600"
            >
              <Menu size={22} />
            </button>

            {/* SEARCH */}

            <div className="hidden md:flex items-center w-[380px] bg-slate-50 border border-slate-200 rounded-xl px-3">
              <Search
                size={17}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-transparent px-3 py-2.5 outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          {/* HEADER RIGHT */}

          <div className="flex items-center gap-4">
            {/* MOBILE SEARCH */}

            <button className="md:hidden text-slate-500">
              <Search size={20} />
            </button>

            {/* DARK MODE */}

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* NOTIFICATION */}

            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100">
              <Bell
                size={19}
                className="text-slate-500"
              />

              <span className="absolute right-1.5 top-1 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {/* ADMIN */}

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                <UserRound
                  size={17}
                  className="text-indigo-600"
                />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Admin
                </p>

                <p className="text-[10px] text-slate-400">
                  Super Admin
                </p>
              </div>

              <ChevronDown
                size={15}
                className="text-slate-400"
              />
            </div>
          </div>
        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="p-5 lg:p-7">
          {/* PAGE HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span>Dashboard</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Dashboard
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Overview of your store and recent activity.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/admin/products/create"
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Orders"
              value="1,248"
              subtitle="All orders"
              icon={ShoppingCart}
              iconClass="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              title="Total Revenue"
              value="₹4,82,350"
              subtitle="Current revenue"
              icon={IndianRupee}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Customers"
              value="892"
              subtitle="Registered users"
              icon={Users}
              iconClass="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Products"
              value={
                productsLoading
                  ? "..."
                  : products.length
              }
              subtitle="Active products"
              icon={Package}
              iconClass="bg-amber-50 text-amber-600"
            />
          </div>

          {/* ==================================================
              ORDER STATUS + QUICK ACTIONS
          ================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
            {/* ORDER STATUS */}

            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Order Status
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Current order distribution
                  </p>
                </div>

                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <BarChart3
                    size={18}
                    className="text-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="h-[210px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {orderStatusData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                statusColors[
                                  index
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {orderStatusData.map(
                    (item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                statusColors[
                                  index
                                ],
                            }}
                          />

                          <span className="text-xs text-slate-500">
                            {item.name}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-slate-700">
                          {item.value}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-xs text-slate-400 mt-1 mb-4">
                Frequently used admin actions
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    navigate(
                      "/admin/products/create"
                    )
                  }
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <Plus size={18} />
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    Add Product
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Create product
                  </p>
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/products"
                    )
                  }
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Package size={18} />
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    Products
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Manage products
                  </p>
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/orders"
                    )
                  }
                  className="p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                    <ShoppingCart size={18} />
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    Orders
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Manage orders
                  </p>
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/coupons"
                    )
                  }
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-200 hover:bg-amber-50/50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                    <TicketPercent size={18} />
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    Coupons
                  </p>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Manage discounts
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              RECENT ORDERS + PRODUCTS
          ================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-6">
            {/* RECENT ORDERS */}

            <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart
                      size={18}
                      className="text-indigo-600"
                    />

                    <h2 className="font-bold text-slate-900">
                      Recent Orders
                    </h2>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Latest customer orders
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/orders"
                    )
                  }
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead className="bg-slate-50">
                    <tr>
                      {[
                        "Order ID",
                        "Customer",
                        "Amount",
                        "Status",
                        "Payment",
                        "Date",
                        "",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="text-left px-4 py-3 text-[10px] uppercase tracking-wide font-bold text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map(
                      (order) => (
                        <tr
                          key={order.id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition"
                        >
                          <td className="px-4 py-3 text-xs font-semibold text-indigo-600">
                            {order.id}
                          </td>

                          <td className="px-4 py-3 text-xs text-slate-700">
                            {order.customer}
                          </td>

                          <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                            {order.amount}
                          </td>

                          <td className="px-4 py-3">
                            <StatusBadge
                              status={
                                order.status
                              }
                            />
                          </td>

                          <td className="px-4 py-3 text-xs text-slate-500">
                            {order.payment}
                          </td>

                          <td className="px-4 py-3 text-xs text-slate-500">
                            {order.date}
                          </td>

                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                navigate(
                                  "/admin/orders"
                                )
                              }
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100"
                            >
                              <MoreHorizontal
                                size={17}
                                className="text-slate-400"
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Package
                      size={18}
                      className="text-indigo-600"
                    />

                    <h2 className="font-bold text-slate-900">
                      Products
                    </h2>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Recently added products
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/products"
                    )
                  }
                  className="text-xs font-semibold text-indigo-600"
                >
                  View all →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {topProducts.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No products available
                  </div>
                ) : (
                  topProducts.map(
                    (product) => {
                      const imageUrl =
                        getImageUrl(
                          product
                        );

                      return (
                        <div
                          key={
                            product._id
                          }
                          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                product.name
                              }
                              className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                              <Package
                                size={17}
                                className="text-slate-400"
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {
                                product.name
                              }
                            </p>

                            <p className="text-[10px] text-slate-400 mt-1">
                              Stock:{" "}
                              {
                                product.stock
                              }
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-700">
                              ₹
                              {(
                                product.discountPrice ||
                                product.price
                              )?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              LOW STOCK + RECENT USERS
          ================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* LOW STOCK */}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle
                      size={17}
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-sm text-slate-900">
                      Low Stock
                    </h2>

                    <p className="text-[10px] text-slate-400">
                      Products needing attention
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/products"
                    )
                  }
                  className="text-xs text-indigo-600 font-semibold"
                >
                  View all →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {lowStockProducts.length ===
                0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No low stock products
                  </div>
                ) : (
                  lowStockProducts.map(
                    (product) => (
                      <div
                        key={
                          product._id
                        }
                        className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                            <Package
                              size={16}
                              className="text-red-500"
                            />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {
                                product.name
                              }
                            </p>

                            <p className="text-[10px] text-slate-400 mt-1">
                              Stock remaining
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold text-red-500">
                            {
                              product.stock
                            }
                          </p>

                          <span className="text-[9px] bg-red-50 text-red-500 px-2 py-1 rounded-full font-semibold">
                            Low Stock
                          </span>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            {/* RECENT USERS */}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Users
                      size={17}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-sm text-slate-900">
                      Recent Users
                    </h2>

                    <p className="text-[10px] text-slate-400">
                      Latest registered users
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/users"
                    )
                  }
                  className="text-xs text-indigo-600 font-semibold"
                >
                  View all →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {recentUsers.map(
                  (user) => (
                    <div
                      key={
                        user.email
                      }
                      className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <UserRound
                          size={15}
                          className="text-slate-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {
                            user.name
                          }
                        </p>

                        <p className="text-[10px] text-slate-400 truncate mt-1">
                          {
                            user.email
                          }
                        </p>
                      </div>

                      <span
                        className={`text-[9px] px-2 py-1 rounded-full font-semibold ${
                          user.role ===
                          "Admin"
                            ? "bg-violet-50 text-violet-600"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {
                          user.role
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
}