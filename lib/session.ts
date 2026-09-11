import { cookies } from "next/headers";

export const SESSION_COOKIE = "smart_inventory_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long.");
  }
  return secret;
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return base64Url(new Uint8Array(signature));
}

export async function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${expiresAt}.${await sign(String(expiresAt))}`;
}

export async function verifySessionToken(token?: string) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiresAt, signature] = parts;
  const expires = Number(expiresAt);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000)) return false;

  const expected = await sign(expiresAt);
  if (signature.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export function getSessionToken() {
  return cookies().get(SESSION_COOKIE)?.value;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
