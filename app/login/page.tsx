import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  return <LoginForm searchParams={searchParams} />;
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Skogstorp-Gunntorp
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm sm:text-base">Logga in till medlemsportalen</p>
        </div>

        {params.error && (
          <div className="bg-red-50 border border-red-200 text-error rounded-[10px] p-3 mb-4 text-sm">
            {params.error === "invalid_credentials"
              ? "Fel e-post eller lösenord."
              : "Ett fel uppstod. Försök igen."}
          </div>
        )}

        <form action="/api/auth/login" method="POST" className="space-y-5">
          <input type="hidden" name="redirect" value={params.redirect || "/dashboard"} />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
              E-post
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-outline-variant rounded-[10px] bg-surface text-on-surface text-base focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
              placeholder="din@email.se"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-1.5">
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-outline-variant rounded-[10px] bg-surface text-on-surface text-base focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white py-3 rounded-[10px] font-semibold text-base hover:brightness-110 transition"
          >
            Logga in
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6 px-2">
          Kontakta ordföranden om du inte har inloggningsuppgifter.
        </p>
      </div>
    </div>
  );
}