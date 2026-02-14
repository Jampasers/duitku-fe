
"use client";

import { useState } from "react";
import { Product } from "../data/products";
import CheckoutModal from "./CheckoutModal";

export default function ProductCard({ product }: { product: Product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-900/20 flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-zinc-400 mb-4 min-h-[60px] flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-4">
                        <span className="text-2xl font-bold text-cyan-400">
                            Rp{product.price.toLocaleString("id-ID")}
                        </span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-lg font-medium hover:opacity-90 transition-opacity text-white"
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </div>

            <CheckoutModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
