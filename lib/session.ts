import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session_token";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 hari
};

const secretKey = process.env.SESSION_SECRET || "default_secret_key_change_me_in_production";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  expiresAt?: Date;
  [key: string]: any;
};

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(token: string | undefined = ""): Promise<SessionPayload | null> {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

// Alias fungsi untuk kompatibilitas
export const encrypt = createSessionToken;
export const decrypt = verifySessionToken;