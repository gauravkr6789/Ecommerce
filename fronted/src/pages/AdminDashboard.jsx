import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosinstance from "../../services/Axios";
import { Users, ShoppingCart, Package, DollarSign } from "lucide-react";

const AdminDashboard = () => {

  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosinstance.get("/admin/dashboard-stats");
      return res.data.data;
    },
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card icon={<Users />} title="Users" value={data?.totalUsers} />

        <Card icon={<Package />} title="Products" value={data?.totalProducts} />

        <Card icon={<ShoppingCart />} title="Orders" value={data?.totalOrders} />

        <Card icon={<DollarSign />} title="Revenue" value={data?.totalRevenue} />

      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded shadow flex items-center gap-3">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;