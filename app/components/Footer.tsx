
export default function Footer() {
    return (
        <footer className="border-t border-zinc-800 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-xl font-bold mb-4 md:mb-0">DankaStur</div>
                    <a
                        href="https://wa.me/6285721331216"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline mb-4 md:mb-0"
                    >
                        Hubungi Kami
                    </a>
                    <div className="text-zinc-500 text-sm">
                        © {new Date().getFullYear()} DankaStur. Semua hak dilindungi.
                    </div>
                </div>
            </div>
        </footer>
    );
}
