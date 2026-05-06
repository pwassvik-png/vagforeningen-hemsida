import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-sand)]">
      {/* Hero */}
      <header className="bg-[var(--color-forest)] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Skogstorp-Gunntorps<br />Samfällighetsförening
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Välkommen till föreningens medlemsportal
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="bg-white text-[var(--color-forest)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Logga in
            </Link>
            <Link
              href="/dashboard/news"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Nyheter
            </Link>
          </div>
        </div>
      </header>

      {/* Info */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">📰</div>
            <h2 className="text-xl font-semibold mb-2">Nyheter</h2>
            <p className="text-gray-600">
              Senaste nyheter och kungörelser från styrelsen.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">🐛</div>
            <h2 className="text-xl font-semibold mb-2">Problemrapportering</h2>
            <p className="text-gray-600">
              Rapportera vägskador, vegetation och andra problem.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">📄</div>
            <h2 className="text-xl font-semibold mb-2">Dokument</h2>
            <p className="text-gray-600">
              Protokoll, stadgar, budget och andra handlingar.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Om föreningen</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-[var(--color-forest)]">Kontakt</h3>
              <p>Ordförande: Peter Wassvik</p>
              <p>E-post: peter@wassvik.se</p>
              <p>Telefon: 0709-96 71 03</p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-forest)]">Fakta</h3>
              <p>Org.nummer: 716447-5555</p>
              <p>GA-beteckning: Ale Uddetorp GA:1</p>
              <p>Antal delägare: 114 fastigheter</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-forest-dark)] text-white/70 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Skogstorp-Gunntorps Samfällighetsförening</p>
        </div>
      </footer>
    </div>
  );
}