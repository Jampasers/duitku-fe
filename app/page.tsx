
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import { products } from "./data/products";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent pb-2">
            DankaStur Digital
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 leading-relaxed">
            Premium Discord Bots, Scripts, and Digital Products for your community.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              <span>Verified Seller</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#products"
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-cyan-900/20"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section id="products" className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>
          <div className="h-px bg-zinc-800 flex-grow ml-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl p-8 md:p-12 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-400 mb-2">100+</div>
              <p className="text-zinc-400 font-medium">Happy Customers</p>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-zinc-800">
              <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
              <p className="text-zinc-400 font-medium">Secure Payment</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                &lt; 5m
              </div>
              <p className="text-zinc-400 font-medium">Instant Delivery via Email</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
