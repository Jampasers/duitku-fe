import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-xl font-semibold">QRIS Payment Demo</h1>
        <p className="mt-2 text-sm text-gray-600">
          Demo pembayaran dengan Duitku — metode hanya <b>QRIS Dinamis</b>.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-white"
        >
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}
