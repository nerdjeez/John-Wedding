"use client";
import React, { useState, useEffect } from "react";
import { Check, Armchair, Table2, Plus, Minus, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Paket() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      // Pastikan backend jalan di port 3000
      const response = await fetch("http://localhost:3000/api/packages");
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setPackages(result.data);
        setError(null);
      } else {
        setError("Format data dari server tidak sesuai.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data. Pastikan Backend (Server) sudah dijalankan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-32 p-4 md:p-8 space-y-12 pb-20 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-primary font-serif tracking-tight">
            Pilihan Paket Spesial
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih paket impianmu untuk hari bahagia.
          </p>
        </div>

        {/* HANDLING STATE: LOADING & ERROR */}
        {loading && (
             <div className="text-center py-20">Loading...</div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-10 h-10" />
                <p className="font-bold">{error}</p>
                <Button variant="outline" onClick={fetchPackages}>Coba Lagi</Button>
            </div>
        )}

        {/* RENDER PAKET */}
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <PackageCard key={pkg.id} data={pkg} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

// Komponen PackageCard tetap sama 
function PackageCard({ data }) {
  const [chairs, setChairs] = useState(0);
  const [tables, setTables] = useState(0);

  // Fallback jika features null/undefined
  const featureString = data.features || "";
  const featureList = featureString.split(','); 

  const handleAddToCart = () => {
    const cartItem = {
        id: Date.now(), 
        packageId: data.id,
        name: data.name,
        image: data.image,
        basePrice: data.price,
        extras: []
    };
    
    if(chairs > 0) cartItem.extras.push({ name: `Kursi Tamu (${chairs}x)`, price: chairs * 25000 });
    if(tables > 0) cartItem.extras.push({ name: `Meja Bundar (${tables}x)`, price: tables * 100000 });

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existingCart, cartItem]));

    alert("Berhasil masuk keranjang!");
    // Paksa reload halaman keranjang jika perlu, atau redirect
    window.location.href = "/keranjang";
  };

  return (
      <Dialog>
        <Card className="flex flex-col h-full border-2 border-muted bg-card hover:border-primary/60 transition-all shadow-sm group">
          <div className="relative h-56 w-full overflow-hidden bg-muted">
             {/* Gunakan gambar placeholder jika error */}
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" 
                 onError={(e) => e.target.src = "https://placehold.co/600x400?text=Paket+Wedding"} />
          </div>
          <CardHeader>
            <CardTitle className="text-xl text-primary font-serif">{data.name}</CardTitle>
            <CardDescription className="line-clamp-2">{data.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(data.price)}
            </p>
            <ul className="space-y-1">
              {featureList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <DialogTrigger asChild>
              <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90">Pesan Sekarang</Button>
            </DialogTrigger>
          </CardFooter>
        </Card>

        {/* DIALOG CONTENT SAMA SEPERTI SEBELUMNYA... */}
        <DialogContent className="sm:max-w-[450px] bg-card border-primary/20">
            <DialogHeader>
                <DialogTitle>Kustomisasi {data.name}</DialogTitle>
                <DialogDescription>Tambah item jika diperlukan</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                 {/* Counter Logic Sama... */}
                 <div className="flex justify-between items-center bg-muted/20 p-2 rounded">
                    <Label>Kursi (Rp 25rb)</Label>
                    <Counter value={chairs} onChange={setChairs}/>
                 </div>
                 <div className="flex justify-between items-center bg-muted/20 p-2 rounded">
                    <Label>Meja (Rp 100rb)</Label>
                    <Counter value={tables} onChange={setTables}/>
                 </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                <Button onClick={handleAddToCart}>Masuk Keranjang</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

function Counter({ value, onChange }) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(Math.max(0, value - 1))}><Minus className="h-3 w-3" /></Button>
        <span className="w-8 text-center">{value}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(value + 1)}><Plus className="h-3 w-3" /></Button>
      </div>
    );
}