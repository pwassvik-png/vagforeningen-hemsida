import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Hero */}
      <header className="bg-[var(--color-primary)] text-white">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-14 sm:py-20 md:py-28 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Skogstorp-Gunntorps<br className="hidden sm:block" />{" "}
            <span className="sm:hidden">&shy;</span>Samfällighetsförening
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 sm:mb-10 font-normal leading-relaxed max-w-xl mx-auto">
            Välkommen till föreningens medlemsportal
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/login"
              className="bg-[var(--color-secondary)] text-white px-8 py-3 rounded-[10px] font-semibold text-base hover:brightness-110 transition text-center"
            >
              Logga in
            </Link>
            <Link
              href="/dashboard/news"
              className="border-2 border-white text-white px-8 py-3 rounded-[10px] font-semibold text-base hover:bg-white/10 transition text-center"
            >
              Nyheter
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Cards */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/dashboard/news" className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md transition group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
              📰
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2">Nyheter</h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              Senaste nyheter och kungörelser från styrelsen.
            </p>
          </Link>
          <Link href="/dashboard/issues" className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md transition group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
              🐛
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2">Problemrapportering</h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              Rapportera vägskador, vegetation och andra problem.
            </p>
          </Link>
          <Link href="/dashboard/documents" className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md transition group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
              📄
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2">Dokument</h2>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              Protokoll, stadgar, budget och andra handlingar.
            </p>
          </Link>
        </div>

        {/* About Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-[var(--color-outline-variant)] shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Om föreningen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            <div>
              <h3 className="font-semibold text-[var(--color-secondary)] text-base sm:text-lg mb-2 sm:mb-3">Kontakt</h3>
              <div className="space-y-1.5 sm:space-y-2 text-[var(--color-on-surface-variant)] leading-relaxed text-sm sm:text-base">
                <p>Ordförande: Peter Wassvik</p>
                <p>E-post: peter@wassvik.se</p>
                <p>Telefon: 0709-96 71 03</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-secondary)] text-base sm:text-lg mb-2 sm:mb-3">Fakta</h3>
              <div className="space-y-1.5 sm:space-y-2 text-[var(--color-on-surface-variant)] leading-relaxed text-sm sm:text-base">
                <p>Org.nummer: 716447-5555</p>
                <p>GA-beteckning: Ale Uddetorp GA:1</p>
                <p>Antal delägare: 114 fastigheter</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-inverse-surface)] text-white/70 py-6 sm:py-8 pb-20 sm:pb-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 text-center text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Skogstorp-Gunntorps Samfällighetsförening</p>
        </div>
      </footer>
    </div>
  );
}