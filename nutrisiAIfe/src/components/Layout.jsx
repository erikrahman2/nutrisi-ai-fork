import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Heartbeat, SquaresFour, ChatCenteredText, Camera, User, SignOut, Notebook } from '@phosphor-icons/react';

export default function Layout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const navs = [
        { path: '/', icon: <SquaresFour size={24} />, label: 'Dashboard' },
        { path: '/journal', icon: <Notebook size={24} />, label: 'Jurnal Gizi' },
        { path: '/scan', icon: <Camera size={24} />, label: 'Scan Makanan' },
        { path: '/chat', icon: <ChatCenteredText size={24} />, label: 'Konsultasi AI' },
        { path: '/profile', icon: <User size={24} />, label: 'Profil Saya' },
    ];

    return (
        <div className="flex h-screen overflow-hidden text-slate-700 font-sans">
            <div className="fixed inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px]"></div>
            </div>

            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 hidden md:flex flex-col z-50 shadow-[0_8px_32px_rgba(31,38,135,0.07)]">
                <div className="h-24 flex items-center px-8 border-b border-slate-100/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Heartbeat size={24} weight="bold" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">Nutrisi<span className="text-blue-500">.AI</span></h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Medical Grade</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navs.map((n) => (
                        <button key={n.path} onClick={() => navigate(n.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
                                location.pathname === n.path 
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}>
                            {n.icon} {n.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100/50">
                     <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all">
                        <SignOut size={24} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                <header className="h-20 flex justify-between items-center px-6 md:px-10 z-40 sticky top-0 bg-white/65 backdrop-blur-md border-b border-slate-100/50">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            {navs.find(n => n.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="bg-white/50 px-4 py-2 rounded-full border border-white/60 text-xs font-bold text-slate-600 backdrop-blur-sm shadow-sm">
                            Hai, {user?.full_name || 'User'}
                         </div>
                    </div>
                </header>

               <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 relative z-10 scroll-smooth transform-gpu">
    <Outlet />
</div>
            </main>
        </div>
    );
}