import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) navigate('/');
        else alert(res.msg);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm -z-10"></div>
            <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800">Nutrisi<span className="text-primary-500">.AI</span></h1>
                    <p className="text-slate-500">Masuk untuk melanjutkan</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition shadow-lg">Masuk</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                    Belum punya akun? <Link to="/register" className="text-primary-600 font-bold hover:underline">Daftar</Link>
                </p>
            </div>
        </div>
    );
}