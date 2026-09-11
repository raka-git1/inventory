import { NextResponse } from "next/server";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "Server authentication is not configured." }, { status: 500 });
  }

  if (body?.username !== username || body?.password !== password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: SESSION_COOKIE, value: await createSessionToken(), ...sessionCookieOptions });
  return response;
}
