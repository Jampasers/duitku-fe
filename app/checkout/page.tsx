"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function createPayment() {
    setLoading(true);
    setError("");
    try {
      const merchantOrderId = `ORDER-${Date.now()}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/qris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantOrderId,
          amount: 40000,
          productDetails: "Topup / Pembayaran",
          customer: { name: "John Doe", email: "john@example.com", phone: "08123456789" },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to create invoice");

      router.push(`/payment/${encodeURIComponent(merchantOrderId)}`);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-gray-600">
          Metode pembayaran hanya <b>QRIS Dinamis</b>.
        </p>

        <button
          onClick={createPayment}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
        >
          {loading ? "Membuat QR..." : "Bayar dengan QRIS"}
        </button>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
