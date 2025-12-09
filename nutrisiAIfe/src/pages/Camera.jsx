import { useState, useRef, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { checkMedicalRisk } from '../utils/nutritionCalc';
import { Camera as CameraIcon, Upload, X, CheckCircle, Aperture, Lightning } from '@phosphor-icons/react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

export default function Camera() {
    const { user } = useContext(AuthContext);
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            Swal.fire('Error', 'Gagal membuka kamera. Pastikan izin diberikan.', 'error');
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                handleUploadProcess(file);
            }, 'image/jpeg');
            stopCamera();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleUploadProcess(file);
    };

    const handleUploadProcess = async (file) => {
        setImageSrc(URL.createObjectURL(file));
        setLoading(true);
        
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/scan', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (err) {
            Swal.fire('Error', 'Gagal memproses gambar', 'error');
            setImageSrc(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfirmation = () => {
        if (!result || !user) return;

        let conditions = [];
        try { conditions = JSON.parse(user.medical_conditions || '[]'); } catch(e){}

        const risks = checkMedicalRisk(result, conditions);

        if (risks.length > 0) {
            const riskList = risks.map(r => `<li class="text-left mb-2"><b>${r.type}:</b> ${r.msg}</li>`).join('');
            
            Swal.fire({
                title: 'Perhatian Medis',
                html: `
                    <div class="text-sm text-slate-600">
                        Berdasarkan profil kesehatan Anda, kami menemukan catatan pada makanan ini:
                        <ul class="list-disc pl-4 mt-3 bg-red-50 p-3 rounded-xl border border-red-100 text-red-700">
                            ${riskList}
                        </ul>
                        <p class="mt-4 font-bold text-slate-800">Apakah Anda ingin tetap mencatatnya?</p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#94a3b8',
                confirmButtonText: 'Ya, Tetap Catat',
                cancelButtonText: 'Batal / Scan Ulang',
                reverseButtons: true
            }).then((alertRes) => {
                if (alertRes.isConfirmed) {
                    saveFoodToDB();
                }
            });
        } else {
            saveFoodToDB();
        }
    };

    const saveFoodToDB = async () => {
        try {
            await api.post('/food', {
                food_name: result.food_name,
                calories: result.calories,
                protein_g: result.protein_g,
                carbs_g: result.carbs_g,
                fat_g: result.fat_g,
                sugar_g: result.sugar_g,
                salt_mg: result.salt_mg,
                fiber_g: result.fiber_g,
                grade: result.grade
            });
            Swal.fire({ icon: 'success', title: 'Tersimpan!', text: 'Data nutrisi berhasil dicatat.', timer: 1500, showConfirmButton: false });
            setResult(null); setImageSrc(null);
        } catch(err) {
            Swal.fire('Error', 'Gagal menyimpan', 'error');
        }
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in p-4 pb-24">
            {!imageSrc && !isCameraOpen && (
                <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl text-center space-y-8">
                    <div className="space-y-2">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 animate-pulse">
                            <Aperture size={40} weight="fill" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800">Scan Makananmu</h2>
                        <p className="text-slate-500 font-medium">AI akan mendeteksi nutrisi secara otomatis</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={startCamera} className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 group">
                            <CameraIcon size={32} weight="bold" className="group-hover:rotate-12 transition-transform"/>
                            <span className="font-bold">Buka Kamera</span>
                        </button>
                        
                        <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center justify-center gap-3 p-6 bg-white border-2 border-slate-100 text-slate-600 rounded-3xl hover:bg-slate-50 transition hover:scale-105 active:scale-95 group">
                            <Upload size={32} weight="bold" className="group-hover:-translate-y-1 transition-transform"/>
                            <span className="font-bold">Upload Foto</span>
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>
            )}

            {isCameraOpen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    <video ref={videoRef} autoPlay playsInline className="flex-1 w-full h-full object-cover" />
                    <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center pb-12">
                        <button onClick={stopCamera} className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition">
                            <X size={24} weight="bold"/>
                        </button>
                        <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg active:scale-90 transition">
                            <div className="w-16 h-16 bg-white rounded-full border-2 border-black"></div>
                        </button>
                        <div className="w-14"></div>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            )}

            {imageSrc && (
                <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden relative">
                    <div className="relative h-64 bg-slate-900">
                        <img src={imageSrc} className="w-full h-full object-cover opacity-80" />
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                    <Lightning size={24} weight="fill" className="text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <p className="text-white font-bold mt-4 tracking-wider text-sm animate-pulse">AI ANALYZING...</p>
                            </div>
                        )}
                        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] animate-scan"></div>}
                        {!loading && result && (
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
                                <h2 className="text-3xl font-extrabold text-white mb-1">{result.food_name}</h2>
                                <p className="text-slate-300 text-sm font-medium">Akurasi AI: 94%</p>
                            </div>
                        )}
                    </div>

                    {!loading && result && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="text-4xl font-extrabold text-slate-800">{result.calories}</span>
                                    <span className="text-sm font-bold text-slate-400 ml-1">kcal</span>
                                </div>
                                <div className={`px-4 py-2 rounded-xl font-bold text-lg border-2 ${result.grade === 'A' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                    Grade {result.grade}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Gula</p>
                                    <p className="font-extrabold text-purple-600 text-lg">{result.sugar_g}g</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Garam</p>
                                    <p className="font-extrabold text-slate-600 text-lg">{result.salt_mg}mg</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Lemak</p>
                                    <p className="font-extrabold text-red-500 text-lg">{result.fat_g}g</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleSaveConfirmation} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
                                    <CheckCircle size={22} weight="fill"/> Simpan ke Jurnal
                                </button>
                                <button onClick={() => {setResult(null); setImageSrc(null);}} className="w-full py-4 text-slate-500 font-bold text-sm hover:text-slate-800 hover:bg-slate-50 rounded-2xl transition-all">
                                    Scan Ulang
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}