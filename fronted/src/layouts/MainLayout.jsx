import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar"
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;