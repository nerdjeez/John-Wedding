import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Tambah useNavigate untuk redirect
import { HeartHandshake, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const navigate = useNavigate();
  // 1. STATE: Untuk menampung inputan user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  // 2. HANDLER: Mengubah state saat user mengetik
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // 3. FUNGSI SUBMIT: Mengirim data ke Backend
  const handleRegister = async () => {
    // Validasi sederhana
    if (!formData.name || !formData.email || !formData.password) {
      alert("Mohon isi semua data!");
      return;
    }

    setLoading(true);
    try {
      // Kirim ke Backend (Pastikan backend jalan di port 3000)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert("Registrasi Berhasil! Silakan Login.");
        navigate("/login"); // Pindah ke halaman login
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-primary/30 bg-card/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <HeartHandshake className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-primary">Buat Akun Baru</CardTitle>
          <CardDescription>
            Bergabunglah untuk merencanakan pernikahan impian
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          
          {/* Input Nama */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="pl-10 border-primary/20 focus-visible:ring-primary"
                  // Integrasi State
                  value={formData.name}
                  onChange={handleChange}
                />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  className="pl-10 border-primary/20 focus-visible:ring-primary"
                  // Integrasi State
                  value={formData.email}
                  onChange={handleChange}
                />
            </div>
          </div>
          
          {/* Input Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 border-primary/20 focus-visible:ring-primary"
                  // Integrasi State
                  value={formData.password}
                  onChange={handleChange}
                />
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 mt-2"
            onClick={handleRegister} // Panggil fungsi saat diklik
            disabled={loading} // Matikan tombol saat loading
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Masuk disini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}