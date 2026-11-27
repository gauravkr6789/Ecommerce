import { ArrowUpRight, Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";

import { recentOrders } from "../data/mockData";
import StatusBadge from "./StatusBadge";

const RecentOrders = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div>
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <p className="mt-1 text-xs text-gray-400">
            Latest customer transactions
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <tr key={order.id} className="transition hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-semibold text-indigo-600">
                  {order.id}
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-800">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                  {order.date}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                  ₹{order.amount.toLocaleString("en-IN")}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>

                <td className="px-5 py-4">
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                    <Ellipsis size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
