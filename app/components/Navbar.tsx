
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent"
                >
                    DankaStur
                </Link>
                <a
                    href="https://wa.me/6285721331216"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                    Kontak
                </a>
            </div>
        </header>
    );
}
