import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Belum Lengkap',
                text: 'Mohon isi email dan password.',
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'Oke',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }

        setLoading(true);

        try {
            const res = await login(email, password);
            setLoading(false);

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Masuk',
                    text: 'Selamat datang kembali!',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: { popup: 'rounded-3xl' }
                }).then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Masuk',
                    text: res.msg || 'Email atau password salah.',
                    confirmButtonText: 'Coba Lagi',
                    confirmButtonColor: '#ef4444',
                    customClass: { popup: 'rounded-3xl' }
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan koneksi.',
                confirmButtonColor: '#ef4444',
                customClass: { popup: 'rounded-3xl' }
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2670&auto=format&fit=crop" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 w-full max-w-md p-8 rounded-[2rem] shadow-2xl bg-white/30 backdrop-blur-md border border-white/40 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">
                        Nutrisi<span className="text-blue-600">.AI</span>
                    </h1>
                    <p className="text-slate-700 text-sm mt-2 font-semibold">Masuk untuk melanjutkan</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 transition-all text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 transition-all text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/40 transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "Masuk"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-800 font-medium">
                    Belum punya akun? <Link to="/register" className="text-blue-700 font-bold hover:text-blue-800 hover:underline transition-all">Daftar Sekarang</Link>
                </p>
            </div>
        </div>
    );
}