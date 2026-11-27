
export const dashboardStats = [
  {
    title: "Total Revenue",
    value: "₹8,45,250",
    change: "+12.8%",
    icon: "IndianRupee",
    color: "blue",
  },
  {
    title: "Total Orders",
    value: "1,284",
    change: "+8.2%",
    icon: "ShoppingBag",
    color: "purple",
  },
  {
    title: "Total Customers",
    value: "3,642",
    change: "+15.4%",
    icon: "Users",
    color: "green",
  },
  {
    title: "Pending Orders",
    value: "28",
    change: "-4.5%",
    icon: "Clock",
    color: "orange",
  },
];

export const salesData = [
  { month: "Jan", revenue: 45000, orders: 120 },
  { month: "Feb", revenue: 62000, orders: 150 },
  { month: "Mar", revenue: 55000, orders: 140 },
  { month: "Apr", revenue: 85000, orders: 210 },
  { month: "May", revenue: 72000, orders: 180 },
  { month: "Jun", revenue: 95000, orders: 250 },
  { month: "Jul", revenue: 110000, orders: 290 },
  { month: "Aug", revenue: 90000, orders: 230 },
  { month: "Sep", revenue: 125000, orders: 320 },
  { month: "Oct", revenue: 115000, orders: 300 },
  { month: "Nov", revenue: 140000, orders: 360 },
  { month: "Dec", revenue: 160000, orders: 410 },
];

export const recentOrders = [
  {
    id: "ORD-2026-001",
    customer: "Rahul Sharma",
    email: "rahul@gmail.com",
    date: "27 Nov 2026",
    amount: 12999,
    status: "Delivered",
  },
  {
    id: "ORD-2026-002",
    customer: "Priya Verma",
    email: "priya@gmail.com",
    date: "26 Nov 2026",
    amount: 8499,
    status: "Processing",
  },
  {
    id: "ORD-2026-003",
    customer: "Aman Gupta",
    email: "aman@gmail.com",
    date: "26 Nov 2026",
    amount: 24999,
    status: "Pending",
  },
  {
    id: "ORD-2026-004",
    customer: "Sneha Singh",
    email: "sneha@gmail.com",
    date: "25 Nov 2026",
    amount: 4599,
    status: "Cancelled",
  },
  {
    id: "ORD-2026-005",
    customer: "Vikash Kumar",
    email: "vikash@gmail.com",
    date: "25 Nov 2026",
    amount: 15999,
    status: "Delivered",
  },
];

export const mockProducts = [
  {
    id: "P001",
    name: "Apple iPhone 16",
    category: "Electronics",
    price: 79999,
    stock: 24,
    status: "Active",
  },
  {
    id: "P002",
    name: "Samsung Galaxy S25",
    category: "Electronics",
    price: 69999,
    stock: 15,
    status: "Active",
  },
  {
    id: "P003",
    name: "Sony Wireless Headphones",
    category: "Accessories",
    price: 8999,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "P004",
    name: "Nike Air Max",
    category: "Fashion",
    price: 5999,
    stock: 42,
    status: "Active",
  },
  {
    id: "P005",
    name: "Smart Watch Pro",
    category: "Accessories",
    price: 4999,
    stock: 8,
    status: "Active",
  },
];

export const mockCustomers = [
  {
    id: "C001",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    orders: 12,
    spent: 45000,
    status: "Active",
  },
  {
    id: "C002",
    name: "Priya Verma",
    email: "priya@gmail.com",
    orders: 8,
    spent: 28500,
    status: "Active",
  },
  {
    id: "C003",
    name: "Aman Gupta",
    email: "aman@gmail.com",
    orders: 3,
    spent: 12000,
    status: "Active",
  },
  {
    id: "C004",
    name: "Sneha Singh",
    email: "sneha@gmail.com",
    orders: 15,
    spent: 72000,
    status: "Inactive",
  },
];

export const mockCoupons = [
  {
    id: "CP001",
    code: "WELCOME20",
    discount: "20%",
    type: "Percentage",
    usage: 120,
    expiry: "31 Dec 2026",
    status: "Active",
  },
  {
    id: "CP002",
    code: "SAVE500",
    discount: "₹500",
    type: "Fixed",
    usage: 85,
    expiry: "15 Dec 2026",
    status: "Active",
  },
  {
    id: "CP003",
    code: "FESTIVE10",
    discount: "10%",
    type: "Percentage",
    usage: 250,
    expiry: "01 Nov 2026",
    status: "Expired",
  },
];

export const mockPayments = [
  {
    id: "PAY001",
    orderId: "ORD-2026-001",
    customer: "Rahul Sharma",
    method: "Razorpay",
    amount: 12999,
    status: "Success",
  },
  {
    id: "PAY002",
    orderId: "ORD-2026-002",
    customer: "Priya Verma",
    method: "UPI",
    amount: 8499,
    status: "Success",
  },
  {
    id: "PAY003",
    orderId: "ORD-2026-003",
    customer: "Aman Gupta",
    method: "Card",
    amount: 24999,
    status: "Pending",
  },
];

export const mockRefunds = [
  {
    id: "REF001",
    orderId: "ORD-2026-010",
    customer: "Rohit",
    amount: 2999,
    reason: "Product damaged",
    status: "Pending",
  },
  {
    id: "REF002",
    orderId: "ORD-2026-011",
    customer: "Neha",
    amount: 4999,
    reason: "Wrong product",
    status: "Approved",
  },
];

export const mockDeliveryPartners = [
  {
    id: "D001",
    name: "Ramesh Kumar",
    phone: "9876543210",
    deliveries: 45,
    status: "Available",
  },
  {
    id: "D002",
    name: "Suresh Yadav",
    phone: "9876543211",
    deliveries: 32,
    status: "Busy",
  },
  {
    id: "D003",
    name: "Mohit Singh",
    phone: "9876543212",
    deliveries: 58,
    status: "Available",
  },
];

export const mockActivities = [
  "New order ORD-2026-001 received",
  "Payment received for ORD-2026-002",
  "New customer registered",
  "Refund request REF001 created",
];
