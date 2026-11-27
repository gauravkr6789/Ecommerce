import { useState } from "react";
import { BarChart3, TrendingUp, ShoppingBag, Users } from "lucide-react";
import SalesChart from "../../components/admin/saleCharts";
import { salesData } from "../../data/mockdata";
const Analytics = () => {
  const [period, setPeriod] = useState("Yearly");

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);

  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            Understand your store performance.
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
        >
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {[
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            Icon: TrendingUp,
          },
          {
            label: "Total Orders",
            value: totalOrders.toLocaleString("en-IN"),
            Icon: ShoppingBag,
          },
          {
            label: "Monthly Reports",
            value: salesData.length,
            Icon: BarChart3,
          },
        ].map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Icon className="mb-4 text-indigo-600" size={23} />
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="mt-2 text-2xl font-bold">{value}</h3>
          </div>
        ))}
      </div>

      <SalesChart />
    </div>
  );
};

export default Analytics;
