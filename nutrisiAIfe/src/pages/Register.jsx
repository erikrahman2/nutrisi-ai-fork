import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: '', email: '', password: '',
        gender: 'male', weight_kg: '', height_cm: '', date_of_birth: ''
    });
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNextStep = () => {
        if (!form.full_name || !form.email || !form.password) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Belum Lengkap',
                text: 'Mohon isi Nama, Email, dan Password terlebih dahulu.',
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'Oke',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.weight_kg || !form.height_cm || !form.date_of_birth) {
            setLoading(false);
            Swal.fire({
                icon: 'warning',
                title: 'Lengkapi Data Fisik',
                text: 'Data berat, tinggi, dan tanggal lahir diperlukan.',
                confirmButtonColor: '#2563eb',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }

        try {
            const res = await register(
                form.full_name, form.email, form.password, 
                { 
                    gender: form.gender,
                    weight_kg: Number(form.weight_kg),
                    height_cm: Number(form.height_cm),
                    date_of_birth: form.date_of_birth
                }
            );
            
            setLoading(false);

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registrasi Berhasil!',
                    text: 'Akun Anda telah dibuat. Silakan login.',
                    confirmButtonText: 'Login Sekarang',
                    confirmButtonColor: '#2563eb',
                    allowOutsideClick: false,
                    customClass: { popup: 'rounded-3xl' }
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mendaftar',
                    text: res.msg || 'Terjadi kesalahan pada sistem.',
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
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">
                        Nutrisi<span className="text-blue-600">.AI</span>
                    </h1>
                    <p className="text-slate-700 text-sm mt-2 font-semibold">Buat akun baru</p>
                </div>

                <div className="flex gap-2 mb-8 justify-center">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-400/50'}`}></div>
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-400/50'}`}></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {step === 1 ? (
                        <div className="space-y-5 animate-slide-up">
                            <input 
                                type="text" 
                                placeholder="Nama Lengkap" 
                                value={form.full_name}
                                onChange={e=>setForm({...form, full_name:e.target.value})} 
                                className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 transition-all text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={form.email}
                                onChange={e=>setForm({...form, email:e.target.value})} 
                                className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 transition-all text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={form.password}
                                onChange={e=>setForm({...form, password:e.target.value})} 
                                className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 transition-all text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                            />
                            <button 
                                type="button" 
                                onClick={handleNextStep} 
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/40 transition-all transform active:scale-[0.98]"
                            >
                                Lanjut
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-slide-up">
                            <div className="flex gap-4">
                                <select 
                                    value={form.gender}
                                    onChange={e=>setForm({...form, gender:e.target.value})} 
                                    className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 text-slate-800 font-medium backdrop-blur-sm appearance-none"
                                >
                                    <option value="male">Pria</option>
                                    <option value="female">Wanita</option>
                                </select>
                                <input 
                                    type="date" 
                                    value={form.date_of_birth}
                                    onChange={e=>setForm({...form, date_of_birth:e.target.value})} 
                                    className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 text-slate-800 font-medium backdrop-blur-sm" 
                                />
                            </div>
                            <div className="flex gap-4">
                                <input 
                                    type="number" 
                                    placeholder="Berat (kg)" 
                                    value={form.weight_kg}
                                    onChange={e=>setForm({...form, weight_kg:e.target.value})} 
                                    className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                                />
                                <input 
                                    type="number" 
                                    placeholder="Tinggi (cm)" 
                                    value={form.height_cm}
                                    onChange={e=>setForm({...form, height_cm:e.target.value})} 
                                    className="w-full p-4 rounded-xl bg-white/60 border border-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 text-slate-800 placeholder-slate-500 font-medium backdrop-blur-sm" 
                                />
                            </div>
                            
                            <div className="flex gap-3 mt-2">
                                <button 
                                    type="button" 
                                    onClick={()=>setStep(1)} 
                                    className="flex-1 py-4 bg-white/50 text-slate-700 font-bold rounded-xl hover:bg-white/70 transition-all backdrop-blur-sm border border-white/20"
                                >
                                    Kembali
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/40 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Daftar"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <p className="mt-8 text-center text-sm text-slate-800 font-medium">
                    Sudah punya akun? <Link to="/login" className="text-blue-700 font-bold hover:text-blue-800 hover:underline transition-all">Masuk</Link>
                </p>
            </div>
        </div>
    );
}