"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Newspaper,
  Bug,
  FileText,
  Users,
  Calendar,
  Map,
  Wrench,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Översikt", href: "/dashboard", icon: Home, roles: ["admin", "styrelse", "medlem"] },
  { name: "Nyheter", href: "/dashboard/news", icon: Newspaper, roles: ["admin", "styrelse", "medlem"] },
  { name: "Problem", href: "/dashboard/issues", icon: Bug, roles: ["admin", "styrelse", "medlem"] },
  { name: "Dokument", href: "/dashboard/documents", icon: FileText, roles: ["admin", "styrelse", "medlem"] },
  { name: "Medlemmar", href: "/dashboard/members", icon: Users, roles: ["admin", "styrelse"] },
  { name: "Möten", href: "/dashboard/meetings", icon: Calendar, roles: ["admin", "styrelse", "medlem"] },
  { name: "Karta", href: "/dashboard/map", icon: Map, roles: ["admin", "styrelse", "medlem"] },
  { name: "Underhåll", href: "/dashboard/maintenance", icon: Wrench, roles: ["admin", "styrelse"] },
  { name: "Avgifter", href: "/dashboard/fees", icon: DollarSign, roles: ["admin", "styrelse", "medlem"] },
  { name: "Inställningar", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const filteredNav = navigation.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-[var(--color-forest)] text-white">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold">Skogstorp-Gunntorp</h1>
          <p className="text-xs opacity-70">Medlemsportal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-white/20 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <form action="/api/auth/logout" method="POST">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/10 w-full transition">
              <LogOut size={18} />
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-forest)] text-white z-50 border-t border-white/10">
        <div className="flex justify-around py-2">
          {filteredNav.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                <item.icon size={20} />
                <span className="truncate max-w-[60px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}