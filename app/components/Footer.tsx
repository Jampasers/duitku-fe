
export default function Footer() {
    return (
        <footer className="border-t border-zinc-800 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="text-xl font-bold mb-4">DankaStur</div>
                        <p className="text-zinc-400 text-sm">
                            Platform digital terbaik untuk kebutuhan Discord dan sosial media Anda.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold mb-4 text-white">Hubungi Kami</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <span className="min-w-[50px] font-medium text-zinc-500">Alamat:</span>
                                <span>Jl Dahli 3-31 Perumnas 1 Tangerang</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="min-w-[50px] font-medium text-zinc-500">WA:</span>
                                <a href="https://wa.me/6289637093889" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                                    089637093889
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="min-w-[50px] font-medium text-zinc-500">Email:</span>
                                <a href="mailto:hanifsantuy4@gmail.com" className="hover:text-cyan-400">
                                    hanifsantuy4@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500 text-sm">
                    © {new Date().getFullYear()} DankaStur. Semua hak dilindungi.
                </div>
            </div>
        </footer>
    );
}
