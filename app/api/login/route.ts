import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, id } = body;

    // Menggunakan ID dari request body, atau buat fallback string opsional
    const userId = id || email || "user_default";

    const response = NextResponse.json({ ok: true });

    // Membuat session token dengan userId yang sudah terdefinisi
    const token = await createSessionToken({ userId });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      ...sessionCookieOptions,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Gagal memproses login" },
      { status: 400 }
    );
  }
}