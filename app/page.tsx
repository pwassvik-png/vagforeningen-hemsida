import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Hero */}
      <header className="bg-[var(--color-primary)] text-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28 text-center">
          <h1 className="text-[40px] md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Skogstorp-Gunntorps<br />Samfällighetsförening
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 font-normal leading-relaxed">
            Välkommen till föreningens medlemsportal
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="bg-[var(--color-secondary)] text-white px-8 py-3 rounded-[10px] font-semibold text-base hover:brightness-110 transition"
            >
              Logga in
            </Link>
            <Link
              href="/dashboard/news"
              className="border-2 border-white text-white px-8 py-3 rounded-[10px] font-semibold text-base hover:bg-white/10 transition"
            >
              Nyheter
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Cards */}
      <main className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] text-2xl mb-4">
              📰
            </div>
            <h2 className="text-2xl font-semibold mb-2">Nyheter</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              Senaste nyheter och kungörelser från styrelsen.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] text-2xl mb-4">
              🐛
            </div>
            <h2 className="text-2xl font-semibold mb-2">Problemrapportering</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              Rapportera vägskador, vegetation och andra problem.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] text-2xl mb-4">
              📄
            </div>
            <h2 className="text-2xl font-semibold mb-2">Dokument</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">
              Protokoll, stadgar, budget och andra handlingar.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 md:p-10 border border-[var(--color-outline-variant)] shadow-sm">
          <h2 className="text-3xl font-semibold mb-8">Om föreningen</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-semibold text-[var(--color-secondary)] text-lg mb-3">Kontakt</h3>
              <div className="space-y-2 text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>Ordförande: Peter Wassvik</p>
                <p>E-post: peter@wassvik.se</p>
                <p>Telefon: 0709-96 71 03</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-secondary)] text-lg mb-3">Fakta</h3>
              <div className="space-y-2 text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>Org.nummer: 716447-5555</p>
                <p>GA-beteckning: Ale Uddetorp GA:1</p>
                <p>Antal delägare: 114 fastigheter</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)]/70 py-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Skogstorp-Gunntorps Samfällighetsförening</p>
        </div>
      </footer>
    </div>
  );
}