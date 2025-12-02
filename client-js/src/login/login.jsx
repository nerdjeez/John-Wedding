import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State untuk pesan error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrorMessage(""); // Hapus error saat user mengetik ulang
  };

  const handleLogin = async () => {
    // Validasi kosong
    if (!formData.email || !formData.password) {
        setErrorMessage("Email dan Password harus diisi!");
        return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();

// ... di dalam handleLogin ...

      if (result.success) {
        // Simpan User
        localStorage.setItem("user", JSON.stringify(result.user));
        
        alert(`Login Berhasil! Selamat datang, ${result.user.name}`);
        
        if (result.user.role === "admin") {
            window.location.href = "/admin";
        } else {
            window.location.href = "/"; 
        }
        
      } else {
        setErrorMessage(result.message || "Login gagal.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal terhubung ke server backend. Pastikan server nyala!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <Card className="w-full max-w-md border-primary/30 bg-card/90 backdrop-blur-sm shadow-2xl z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <HeartHandshake className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-primary">Selamat Datang Kembali</CardTitle>
          <CardDescription>Masuk untuk melihat pesanan wedding Anda</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* NOTIFIKASI ERROR (Merah) */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="nama@email.com" 
                    className="pl-10 border-primary/20 focus-visible:ring-primary" 
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                    className="pl-10 border-primary/20 focus-visible:ring-primary" 
                />
            </div>
          </div>

          <Button onClick={handleLogin} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11">
            {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
            ) : (
                <>Masuk <ArrowRight className="ml-2 w-4 h-4" /></>
            )}
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline">Daftar Sekarang</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}