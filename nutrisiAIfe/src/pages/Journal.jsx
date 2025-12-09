import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext'; 
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { ShieldCheck, Warning, Siren, TrendUp, Info } from '@phosphor-icons/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

export default function Journal() {
    dayjs.locale('id');
    const { user } = useContext(AuthContext); 
    const [loading, setLoading] = useState(true);
    const [nutrition, setNutrition] = useState({
        protein: 0, carbs: 0, fat: 0, sugar: 0, salt: 0, fiber: 0, calories: 0
    });

    let userConditions = [];
    try {
        userConditions = typeof user?.medical_conditions === 'string' 
            ? JSON.parse(user.medical_conditions) 
            : (user?.medical_conditions || []);
    } catch(e) { userConditions = []; }

    const targets = {
        protein: 60, carbs: 300, fat: 70,
        sugar: 50, salt: 2000, fiber: 30
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/food/today');
                let total = { protein: 0, carbs: 0, fat: 0, sugar: 0, salt: 0, fiber: 0, calories: 0 };
                
                res.data.forEach(item => {
                    total.calories += item.calories;
                    total.protein += item.protein_g;
                    total.carbs += item.carbs_g;
                    total.fat += item.fat_g;
                    total.sugar += item.sugar_g;
                    total.salt += item.salt_mg;
                    total.fiber += item.fiber_g;
                });
                setNutrition(total);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = {
        labels: ['Protein', 'Karbo', 'Lemak', 'Gula', 'Serat'],
        datasets: [{
            label: '% Terpenuhi',
            data: [
                (nutrition.protein / targets.protein) * 100,
                (nutrition.carbs / targets.carbs) * 100,
                (nutrition.fat / targets.fat) * 100,
                (nutrition.sugar / targets.sugar) * 100,
                (nutrition.fiber / targets.fiber) * 100,
            ],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(239, 68, 68, 0.8)',  
                'rgba(168, 85, 247, 0.8)', 'rgba(16, 185, 129, 0.8)',
            ],
            borderRadius: 8,
            barThickness: 40,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 14,
                cornerRadius: 12,
                titleFont: { size: 13, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" },
                bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
                displayColors: true,
                callbacks: {
                    label: (context) => ` ${Math.round(context.raw)}% dari Target`
                }
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 100,
                        yMax: 100,
                        borderColor: '#94a3b8',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: { 
                            display: true, 
                            content: 'Batas Ideal (100%)', 
                            position: 'end',
                            color: '#64748b',
                            backgroundColor: 'rgba(241, 245, 249, 0.8)',
                            font: { size: 10 }
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 160,
                grid: { color: 'rgba(226, 232, 240, 0.6)', drawBorder: false },
                ticks: { callback: (val) => `${val}%`, font: { size: 10 }, color: '#94a3b8' }
            },
            x: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' }, color: '#64748b' } }
        }
    };

    const getStatus = (val, target, item) => {
        const pct = (val / target) * 100;
        const isDiabetes = userConditions.includes('Diabetes');
        const isHipertensi = userConditions.includes('Hipertensi');
        const isCholesterol = userConditions.includes('Kolesterol');

        if (item.n === 'Gula' && isDiabetes) {
            if (pct > 80) return { label: 'BAHAYA (DIABETES)', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: <Siren weight="fill"/> };
        }
        if (item.n === 'Natrium (Garam)' && isHipertensi) {
            if (pct > 80) return { label: 'BAHAYA (HIPERTENSI)', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: <Siren weight="fill"/> };
        }
        if (item.n === 'Lemak Total' && isCholesterol) {
            if (pct > 80) return { label: 'BAHAYA (KOLESTEROL)', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: <Siren weight="fill"/> };
        }

        if (item.limit) { 
            if (pct > 100) return { label: 'BERLEBIH', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', icon: <Warning weight="fill"/> };
            if (pct > 80) return { label: 'WASPADA', bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', icon: <Warning weight="fill"/> };
            return { label: 'AMAN', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: <ShieldCheck weight="fill"/> };
        } else { 
            if (pct < 50) return { label: 'KURANG', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', icon: <TrendUp weight="bold"/> };
            if (pct < 80) return { label: 'CUKUP', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: <ShieldCheck weight="fill"/> };
            return { label: 'OPTIMAL', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: <ShieldCheck weight="fill"/> };
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-40">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analisis Medis</h2>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Laporan Harian • {dayjs().format('DD MMMM YYYY')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Total Kalori</span>
                        <span className="text-2xl font-extrabold text-slate-800">{Math.round(nutrition.calories)}</span>
                        <span className="text-xs text-slate-500">kkal</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">Total Gula</span>
                        <span className="text-2xl font-extrabold text-purple-600">{Math.round(nutrition.sugar)}g</span>
                        <span className="text-xs text-slate-500">Batas: {targets.sugar}g</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Total Garam</span>
                        <span className="text-2xl font-extrabold text-slate-600">{Math.round(nutrition.salt)}mg</span>
                        <span className="text-xs text-slate-500">Batas: {targets.salt}mg</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg text-white flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-blue-100 uppercase">Status Umum</span>
                        <span className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck size={20} weight="fill"/> 
                            {nutrition.sugar > targets.sugar ? 'Perlu Perhatian' : 'Sehat'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white/50 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/60 shadow-xl">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Grafik Vitalitas</h3>
                        <p className="text-xs text-slate-500">Persentase terhadap batas harian</p>
                    </div>
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <Info size={20} className="text-slate-400"/>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-100/50 bg-white/40">
                    <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <ShieldCheck size={24} className="text-emerald-500" weight="duotone"/>
                        Rincian Komponen Nutrisi
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Data detail makro & mikro nutrisi berdasarkan scan makanan.</p>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Komponen Gizi</th>
                                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Jumlah Asupan</th>
                                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Target Harian</th>
                                <th className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Analisis AI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {[
                                { n: 'Protein', v: nutrition.protein, t: targets.protein, unit: 'g', limit: false, desc: 'Pembangun otot & sel tubuh' },
                                { n: 'Karbohidrat', v: nutrition.carbs, t: targets.carbs, unit: 'g', limit: false, desc: 'Sumber energi utama' },
                                { n: 'Lemak Total', v: nutrition.fat, t: targets.fat, unit: 'g', limit: false, desc: 'Cadangan energi & fungsi hormon' },
                                { n: 'Gula', v: nutrition.sugar, t: targets.sugar, unit: 'g', limit: true, desc: 'Risiko diabetes & obesitas' },
                                { n: 'Natrium (Garam)', v: nutrition.salt, t: targets.salt, unit: 'mg', limit: true, desc: 'Risiko hipertensi & jantung' },
                                { n: 'Serat', v: nutrition.fiber, t: targets.fiber, unit: 'g', limit: false, desc: 'Pencernaan & gula darah' },
                            ].map((item, idx) => {
                                const status = getStatus(item.v, item.t, item);
                                const progress = Math.min((item.v / item.t) * 100, 100);
                                
                                return (
                                    <tr key={idx} className="group hover:bg-white/60 transition-colors duration-200">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700 text-sm">{item.n}</span>
                                                <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-slate-800">{Math.round(item.v)}</span>
                                                <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 align-middle">
                                            <div className="w-full max-w-[140px]">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                                                    <span>0%</span>
                                                    <span>Target: {item.t}{item.unit}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                                                            item.limit && item.v > item.t ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                        }`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-extrabold tracking-wide border shadow-sm ${status.bg} ${status.text} ${status.border}`}>
                                                {status.icon}
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}