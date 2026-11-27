import {
  ArrowUpRight,
  Package,
  ShoppingCart,
  Users,
  Wallet,
  Activity,
} from "lucide-react";

import StatCard from "../../components/admin/StatsCard";
import SalesChart from "../../components/admin/saleCharts";
import RecentOrders from "../../components/admin/RecentOrders";

import { dashboardStats, mockActivities } from "../data/mockData";

const Dashboard = () => {
  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="w-fit rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
        >
          Export Report
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>

        <div className="rounded-2xl bg-[#111827] p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Sales</p>
              <h3 className="mt-2 text-3xl font-bold">₹8,45,250</h3>
            </div>

            <div className="rounded-xl bg-white/10 p-3">
              <Wallet size={23} />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">Completed Orders</span>
                <span>78%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[78%] rounded-full bg-indigo-400" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">Pending Orders</span>
                <span>15%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[15%] rounded-full bg-amber-400" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">Cancelled Orders</span>
                <span>7%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[7%] rounded-full bg-red-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-xs text-gray-400">Store performance</p>
            <div className="mt-2 flex items-center gap-2">
              <ArrowUpRight size={19} className="text-green-400" />
              <span className="font-semibold text-green-400">12.8% growth</span>
              <span className="text-xs text-gray-400">
                compared to last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          {
            title: "Products Listed",
            value: "248",
            icon: Package,
            color: "text-blue-600 bg-blue-50",
          },
          {
            title: "Cart Orders",
            value: "86",
            icon: ShoppingCart,
            color: "text-purple-600 bg-purple-50",
          },
          {
            title: "Active Customers",
            value: "3,642",
            icon: Users,
            color: "text-green-600 bg-green-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className={`rounded-xl p-3 ${item.color}`}>
                <Icon size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders */}
      <RecentOrders />

      {/* Activity */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Activity className="text-indigo-600" size={20} />
          <h3 className="font-bold text-gray-900">Recent Activity</h3>
        </div>

        <div className="space-y-4">
          {mockActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <p className="text-sm text-gray-600">{activity}</p>
              <span className="ml-auto text-xs text-gray-400">
                {index + 1}h ago
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
