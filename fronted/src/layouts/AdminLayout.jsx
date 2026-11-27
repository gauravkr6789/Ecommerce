import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="min-h-screen lg:pl-64">
        <AdminNavbar setOpen={setOpen} />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
