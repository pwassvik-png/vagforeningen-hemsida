"use client";

export function TopBar({ member }: { member: { name: string; role: string } | null }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
      <div>
        <h2 className="font-semibold text-[var(--color-forest)]">Skogstorp-Gunntorp</h2>
        {member && (
          <p className="text-xs text-gray-500">{member.name} ({member.role})</p>
        )}
      </div>
    </header>
  );
}