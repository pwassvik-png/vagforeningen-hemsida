export default async function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Översikt</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Medlemmar" value="114" icon="👥" />
        <StatCard title="Aktiva problem" value="—" icon="🐛" />
        <StatCard title="Årsavgift" value="963 kr/andel" icon="💰" />
        <StatCard title="Nästa möte" value="—" icon="🏛️" />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Senaste nyheter</h2>
        <p className="text-gray-500">Inga nyheter ännu. Nyheter kommer att visas här när de publiceras.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}