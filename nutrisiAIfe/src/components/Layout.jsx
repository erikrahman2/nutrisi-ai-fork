import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Heartbeat, SquaresFour, ChatCenteredText, Camera, User, SignOut, Notebook } from '@phosphor-icons/react';

export default function Layout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const navs = [
        { path: '/', icon: SquaresFour, label: 'Home' },
        { path: '/journal', icon: Notebook, label: 'Jurnal' },
        { path: '/scan', icon: Camera, label: 'Scan', isMain: true },
        { path: '/chat', icon: ChatCenteredText, label: 'Chat' },
        { path: '/profile', icon: User, label: 'Profil' },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden text-slate-700 font-sans bg-slate-50">
            <div className="fixed inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2000&auto=format&fit=crop"
                    alt="bg"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px]"></div>
            </div>

            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 hidden md:flex flex-col z-50 shadow-[0_8px_32px_rgba(31,38,135,0.07)] relative">
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
                    {navs.filter(n => !n.isMain).map((n) => (
                        <button key={n.path} onClick={() => navigate(n.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
                                location.pathname === n.path 
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}>
                            <n.icon size={24} /> {n.label === 'Home' ? 'Dashboard' : n.label === 'Jurnal' ? 'Jurnal Gizi' : n.label === 'Chat' ? 'Konsultasi AI' : 'Profil Saya'}
                        </button>
                    ))}
                     <button onClick={() => navigate('/scan')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
                            location.pathname === '/scan' 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}>
                        <Camera size={24} /> Scan Makanan
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-100/50">
                     <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all">
                        <SignOut size={24} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                <header className="h-20 flex-shrink-0 flex justify-between items-center px-6 md:px-10 z-40 bg-white/65 backdrop-blur-md border-b border-slate-100/50">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            {location.pathname === '/' ? 'Dashboard' : 
                             location.pathname === '/journal' ? 'Laporan Harian' :
                             location.pathname === '/scan' ? 'Scan Makanan' :
                             location.pathname === '/chat' ? 'Konsultasi AI' : 'Profil Saya'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="bg-white/50 px-4 py-2 rounded-full border border-white/60 text-xs font-bold text-slate-600 backdrop-blur-sm shadow-sm">
                            Hai, {user?.full_name || 'User'}
                         </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-8 pb-32 scroll-smooth">
                    <Outlet />
                </div>

                <nav className="md:hidden bg-white/90 backdrop-blur-md fixed bottom-0 left-0 w-full border-t border-slate-200 px-6 py-3 flex justify-between items-end pb-6 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    {navs.map((n) => {
                        const isActive = location.pathname === n.path;
                        
                        if (n.isMain) {
                            return (
                                <button key={n.path} onClick={() => navigate(n.path)} 
                                    className="w-16 h-16 bg-blue-500 rounded-full shadow-lg shadow-blue-500/40 border-4 border-white flex items-center justify-center text-white -mt-8 hover:scale-105 active:scale-95 transition transform">
                                    <n.icon size={28} weight="bold" />
                                </button>
                            );
                        }

                        return (
                            <button key={n.path} onClick={() => navigate(n.path)} 
                                className={`flex flex-col items-center gap-1 transition ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                                <n.icon size={24} weight={isActive ? 'fill' : 'regular'} />
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{n.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </main>
        </div>
    );
}