import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "../../services/Axios";
import { Truck, PackageCheck } from "lucide-react";

const DeliveryDashboard = () => {
  const queryClient = useQueryClient();

  // FETCH ORDERS
  const { data, isLoading } = useQuery({
    queryKey: ["delivery-orders"],
    queryFn: async () => {
      const res = await axiosinstance.get("/delivery/orders");
      return res.data.data;
    },
  });

  // MARK SHIPPED
  const shippedMutation = useMutation({
    mutationFn: async (id) => {
      return axiosinstance.put(`/delivery/orders/${id}/shipped`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["delivery-orders"]);
    },
  });

  // MARK DELIVERED
  const deliveredMutation = useMutation({
    mutationFn: async (id) => {
      return axiosinstance.put(`/delivery/orders/${id}/delivered`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["delivery-orders"]);
    },
  });

  if (isLoading)
    return <p className="p-5">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck /> Delivery Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {data?.map((order) => (
          <div key={order._id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">
              Order ID: {order._id}
            </p>

            <p>Status: {order.orderStatus}</p>

            <p className="text-sm text-gray-500">
              User: {order.user?.username}
            </p>

            <div className="flex gap-3 mt-4">
              {order.orderStatus === "processing" && (
                <button
                  onClick={() => shippedMutation.mutate(order._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Mark Shipped
                </button>
              )}

              {order.orderStatus === "shipped" && (
                <button
                  onClick={() => deliveredMutation.mutate(order._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <PackageCheck size={16} /> Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDashboard;