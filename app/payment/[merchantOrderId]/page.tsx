"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useParams, useRouter } from "next/navigation";

type Invoice = {
  merchantOrderId: string;
  reference: string;
  amount: string;
  qrString: string;
  expiresInMinutes: number;
};

export default function PaymentPage() {
  const params = useParams<{ merchantOrderId: string }>();
  const merchantOrderId = params.merchantOrderId;
  const router = useRouter();

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("MENUNGGU PEMBAYARAN");
  const [error, setError] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(false);

  useEffect(() => {
    if (!backend) {
      setError("Missing NEXT_PUBLIC_BACKEND_URL in .env.local");
      return;
    }

    // Demo approach: create invoice on page load if not exists.
    // In production: store invoice data in your DB, don't re-create on refresh.
    (async () => {
      try {
        setError("");
        const res = await fetch(`${backend}/payments/qris`, {
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

        setInvoice(data);

        const url = await QRCode.toDataURL(data.qrString, { margin: 1, width: 320 });
        setQrDataUrl(url);
      } catch (e: any) {
        setError(e?.message ?? "Error");
      }
    })();
  }, [backend, merchantOrderId]);

  useEffect(() => {
    if (!backend || !invoice) return;

    let stopped = false;

    const tick = async () => {
      if (stopped) return;
      setChecking(true);
      try {
        const res = await fetch(`${backend}/payments/status/${encodeURIComponent(merchantOrderId)}`);
        const data = await res.json();

        setStatusText(`${data.statusCode} - ${data.statusMessage}`);

        // Convention: Duitku statusCode "00" is usually success.
        if (String(data.statusCode) === "00") {
          stopped = true;
          setChecking(false);
          return;
        }
      } catch (e: any) {
        setStatusText(`Error checking status: ${e?.message ?? "unknown"}`);
      } finally {
        setChecking(false);
      }

      setTimeout(tick, 3000);
    };

    tick();

    return () => {
      stopped = true;
    };
  }, [backend, invoice, merchantOrderId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Scan QRIS</h1>
            <p className="mt-2 text-sm text-gray-600 break-words">
              Order: <b>{merchantOrderId}</b>
            </p>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            New Order
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-6 flex justify-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QRIS" className="rounded-xl border" />
              ) : (
                <div className="h-[320px] w-[320px] animate-pulse rounded-xl border" />
              )}
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-600">Status</div>
              <div className="mt-1 font-medium">{statusText}</div>
              <div className="mt-2 text-xs text-gray-500">
                {checking ? "Checking..." : "Idle"} • Poll every ~3s
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              QRIS dinamis biasanya punya masa berlaku singkat. Kalau expired, buat order baru.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
