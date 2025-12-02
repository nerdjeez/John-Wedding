import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./homepage/menu.jsx"; 
import Paket from "./paket/paket.jsx";
import FloatingNavbar from "@/components/FloatingNavbar";
import Keranjang from "./keranjang/keranjang.jsx";
import Login from "./login/login.jsx";
import Register from "./login/register/Register.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx"; 

function MainLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <FloatingNavbar />}

      <main className="w-full min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paket" element={<Paket />} />
          <Route path="/keranjang" element={<Keranjang/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}