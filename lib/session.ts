import { SignJWT, jwtVerify } from "jose";

// Mengambil secret key dari Environment Variable atau menggunakan fallback default
const secretKey = process.env.SESSION_SECRET || "default_secret_key_change_me_in_production";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
  [key: string]: any;
};

/**
 * Mengubah Uint8Array menjadi string Base64URL
 * Memperbaiki masalah iterasi TypeScript pada Uint8Array
 */
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

/**
 * Membuat Token JWT Session
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Memverifikasi Token JWT Session
 */
export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Gagal melakukan verifikasi session token:", error);
    return null;
  }
}