const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-green-50 text-green-700",
    Success: "bg-green-50 text-green-700",
    Active: "bg-green-50 text-green-700",
    Available: "bg-green-50 text-green-700",

    Processing: "bg-blue-50 text-blue-700",
    Approved: "bg-blue-50 text-blue-700",

    Pending: "bg-amber-50 text-amber-700",
    Busy: "bg-amber-50 text-amber-700",

    Cancelled: "bg-red-50 text-red-700",
    Expired: "bg-red-50 text-red-700",
    Inactive: "bg-gray-100 text-gray-600",
    "Out of Stock": "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
