"use client";
import { useState } from 'react';
import { Trash2, Plus, Save, FileText } from 'lucide-react';

const MARKETPLACES = [
  { name: 'Tanpa Marketplace', fee: 0 },
  { name: 'Shopee', fee: 4 },
  { name: 'Tokopedia', fee: 3.5 },
  { name: 'TikTok Shop', fee: 4.5 },
];

export default function CalculatorForm({ onSave }: { onSave: (p: any) => void }) {
  const [nama, setNama] = useState("");
  const [qty, setQty] = useState(1);
  const [bahan, setBahan] = useState([{ name: '', price: 0 }]);
  const [selectedFee, setSelectedFee] = useState(0);
  const [margin, setMargin] = useState(30);

  const totalBahan = bahan.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const hppPerUnit = totalBahan / (qty || 1);
  const hargaJual = hppPerUnit / (1 - (margin / 100) - (selectedFee / 100));

  const addBahan = () => setBahan([...bahan, { name: '', price: 0 }]);
  const removeBahan = (idx: number) => setBahan(bahan.filter((_, i) => i !== idx));
  const updateBahan = (idx: number, field: string, value: any) => {
    const newBahan = [...bahan];
    newBahan[idx] = { ...newBahan[idx], [field]: value };
    setBahan(newBahan);
  };

  const handleSave = () => {
    onSave({
      id: Date.now(),
      nama,
      hpp: hppPerUnit,
      hargaJual,
      margin,
      adminFee: selectedFee,
      tanggal: new Date().toLocaleDateString('id-ID')
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="space-y-4">
        <input 
          placeholder="Nama Produk" 
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setNama(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Jumlah per produksi (pcs)" 
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setQty(Number(e.target.value))}
        />
        
        <div>
          <label className="text-sm font-medium">Bahan Baku</label>
          {bahan.map((item, idx) => (
            <div key={idx} className="flex gap-2 mt-2">
              <input 
                placeholder="Nama Bahan" 
                className="p-2 border rounded-md flex-1"
                onChange={(e) => updateBahan(idx, 'name', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Harga" 
                className="p-2 border rounded-md w-24"
                onChange={(e) => updateBahan(idx, 'price', e.target.value)}
              />
              <button onClick={() => removeBahan(idx)} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
          <button onClick={addBahan} className="mt-2 text-blue-600 flex items-center gap-1 text-sm"><Plus size={16}/> Tambah Bahan</button>
        </div>

        <div>
          <label className="text-sm font-medium">Platform Jualan</label>
          <select className="w-full p-2 border rounded-lg" onChange={(e) => setSelectedFee(Number(e.target.value))}>
            {MARKETPLACES.map(m => <option key={m.name} value={m.fee}>{m.name} ({m.fee}%)</option>)}
          </select>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl mt-4">
          <p className="text-sm">Harga Jual Rekomendasi:</p>
          <p className="text-2xl font-bold text-green-600">Rp {Math.ceil(hargaJual).toLocaleString()}</p>
        </div>

        <button onClick={handleSave} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2">
          <Save size={20} /> Simpan Produk
        </button>
      </div>
    </div>
  );
}
