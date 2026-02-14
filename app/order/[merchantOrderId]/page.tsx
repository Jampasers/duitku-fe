"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface OrderData {
    merchantOrderId: string;
    amount: number;
    productDetails: any;
    customer: { name: string; email: string };
    status: string;
    reference?: string;
    createdAt: string;
}

export default function OrderPage() {
    const params = useParams<{ merchantOrderId: string }>();
    const merchantOrderId = params.merchantOrderId;
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${backend}/payments/order/${encodeURIComponent(merchantOrderId)}`);
                const data = await res.json();

                if (data.found && data.order) {
                    let productDetails = data.order.productDetails;
                    try {
                        if (typeof productDetails === "string") {
                            productDetails = JSON.parse(productDetails);
                        }
                    } catch { }
                    setOrder({ ...data.order, productDetails });
                } else {
                    setError("Order tidak ditemukan.");
                }
            } catch (e: any) {
                setError(e?.message || "Gagal memuat data order.");
            } finally {
                setLoading(false);
            }
        })();
    }, [backend, merchantOrderId]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-lg">
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                            <span className="w-8 h-8 border-3 border-zinc-700 border-t-cyan-400 rounded-full animate-spin mb-4"></span>
                            <p className="text-zinc-400">Memuat data order...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-red-400 mb-2">Order Tidak Ditemukan</h1>
                            <p className="text-zinc-400 text-sm mb-6">{error}</p>
                            <a
                                href="/"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Kembali ke Beranda
                            </a>
                        </div>
                    ) : order ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                            {/* Status header */}
                            {order.status === "PAID" ? (
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-green-400">Pembayaran Berhasil</h1>
                                    <p className="text-zinc-500 text-sm mt-1">Order #{order.merchantOrderId}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-bold text-amber-400">
                                        {order.status === "PENDING" ? "Menunggu Pembayaran" : order.status}
                                    </h1>
                                    <p className="text-zinc-500 text-sm mt-1">Order #{order.merchantOrderId}</p>
                                </div>
                            )}

                            {/* Order info */}
                            <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Produk:</span>
                                    <span className="font-medium text-white">{order.productDetails?.name || "-"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Deskripsi:</span>
                                    <span className="text-zinc-300 text-right max-w-[200px]">{order.productDetails?.description || "-"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Total:</span>
                                    <span className="font-bold text-cyan-400">
                                        Rp{(order.productDetails?.price || order.amount || 0).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Email:</span>
                                    <span className="text-zinc-300">{order.customer?.email || "-"}</span>
                                </div>
                            </div>

                            {/* Product content - only shown when PAID */}
                            {order.status === "PAID" && (
                                <div className="bg-gradient-to-br from-cyan-900/30 to-indigo-900/30 rounded-xl p-4 mb-4 border border-cyan-700/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="font-semibold text-cyan-400 text-sm">Produk Anda</span>
                                    </div>
                                    <div className="bg-zinc-950/50 rounded-lg p-3 font-mono text-sm text-white break-all whitespace-pre-wrap">
                                        {order.productDetails?.content || "Silahkan hubungi admin."}
                                    </div>
                                </div>
                            )}

                            {order.status === "PAID" && (
                                <p className="text-xs text-zinc-500 text-center mb-4">
                                    📧 Detail produk juga telah dikirim ke email Anda.
                                </p>
                            )}

                            <a
                                href="/"
                                className="block w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-bold hover:opacity-90 transition-opacity text-center"
                            >
                                Kembali ke Beranda
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>

            <Footer />
        </div>
    );
}
