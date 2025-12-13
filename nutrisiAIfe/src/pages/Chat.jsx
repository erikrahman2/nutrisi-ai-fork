import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Robot, PaperPlaneRight, Sparkle, User } from '@phosphor-icons/react';
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
            console.error(err);
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
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white/50 backdrop-blur-3xl rounded-[2rem] border border-white/60 shadow-2xl overflow-hidden relative">
            <div className="px-6 py-5 bg-white/60 backdrop-blur-md border-b border-white/50 flex justify-between items-center z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Robot size={28} weight="fill" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-lg tracking-tight flex items-center gap-1.5">
                            Nutrisi.AI <Sparkle weight="fill" className="text-amber-400" size={16} />
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Medical Grade Assistant
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth bg-gradient-to-b from-transparent to-white/30">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full opacity-60 space-y-6">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
                            <Robot size={48} weight="duotone" />
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-xl font-bold text-slate-700">Selamat Datang di Nutrisi.AI</h4>
                            <p className="text-slate-500 max-w-xs mx-auto">Tanyakan seputar diet, nutrisi, atau analisis kesehatan Anda.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={msg.id || idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white 
                                ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                                {msg.sender === 'user' ? <User size={20} weight="bold" /> : <Robot size={20} weight="bold" />}
                            </div>

                            <div className={`group relative px-6 py-4 shadow-sm text-sm md:text-[15px] leading-relaxed transition-all duration-300
                                ${msg.sender === 'user' 
                                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-none shadow-blue-500/20' 
                                    : 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100 shadow-slate-200/50'}`}>
                                
                                {msg.sender === 'ai' ? (
                                    <div className="prose prose-sm prose-slate max-w-none 
                                        prose-p:my-1.5 prose-headings:font-bold prose-headings:text-slate-800 prose-headings:my-2
                                        prose-strong:text-slate-900 prose-strong:font-bold
                                        prose-ul:my-2 prose-li:my-0.5 prose-li:marker:text-blue-500">
                                        <ReactMarkdown>{msg.message}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap font-medium">{msg.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex w-full justify-start">
                        <div className="flex max-w-[75%] gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white">
                                <Robot size={20} weight="bold" />
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-white/70 backdrop-blur-xl border-t border-white/50 z-20">
                <form onSubmit={handleSend} className="relative flex items-center gap-3">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                        className="w-full bg-white pl-6 pr-16 py-4 rounded-full border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400 shadow-inner"
                        placeholder="Ketik pesan konsultasi Anda..."
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                        <PaperPlaneRight size={22} weight="fill" />
                    </button>
                </form>
            </div>
        </div>
    );
}