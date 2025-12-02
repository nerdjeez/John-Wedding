import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Package, CreditCard, AlertCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose
} from "@/components/ui/dialog";

export default function Keranjang() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const handleDelete = (idToDelete) => {
    const updatedCart = cartItems.filter((item) => item.id !== idToDelete);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((acc, item) => {
        const extrasList = item.extras?.detail || item.extras || [];
        const extrasTotal = extrasList.reduce((sum, extra) => sum + extra.price, 0);
        return acc + item.basePrice + extrasTotal;
    }, 0);
    return { subtotal, tax: subtotal * 0.11, total: subtotal * 1.11 };
  };

  const { subtotal, tax, total } = calculateTotal();
  const fmt = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  const handleInitCheckout = () => {
    const user = localStorage.getItem("user");
    if (!user) {
        alert("Silakan Login dulu!");
        navigate("/login");
        return;
    }
    setIsConfirmOpen(true);
  };

  const processOrder = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const orderData = {
        userId: user.id,
        total: total,
        items: cartItems.map(item => ({
            packageId: item.packageId,
            price: item.basePrice,
            extras: { detail: item.extras }
        }))
    };

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });
        const result = await res.json();
        if (result.success) {
            localStorage.removeItem("cart");
            setCartItems([]);
            setIsConfirmOpen(false);
            alert(`Sukses! Order ID: ${result.orderId}`);
            navigate("/");
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (e) {
        alert("Error koneksi server");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* === KOLOM KIRI: LIST BARANG === */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-foreground">Keranjang Anda</h1>
          </div>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Card key={item.id} className="group flex flex-col sm:flex-row overflow-hidden border-border bg-card hover:border-primary/50 transition-all">
                
                {/* 1. Gambar (Ukuran tetap agar rapi) */}
                <div className="w-full sm:w-48 h-48 bg-muted shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" 
                       onError={(e) => e.target.src = "https://placehold.co/400"} />
                </div>
                
                {/* 2. Konten */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-bold font-serif text-primary leading-tight">{item.name}</h3>
                        <span className="font-bold text-foreground whitespace-nowrap">{fmt(item.basePrice)}</span>
                    </div>
                    
                    {/* List Extras */}
                    {(item.extras?.length > 0 || item.extras?.detail?.length > 0) && (
                        <div className="mt-3 text-sm text-muted-foreground bg-muted/30 p-2 rounded border border-border/50">
                            <p className="font-semibold text-xs uppercase tracking-wider mb-1 opacity-70">Add-ons:</p>
                            {(item.extras.detail || item.extras).map((ex, idx) => (
                                <div key={idx} className="flex justify-between text-xs sm:text-sm">
                                    <span>+ {ex.name}</span>
                                    <span>{fmt(ex.price)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>

                  {/* 3. Tombol Action (Dirombak CSS-nya agar jelas) */}
                  <div className="flex justify-end mt-4 pt-4 border-t border-border/40">
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        className="hover:bg-red-600 transition-colors cursor-pointer z-10"
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus Item
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/30">
                <p className="text-muted-foreground mb-4">Keranjang kosong, ayo pilih paket dulu.</p>
                <Button onClick={() => navigate("/paket")}>Lihat Paket</Button>
            </div>
          )}
        </div>

        {/* === KOLOM KANAN: RINGKASAN HARGA (Sticky) === */}
        <div className="md:col-span-1">
            <Card className="sticky top-32 border-primary bg-card shadow-xl z-20">
                <CardHeader className="bg-primary/10 border-b border-primary/10 pb-4">
                    <CardTitle className="text-primary font-serif">Rincian Biaya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pajak (11%)</span>
                        <span>{fmt(tax)}</span>
                    </div>
                    <Separator className="my-2 bg-border" />
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total Bayar</span>
                        <span className="font-bold text-xl text-primary">{fmt(total)}</span>
                    </div>
                </CardContent>
                <CardFooter className="pb-6">
                    <Button 
                        onClick={handleInitCheckout} 
                        disabled={cartItems.length === 0}
                        className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    >
                        <CreditCard className="w-5 h-5 mr-2" /> Checkout
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>

      {/* DIALOG KONFIRMASI */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary">Konfirmasi Checkout</DialogTitle>
            <DialogDescription>
              Total tagihan Anda adalah <span className="font-bold text-foreground">{fmt(total)}</span>. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={processOrder} disabled={loading}>
                {loading ? "Memproses..." : "Ya, Bayar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}