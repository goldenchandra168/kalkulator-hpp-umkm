"use client";
import { useState, useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';

export default function Home() {
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('produk_umkm');
    if (saved) setProdukList(JSON.parse(saved));
  }, []);

  const handleSave = (newProduct: any) => {
    const updated = [...produkList, newProduct];
    setProdukList(updated);
    localStorage.setItem('produk_umkm', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Kalkulator HPP UMKM</h1>
        <p className="text-center text-slate-500 mb-8">Jualan untung, tenang berbisnis.</p>

        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-lg">Produk Anda</h2>
          {produkList.map((p: any) => (
            <div key={p.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.nama}</p>
                <p className="text-sm text-green-600 font-medium">Jual: Rp {Math.ceil(p.hargaJual).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <CalculatorForm onSave={handleSave} />
      </div>
    </main>
  );
}
