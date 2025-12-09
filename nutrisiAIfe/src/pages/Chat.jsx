import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Robot, PaperPlaneRight, Sparkle } from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown'; 
import Swal from 'sweetalert2';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadHistory = async () => {
        try {
            const res = await api.get('/chat');
            setMessages(res.data);
        } catch (err) { 
            console.error("Gagal load chat:", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsgText = input;
        setInput(''); 
        
        const tempUserMsg = { sender: 'user', message: userMsgText, id: Date.now() };
        setMessages(prev => [...prev, tempUserMsg]);
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: userMsgText });
            
            setMessages(prev => [...prev, res.data]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                message: "Maaf, koneksi ke server terputus. Coba refresh halaman atau login ulang.", 
                id: Date.now() + 1 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
       
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden animate-fade-in relative">
            
            <div className="px-6 py-4 border-b border-white/30 bg-white/40 backdrop-blur-md flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Robot size={24} weight="fill" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-lg tracking-tight flex items-center gap-1">
                            Nutrisi.AI <Sparkle weight="fill" className="text-yellow-400" size={14}/>
                        </h3>
                        <p className="text-xs font-bold text-slate-500">Medical Grade AI • Gemini Pro</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-700">Online</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 opacity-70">
                        <Robot size={64} weight="duotone" />
                        <p className="text-sm font-bold bg-white/50 px-4 py-2 rounded-full">Mulai konsultasi kesehatan Anda...</p>
                    </div>
                )}
                
                {messages.map((msg, idx) => (
                    <div key={msg.id || idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'items-start gap-3'} animate-fade-in`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 flex-none mt-1">
                                <Robot size={18} weight="bold" />
                            </div>
                        )}
                        
                        <div className={`
                            relative px-5 py-4 rounded-3xl max-w-[85%] md:max-w-[75%] shadow-sm text-sm md:text-base leading-relaxed
                            ${msg.sender === 'user' 
                                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-blue-500/20' 
                                : 'bg-white/80 backdrop-blur text-slate-700 rounded-tl-sm border border-white shadow-slate-200/50'}
                        `}>
                            {msg.sender === 'ai' ? (
                              
                                <div className="prose prose-sm md:prose-base prose-slate max-w-none 
                                    prose-p:my-1 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0
                                    marker:text-blue-400">
                                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex items-start gap-3 animate-pulse">
                         <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-400 shadow-sm border border-slate-100">
                            <Robot size={18} />
                         </div>
                         <div className="bg-white/50 px-5 py-3 rounded-3xl rounded-tl-sm text-xs font-bold text-slate-500 flex items-center gap-2">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce delay-100">●</span>
                            <span className="animate-bounce delay-200">●</span>
                            Mengetik...
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/30 backdrop-blur-md border-t border-white/40">
                <form onSubmit={handleSend} className="flex gap-2 relative">
                    <input 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                        className="flex-1 bg-white/70 backdrop-blur-xl pl-5 pr-14 py-3.5 rounded-full border border-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400 shadow-inner disabled:opacity-50"
                        placeholder="Tanyakan keluhan atau tips diet..."
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()} 
                        className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                        <PaperPlaneRight size={20} weight="fill"/>
                    </button>
                </form>
            </div>
        </div>
    );
}