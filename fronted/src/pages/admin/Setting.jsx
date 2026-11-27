import { useState } from "react";
import { toast } from "react-toastify";

const Settings = () => {
  const [form, setForm] = useState({
    name: "Admin User",
    email: "admin@example.com",
    store: "My E-commerce Store",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("Settings are currently demo-only.");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your admin profile and store information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        {[
          { name: "name", label: "Admin Name" },
          { name: "email", label: "Email Address" },
          { name: "store", label: "Store Name" },
        ].map((field) => (
          <div key={field.name}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>
        ))}

        <button className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
