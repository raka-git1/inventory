import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  // ... logika validasi email/password kamu ...
  // contoh: const user = await prisma.user.findUnique(...);

  const response = NextResponse.json({ ok: true });

  // Masukkan payload (misal userId) ke dalam createSessionToken
  const token = await createSessionToken({ userId: user.id });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    ...sessionCookieOptions,
  });

  return response;
}