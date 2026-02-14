
"use client";

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product } from '../data/products';

interface CheckoutModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

type ModalStep = 'form' | 'qr' | 'success' | 'expired';

interface OrderData {
    merchantOrderId: string;
    amount: number;
    productDetails: any;
    customer: { name: string; email: string };
    status: string;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrString, setQrString] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<ModalStep>('form');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    // Cleanup polling on unmount or close
    useEffect(() => {
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, []);

    if (!isOpen) return null;

    const startPolling = (merchantOrderId: string) => {
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(async () => {
            try {
                const res = await fetch(`${backend}/payments/order/${encodeURIComponent(merchantOrderId)}`);
                const data = await res.json();

                if (data.found && data.order) {
                    if (data.order.status === 'PAID') {
                        if (pollingRef.current) clearInterval(pollingRef.current);
                        // Parse productDetails if it's a JSON string
                        let productDetails = data.order.productDetails;
                        try {
                            if (typeof productDetails === 'string') {
                                productDetails = JSON.parse(productDetails);
                            }
                        } catch { }
                        setOrderData({ ...data.order, productDetails });
                        setStep('success');
                    } else if (data.order.status === 'FAILED' || data.order.status === 'EXPIRED') {
                        if (pollingRef.current) clearInterval(pollingRef.current);
                        setStep('expired');
                    }
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 3000);

        // Auto-expire after 10 minutes (QRIS expiry)
        setTimeout(() => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                // Only set expired if not already paid
                setStep(prev => prev === 'qr' ? 'expired' : prev);
            }
        }, 10 * 60 * 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const merchantOrderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const payload = {
                merchantOrderId,
                amount: product.price,
                productDetails: JSON.stringify({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    content: product.content
                }),
                customer: { name, email },
            };

            const response = await fetch(`${backend}/payments/qris`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to create payment');
            }

            if (data.qrString) {
                setQrString(data.qrString);
                setOrderId(merchantOrderId);
                setStep('qr');
                startPolling(merchantOrderId);
            } else {
                setError('Failed to generate QR Code. Please try again.');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setName('');
        setEmail('');
        setQrString(null);
        setOrderId(null);
        setError(null);
        setStep('form');
        setOrderData(null);
        onClose();
    };

    const tryAgain = () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setQrString(null);
        setOrderId(null);
        setError(null);
        setStep('form');
        setOrderData(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={reset}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                {/* === FORM STEP === */}
                {step === 'form' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                            Checkout
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-zinc-800/30 p-4 rounded-xl mb-4 border border-zinc-800">
                                <h3 className="font-semibold text-white">{product.name}</h3>
                                <p className="text-cyan-400 font-bold mt-1">Rp{product.price.toLocaleString('id-ID')}</p>
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="Masukkan nama Anda"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="email@contoh.com"
                                />
                                <p className="text-xs text-zinc-500 mt-1">
                                    Detail produk juga akan dikirim ke email ini.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    'Bayar dengan QRIS'
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* === QR STEP === */}
                {step === 'qr' && qrString && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                            Scan QRIS
                        </h2>

                        <div className="bg-white p-4 rounded-xl mb-4">
                            <QRCodeSVG value={qrString} size={200} />
                        </div>

                        <p className="text-zinc-300 text-center text-sm mb-3">
                            Scan menggunakan E-Wallet atau Mobile Banking
                        </p>

                        <div className="bg-zinc-800/50 p-3 rounded-lg w-full mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">Order ID:</span>
                                <span className="font-mono text-cyan-400 text-xs">{orderId}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">Produk:</span>
                                <span className="font-medium text-white">{product.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Total:</span>
                                <span className="font-bold text-white">Rp{product.price.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Polling status indicator */}
                        <div className="flex items-center gap-2 text-sm text-amber-400 mb-4">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            Menunggu pembayaran...
                        </div>

                        <p className="text-xs text-zinc-500 text-center mb-4">
                            Produk akan dikirim ke <strong>{email}</strong> setelah pembayaran.
                        </p>

                        <button
                            onClick={reset}
                            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                )}

                {/* === SUCCESS STEP === */}
                {step === 'success' && orderData && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        {/* Success icon */}
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold mb-1 text-green-400">
                            Pembayaran Berhasil!
                        </h2>
                        <p className="text-zinc-400 text-sm mb-6">Order #{orderId}</p>

                        {/* Product details */}
                        <div className="w-full bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-700">
                            <h3 className="font-bold text-lg text-white mb-1">
                                {orderData.productDetails?.name || product.name}
                            </h3>
                            <p className="text-zinc-400 text-sm mb-3">
                                {orderData.productDetails?.description || product.description}
                            </p>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Total dibayar:</span>
                                <span className="font-bold text-cyan-400">
                                    Rp{(orderData.productDetails?.price || product.price).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        {/* Product content (the actual deliverable) */}
                        <div className="w-full bg-gradient-to-br from-cyan-900/30 to-indigo-900/30 rounded-xl p-4 mb-4 border border-cyan-700/30">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-semibold text-cyan-400 text-sm">Produk Anda</span>
                            </div>
                            <div className="bg-zinc-950/50 rounded-lg p-3 font-mono text-sm text-white break-all whitespace-pre-wrap">
                                {orderData.productDetails?.content || 'Silahkan hubungi admin.'}
                            </div>
                        </div>

                        <p className="text-xs text-zinc-500 text-center mb-4">
                            📧 Detail produk juga telah dikirim ke <strong>{email}</strong>
                        </p>

                        <div className="w-full flex gap-3">
                            <a
                                href={`/order/${encodeURIComponent(orderId || '')}`}
                                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-colors text-center text-sm"
                            >
                                Lihat Detail
                            </a>
                            <button
                                onClick={reset}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-bold hover:opacity-90 transition-opacity text-sm"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                )}

                {/* === EXPIRED STEP === */}
                {step === 'expired' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-red-400">
                            Pembayaran Gagal / Expired
                        </h2>
                        <p className="text-zinc-400 text-sm text-center mb-6">
                            QR Code telah kadaluarsa atau pembayaran gagal. Silahkan coba lagi.
                        </p>

                        <div className="w-full flex gap-3">
                            <button
                                onClick={reset}
                                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={tryAgain}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
