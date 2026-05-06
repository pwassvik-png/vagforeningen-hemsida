import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirect = formData.get("redirect") as string || "/dashboard";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "invalid_credentials");
    url.searchParams.set("redirect", redirect);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL(redirect, request.url));
}