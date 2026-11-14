"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, User, Plus, Search, Trash2, Edit2, Copy, Download } from 'lucide-react';

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

  const fetchProducts = async (userId?: string) => {
    setLoading(true);
    if (userId) {
      const { data } = await supabase.from('products').select('*').eq('user_id', userId);
      setProdukList(data || []);
    } else {
      const local = localStorage.getItem('produk_umkm');
      setProdukList(local ? JSON.parse(local) : []);
    }
    setLoading(false);
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
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <LogIn size={16} /> Login
          </button>
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
        {produkList.map((p) => (
          <div key={p.id} className="border-b py-3 flex justify-between">
            <span>{p.nama}</span>
            <div className="flex gap-2">
                <button className="text-blue-500"><Edit2 size={16}/></button>
                <button className="text-red-500"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center text-slate-400 text-xs mt-10">
        © {new Date().getFullYear()} Created by Golden Chandra
      </footer>
    </main>
  );
}
