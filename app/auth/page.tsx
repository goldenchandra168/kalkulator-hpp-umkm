"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Cek email Anda untuk konfirmasi (jika diperlukan)!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login UMKM' : 'Daftar Akun'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input 
          type="email" placeholder="Email" required 
          className="w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" required 
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
        >
          {loading ? 'Memproses...' : (isLogin ? 'Login' : 'Daftar')}
        </button>
      </form>
      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-sm text-slate-500"
      >
        {isLogin ? 'Belum punya akun? Daftar sekarang' : 'Sudah punya akun? Login'}
      </button>
    </div>
  );
}
