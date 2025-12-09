import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        full_name: '', email: '', password: '',
        gender: 'male', weight_kg: '', height_cm: '', date_of_birth: ''
    });
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(
            form.full_name, form.email, form.password, 
            { 
                gender: form.gender,
                weight_kg: Number(form.weight_kg),
                height_cm: Number(form.height_cm),
                date_of_birth: form.date_of_birth
            }
        );
        
        if (res.success) {
            alert('Registrasi Berhasil! Silakan Login.');
            navigate('/login');
        } else {
            alert(res.msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl">
                <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Buat Akun Baru</h1>
                <p className="text-xs text-center text-slate-500 mb-6">Langkah {step} dari 2</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 ? (
                        <>
                            <input type="text" placeholder="Nama Lengkap" onChange={e=>setForm({...form, full_name:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="email" placeholder="Email" onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none focus:ring-2 focus:ring-blue-500" required />
                            <input type="password" placeholder="Password" onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none focus:ring-2 focus:ring-blue-500" required />
                            <button type="button" onClick={()=>setStep(2)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 mt-4 shadow-lg">Lanjut</button>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-4">
                                <select onChange={e=>setForm({...form, gender:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none">
                                    <option value="male">Pria</option>
                                    <option value="female">Wanita</option>
                                </select>
                                <input type="date" onChange={e=>setForm({...form, date_of_birth:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none" required />
                            </div>
                            <div className="flex gap-4">
                                <input type="number" placeholder="Berat (kg)" onChange={e=>setForm({...form, weight_kg:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none" required />
                                <input type="number" placeholder="Tinggi (cm)" onChange={e=>setForm({...form, height_cm:e.target.value})} className="w-full p-3 rounded-xl bg-white/50 border border-white outline-none" required />
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                                <button type="button" onClick={()=>setStep(1)} className="flex-1 py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300">Kembali</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">Daftar</button>
                            </div>
                        </>
                    )}
                </form>
                <p className="mt-4 text-center text-sm text-slate-500">Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link></p>
            </div>
        </div>
    );
}