import ManagementPage from "../components/ManagementPage";

import {
  mockProducts,
  recentOrders,
  mockCustomers,
  mockCoupons,
  mockPayments,
  mockRefunds,
  mockDeliveryPartners,
} from "../data/mockData";

const currency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export const Products = () => (
  <ManagementPage
    title="Products"
    description="Manage your product inventory and catalog."
    addLabel="Add Product"
    initialData={mockProducts}
    searchFields={["name", "category", "id"]}
    columns={[
      { key: "id", label: "Product ID" },
      { key: "name", label: "Product Name" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price", render: currency },
      { key: "stock", label: "Stock" },
    ]}
  />
);

export const Orders = () => (
  <ManagementPage
    title="Orders"
    description="View and manage customer orders."
    addLabel="Orders Overview"
    initialData={recentOrders}
    searchFields={["id", "customer", "email"]}
    columns={[
      { key: "id", label: "Order ID" },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Date" },
      { key: "amount", label: "Amount", render: currency },
    ]}
  />
);

export const Customers = () => (
  <ManagementPage
    title="Customers"
    description="Manage registered customers."
    initialData={mockCustomers}
    searchFields={["name", "email", "id"]}
    columns={[
      { key: "id", label: "Customer ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "orders", label: "Orders" },
      { key: "spent", label: "Total Spent", render: currency },
    ]}
  />
);

export const Coupons = () => (
  <ManagementPage
    title="Coupons"
    description="Manage discount codes and promotions."
    addLabel="Create Coupon"
    initialData={mockCoupons}
    searchFields={["code", "type"]}
    columns={[
      { key: "code", label: "Coupon Code" },
      { key: "discount", label: "Discount" },
      { key: "type", label: "Type" },
      { key: "usage", label: "Usage" },
      { key: "expiry", label: "Expiry" },
    ]}
  />
);

export const Payments = () => (
  <ManagementPage
    title="Payments"
    description="Monitor transactions and payment records."
    initialData={mockPayments}
    searchFields={["id", "orderId", "customer", "method"]}
    columns={[
      { key: "id", label: "Payment ID" },
      { key: "orderId", label: "Order ID" },
      { key: "customer", label: "Customer" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", render: currency },
    ]}
  />
);

export const Refunds = () => (
  <ManagementPage
    title="Refund Management"
    description="Review and manage refund requests."
    initialData={mockRefunds}
    searchFields={["id", "orderId", "customer", "reason"]}
    columns={[
      { key: "id", label: "Refund ID" },
      { key: "orderId", label: "Order ID" },
      { key: "customer", label: "Customer" },
      { key: "amount", label: "Amount", render: currency },
      { key: "reason", label: "Reason" },
    ]}
  />
);

export const Delivery = () => (
  <ManagementPage
    title="Delivery Partners"
    description="Monitor your delivery team."
    addLabel="Add Partner"
    initialData={mockDeliveryPartners}
    searchFields={["id", "name", "phone"]}
    columns={[
      { key: "id", label: "Partner ID" },
      { key: "name", label: "Partner Name" },
      { key: "phone", label: "Phone" },
      { key: "deliveries", label: "Deliveries" },
    ]}
  />
);
