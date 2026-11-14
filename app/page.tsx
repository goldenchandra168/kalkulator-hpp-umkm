"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, User, Plus, Search, Trash2, Edit2, Copy, Download } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [produkList, setProdukList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      fetchProducts(data.session?.user?.id);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      fetchProducts(session?.user?.id);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleDelete = async (indexOrId: any) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    if (user) {
      await supabase.from('products').delete().eq('id', indexOrId);
    } else {
      const updated = produkList.filter((_, idx) => (produkList[idx].id ? produkList[idx].id !== indexOrId : idx !== indexOrId));
      setProdukList(updated);
      localStorage.setItem('produk_umkm', JSON.stringify(updated));
    }
    fetchProducts(user?.id);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-xl font-bold">Kalkulator HPP UMKM</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-red-500 text-sm">Logout</button>
          </div>
        ) : (
          <Link href="/auth" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <LogIn size={16} /> Login
          </Link>
        )}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border">Total Produk: {produkList.length}</div>
        <div className="bg-white p-6 rounded-xl border">Analisis Margin: 0%</div>
        <div className="bg-white p-6 rounded-xl border">Mode: {user ? 'Cloud' : 'Demo Tamu'}</div>
      </section>

      <div className="bg-white p-6 rounded-xl border">
        <div className="flex justify-between mb-4">
            <h2 className="font-bold">Database Produk</h2>
            <button className="flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1 rounded"><Plus size={16}/> Baru</button>
        </div>
        {produkList.length > 0 ? (
          produkList.map((p, index) => (
            <div key={p.id || index} className="border-b py-3 flex justify-between items-center bg-white px-2">
              <span className="font-medium text-slate-700">{p.nama || "Produk Tanpa Nama"}</span>
              <div className="flex gap-4">
                  <a 
                    href="https://invoice-app-two-delta.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Buat Invoice"
                  >
                    <Download size={20}/>
                  </a>
                  <button 
                    onClick={() => handleDelete(p.id || index)} 
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Hapus Produk"
                  >
                    <Trash2 size={20}/>
                  </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 py-4">Belum ada produk. Silakan tambah produk baru.</p>
        )}
      </div>

      <footer className="text-center text-slate-400 text-xs mt-10">
        © {new Date().getFullYear()} Created by Golden Chandra
      </footer>
    </main>
  );
}
