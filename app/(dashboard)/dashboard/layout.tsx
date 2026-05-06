import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const member = profile
    ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      }
    : null;

  return (
    <div className="min-h-screen bg-[var(--color-sand)] flex">
      <Sidebar role={member?.role || "medlem"} />
      <div className="flex-1 md:ml-64">
        <TopBar member={member} />
        <main className="p-4 md:p-6 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}