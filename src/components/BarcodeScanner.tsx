'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, RefreshCw } from 'lucide-react';

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

    const startScanner = async (deviceId?: string) => {
        if (!videoRef.current) return;
        // Stop previous stream if any
        controlsRef.current?.stop();
        controlsRef.current = null;

        try {
            const reader = new BrowserMultiFormatReader();
            const controls = await reader.decodeFromVideoDevice(deviceId, videoRef.current, (result) => {
                if (result) {
                    onScan(result.getText());
                    controls.stop();
                }
            });
            controlsRef.current = controls;
        } catch (e: any) {
            if (e?.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera permission in browser settings.');
            } else {
                setError('Camera not available on this device.');
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
            .catch(() => setError('No camera found on this device.'));

        return () => { controlsRef.current?.stop(); };
    }, []);

    const switchCamera = () => {
        const currentIdx = devices.findIndex(d => d.deviceId === selectedDeviceId);
        const next = devices[(currentIdx + 1) % devices.length];
        setSelectedDeviceId(next.deviceId);
        startScanner(next.deviceId);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-page-bg/50">
                    <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        <h3 className="font-black text-text-primary">Barcode Scanner</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {devices.length > 1 && (
                            <button onClick={switchCamera} className="p-1.5 rounded-lg hover:bg-border/50 text-text-muted hover:text-text-primary transition-colors" title="Switch Camera">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-border/50 text-text-muted hover:text-text-primary transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Video */}
                <div className="relative bg-black aspect-square">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

                    {/* Scan overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-48 h-48">
                            {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
                                <div key={pos} className={`absolute w-8 h-8 border-primary border-[3px] ${pos === 'tl' ? 'top-0 left-0 border-r-0 border-b-0 rounded-tl-lg' :
                                        pos === 'tr' ? 'top-0 right-0 border-l-0 border-b-0 rounded-tr-lg' :
                                            pos === 'bl' ? 'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg' :
                                                'bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg'
                                    }`} />
                            ))}
                            {/* Animated scan line */}
                            <div className="absolute left-2 right-2 h-0.5 bg-primary/70 animate-bounce" style={{ top: '50%' }} />
                        </div>
                    </div>

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6">
                            <div className="text-center">
                                <Camera className="w-10 h-10 text-white/40 mx-auto mb-3" />
                                <p className="text-white text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 text-center">
                    <p className="text-sm text-text-muted font-medium">
                        Position the barcode inside the frame
                    </p>
                    <p className="text-xs text-text-muted/60 mt-1">
                        Supports QR Code, EAN, UPC, Code128, and more
                    </p>
                </div>
            </div>
        </div>
    );
}
