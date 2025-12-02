import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Users, DollarSign, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 1. Ambil User Admin dari LocalStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    // Proteksi Halaman
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      alert("ANDA BUKAN ADMIN!");
      navigate("/");
      return;
    }

    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/orders?userId=${user.id}`);
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI UPDATE STATUS (Terima) ---
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`)) return;
    setProcessingId(orderId);

    try {
      const res = await fetch(`http://localhost:3000/api/admin/orders/${orderId}/status?userId=${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await res.json();
      if (result.success) {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const fmt = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  if (loading) return <div className="p-10 text-center">Memuat data...</div>;

  // --- FUNGSI DELETE (Tolak & Hapus Permanen) ---
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Yakin ingin MENOLAK & MENGHAPUS permanen pesanan ini? Data tidak bisa kembali.")) return;
    setProcessingId(orderId);

    try {
      const res = await fetch(`http://localhost:3000/api/admin/orders/${orderId}?userId=${user.id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (result.success) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        alert("Pesanan dihapus permanen.");
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error koneksi.", error);
      alert("error detail : " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-blue-600" /> 
                Admin Dashboard
            </h1>
            <p className="text-slate-500">Halo, {user?.name}. Pantau pesanan kamu di sini.</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      {/* Statistik (3 KOTAK) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{orders.length}</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Omzet (Lunas)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">
                    {/* Hanya hitung yang statusnya 'paid' */}
                    {fmt(orders.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.totalPrice, 0))}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perlu Konfirmasi</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.status === 'pending').length}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Tabel Data Pesanan */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                    <th className="p-4 border-b">ID</th>
                    <th className="p-4 border-b">Pelanggan</th>
                    <th className="p-4 border-b">Paket</th>
                    <th className="p-4 border-b">Total</th>
                    <th className="p-4 border-b text-center">Status</th>
                    <th className="p-4 border-b text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-sm text-slate-500">#{order.id}</td>
                        <td className="p-4 font-semibold text-slate-800">
                            {order.user.name}
                            <div className="text-xs text-slate-400 font-normal">{order.user.email}</div>
                        </td>
                        <td className="p-4 text-sm">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <span className="font-medium text-primary">{item.package.name}</span>
                                    {item.extras && item.extras.length > 5 && (
                                        <span className="text-xs text-slate-500 italic">
                                            + {JSON.parse(item.extras).detail?.length || 0} Tambahan
                                        </span>
                                    )}
                                </div>
                            ))}
                        </td>
                        <td className="p-4 font-bold text-slate-700">{fmt(order.totalPrice)}</td>
                        
                        {/* Kolom Status */}
                        <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                order.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' :
                                order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {order.status.toLowerCase() === 'paid' ? 'Terkonfirmasi' : 
                                 order.status.toLowerCase() === 'cancelled' ? 'Batal' : 'Pending'}
                            </span>
                        </td>

                        {/* Kolom Aksi */}
                        <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                                
                                {/* Tombol TERIMA: Hanya muncul jika status PENDING */}
                                {order.status.toLowerCase() === 'pending' && (
                                    <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                                        onClick={() => handleUpdateStatus(order.id, 'paid')}
                                        disabled={processingId === order.id}
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" /> Terima
                                    </Button>
                                )}

                                {/* Tombol TOLAK: Muncul jika PENDING atau SUDAH TERKONFIRMASI (paid) */}
                                {(order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'paid') && (
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
                                        className="h-8 text-xs"
                                        onClick={() => handleDeleteOrder(order.id)}
                                        disabled={processingId === order.id}
                                        title="Hapus / Batalkan Pesanan"
                                    >
                                        <XCircle className="w-3 h-3 mr-1" /> Tolak
                                    </Button>
                                )}

                                {/* Tombol HAPUS: Muncul jika status BATAL (Clean up) */}
                                {order.status.toLowerCase() === 'cancelled' && (
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDeleteOrder(order.id)}
                                        disabled={processingId === order.id}
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" /> Hapus
                                    </Button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {orders.length === 0 && (
            <div className="p-10 text-center text-slate-500">Belum ada pesanan masuk.</div>
        )}
      </div>
    </div>
  );
}