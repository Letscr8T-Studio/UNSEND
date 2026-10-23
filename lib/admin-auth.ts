import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

// Founders-only auth. Credentials live in env vars (ADMIN_EMAILS, ADMIN_PASSWORD,
// ADMIN_SESSION_SECRET). The session is a signed cookie: "<expiry>.<email>.<signature>".
// Server-only: never import this into a "use client" component.

export const SESSION_COOKIE = "unsend_owner";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Constant-time string comparison (hashing first makes the lengths equal).
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

// Returns true only for a listed admin email with the right password.
// Always runs both checks so timing doesn't reveal which one was wrong.
export function checkCredentials(email: string, password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !getSecret()) {
    console.error("[owner] ADMIN_PASSWORD / ADMIN_SESSION_SECRET (32+ chars) are not set. Login is disabled.");
    return false;
  }
  const candidate = email.trim().toLowerCase();
  let emailOk = false;
  for (const allowed of adminEmails()) {
    if (safeEqual(candidate, allowed)) emailOk = true;
  }
  const passwordOk = safeEqual(password, adminPassword);
  return emailOk && passwordOk;
}

export function createSessionToken(email: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${expires}.${Buffer.from(email.trim().toLowerCase()).toString("base64url")}`;
  return `${payload}.${sign(payload, secret)}`;
}

// Returns the admin's email if the token is genuine, unexpired and still allowed.
export function verifySessionToken(token: string | undefined | null): string | null {
  const secret = getSecret();
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [expires, emailPart, signature] = parts;
  if (!safeEqual(sign(`${expires}.${emailPart}`, secret), signature)) return null;
  if (!(Number(expires) > Date.now() / 1000)) return null;
  const email = Buffer.from(emailPart, "base64url").toString();
  return adminEmails().includes(email) ? email : null;
}

export async function getAdminSession(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// For /owner pages: send anyone not logged in to the login form.
export async function requireAdmin(): Promise<string> {
  const email = await getAdminSession();
  if (!email) redirect("/owner/login");
  return email;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

// ---- Login rate limit: 5 failed tries per IP per 15 minutes (in-memory) ----
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map<string, { count: number; resetAt: number }>();

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = fails.get(ip);
  if (!entry || entry.resetAt <= now) return false;
  return entry.count >= MAX_FAILS;
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  if (fails.size > 1000) {
    for (const [key, value] of fails) if (value.resetAt <= now) fails.delete(key);
  }
  const entry = fails.get(ip);
  if (!entry || entry.resetAt <= now) fails.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
}

export function clearFailedLogins(ip: string) {
  fails.delete(ip);
}
