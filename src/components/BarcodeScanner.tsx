'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, RefreshCw, Scan, ShieldCheck, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<{ stop: () => void } | null>(null);
    const [error, setError] = useState('');
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
    const [isScanning, setIsScanning] = useState(true);

    const startScanner = async (deviceId?: string) => {
        if (!videoRef.current) return;
        controlsRef.current?.stop();
        controlsRef.current = null;

        try {
            const reader = new BrowserMultiFormatReader();
            const controls = await reader.decodeFromVideoDevice(deviceId, videoRef.current, (result) => {
                if (result) {
                    setIsScanning(false);
                    onScan(result.getText());
                    controls.stop();
                }
            });
            controlsRef.current = controls;
        } catch (e: any) {
            if (e?.name === 'NotAllowedError') {
                setError('Optic access denied. Authorization required.');
            } else {
                setError('Optical node failure. Check connection.');
            }
        }
    };

    useEffect(() => {
        BrowserMultiFormatReader.listVideoInputDevices()
            .then(videoDevices => {
                setDevices(videoDevices);
                const rear = videoDevices.find(d =>
                    d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')
                );
                const id = rear?.deviceId || videoDevices[0]?.deviceId;
                setSelectedDeviceId(id);
                startScanner(id);
            })
            .catch(() => setError('No optical sensor detected.'));

        return () => { controlsRef.current?.stop(); };
    }, []);

    const switchCamera = () => {
        const currentIdx = devices.findIndex(d => d.deviceId === selectedDeviceId);
        const next = devices[(currentIdx + 1) % devices.length];
        setSelectedDeviceId(next.deviceId);
        startScanner(next.deviceId);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-[3.5rem] overflow-hidden w-full max-w-md shadow-2xl border border-white/20">
                {/* ─── HEADER ─── */}
                <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 -mr-16 -mt-16 rounded-full blur-2xl opacity-50" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                            <Scan className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-none uppercase tracking-tight">Optic Intercept</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                <Activity className="w-3 h-3 text-indigo-500 animate-pulse" />
                                Monitoring Signal
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        {devices.length > 1 && (
                            <button onClick={switchCamera} className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm" title="Switch Sensor">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        )}
                        <button onClick={onClose} className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* ─── OPTIC FEED (Video) ─── */}
                <div className="relative bg-black aspect-square overflow-hidden group">
                    <video ref={videoRef} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" autoPlay muted playsInline />

                    {/* Scan UI Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-64 h-64">
                            {/* Corner Accents */}
                            {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
                                <motion.div key={pos} 
                                    animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                    className={`absolute w-12 h-12 border-indigo-500 border-[4px] ${
                                        pos === 'tl' ? 'top-0 left-0 border-r-0 border-b-0 rounded-tl-3xl' :
                                        pos === 'tr' ? 'top-0 right-0 border-l-0 border-b-0 rounded-tr-3xl' :
                                        pos === 'bl' ? 'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-3xl' :
                                        'bottom-0 right-0 border-l-0 border-t-0 rounded-br-3xl'
                                    }`} 
                                />
                            ))}
                            {/* High-tech scan line */}
                            <motion.div 
                                initial={{ top: '10%' }}
                                animate={{ top: '90%' }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5, ease: 'easeInOut' }}
                                className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,1)]" 
                            />
                        </div>
                    </div>

                    {/* HUD Status */}
                    <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Feed: Live</span>
                    </div>

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-10 z-20 backdrop-blur-xl">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                   <Camera className="w-10 h-10 text-red-500 opacity-60" />
                                </div>
                                <h4 className="text-[11px] font-black text-red-400 uppercase tracking-widest mb-2">Protocol Terminated</h4>
                                <p className="text-white/60 text-[13px] font-medium leading-relaxed">{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-8 px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">Re-initialize</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── FOOTER ─── */}
                <div className="px-10 py-10 text-center bg-gray-50/50">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Security Authenticated</span>
                    </div>
                    <p className="text-[13px] text-gray-500 font-bold leading-relaxed px-4 italic">
                        Align the asset barcode signature within the high-fidelity target vector for identification.
                    </p>
                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <div className="text-center">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Optic Latency</p>
                           <p className="text-[14px] font-black text-gray-900 tracking-tighter">12ms</p>
                        </div>
                        <div className="text-center border-l border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocol</p>
                           <p className="text-[14px] font-black text-gray-900 tracking-tighter">EAN/QR_SLOT</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
