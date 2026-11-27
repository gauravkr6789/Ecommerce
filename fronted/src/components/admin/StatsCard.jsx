import { FaUsers, FaBox, FaShoppingCart, FaRupeeSign } from "react-icons/fa";

const StatCard = ({ title, value, icon: Icon, color, loading = false }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
            {loading ? "Loading..." : (value ?? 0)}
          </h2>
        </div>

        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="text-xl text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
