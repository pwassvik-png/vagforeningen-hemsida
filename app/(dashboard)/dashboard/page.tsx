import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: issueCount } = await supabase
    .from("issues")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  const { count: newsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const firstName = user?.email ? user.email.split("@")[0] : "Medlem";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)]">
          Översikt
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1">
          Välkommen tillbaka, {firstName}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <StatCard
          title="Medlemmar"
          value={memberCount?.toString() || "0"}
          icon="👥"
          accent="secondary"
        />
        <StatCard
          title="Öppna ärenden"
          value={issueCount?.toString() || "0"}
          icon="🐛"
          accent={issueCount && issueCount > 0 ? "warning" : "secondary"}
        />
        <StatCard
          title="Nyheter"
          value={newsCount?.toString() || "0"}
          icon="📰"
          accent="secondary"
        />
        <StatCard
          title="Årsavgift"
          value="963 kr"
          icon="💰"
          accent="secondary"
          subtitle="per andel"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <QuickAction
          href="/dashboard/issues"
          title="Rapportera problem"
          description="Vägskador, vegetation, snö"
          icon="🐛"
        />
        <QuickAction
          href="/dashboard/news"
          title="Läs nyheter"
          description="Senaste kungörelserna"
          icon="📰"
        />
        <QuickAction
          href="/dashboard/documents"
          title="Hämta dokument"
          description="Protokoll, stadgar, budget"
          icon="📄"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-outline-variant)] shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Senaste aktivitet</h2>
        <div className="text-sm text-[var(--color-on-surface-variant)] py-4 text-center">
          Aktivitet kommer att visas här när medlemmar börjar använda portalen.
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent,
  subtitle,
}: {
  title: string;
  value: string;
  icon: string;
  accent: "secondary" | "warning";
  subtitle?: string;
}) {
  const accentBg =
    accent === "warning"
      ? "bg-orange-50 border-orange-200"
      : "bg-[var(--color-secondary)]/5 border-transparent";

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-[var(--color-outline-variant)] shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${accentBg} flex items-center justify-center text-lg sm:text-xl shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)]">{title}</p>
          <p className="text-lg sm:text-xl font-semibold text-[var(--color-on-surface)]">{value}</p>
          {subtitle && (
            <p className="text-xs text-[var(--color-on-surface-variant)]">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-[var(--color-outline-variant)] shadow-sm hover:shadow-md hover:border-[var(--color-secondary)]/30 transition group flex items-center gap-3"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--color-secondary)]/5 flex items-center justify-center text-lg sm:text-xl shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm sm:text-base text-[var(--color-on-surface)] group-hover:text-[var(--color-secondary)] transition">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)]">{description}</p>
      </div>
    </a>
  );
}