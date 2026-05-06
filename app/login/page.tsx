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
    <div className="min-h-screen bg-[var(--color-sand)] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-forest)]">
            Skogstorp-Gunntorp
          </h1>
          <p className="text-gray-500 mt-1">Logga in till medlemsportalen</p>
        </div>

        {params.error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {params.error === "invalid_credentials"
              ? "Fel e-post eller lösenord."
              : "Ett fel uppstod. Försök igen."}
          </div>
        )}

        <form action="/api/auth/login" method="POST" className="space-y-4">
          <input type="hidden" name="redirect" value={params.redirect || "/dashboard"} />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-forest)] focus:border-transparent"
              placeholder="din@email.se"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-forest)] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-forest)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-forest-light)] transition"
          >
            Logga in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Kontakta ordföranden om du inte har inloggningsuppgifter.
        </p>
      </div>
    </div>
  );
}