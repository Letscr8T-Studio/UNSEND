"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  checkCredentials,
  clearFailedLogins,
  createSessionToken,
  getClientIp,
  isRateLimited,
  recordFailedLogin,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export type LoginState = { error?: string };

const GENERIC_ERROR = "Wrong email or password.";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || email.length > 254 || password.length > 200) {
    recordFailedLogin(ip);
    return { error: GENERIC_ERROR };
  }

  const token = checkCredentials(email, password) ? createSessionToken(email) : null;
  if (!token) {
    recordFailedLogin(ip);
    return { error: GENERIC_ERROR };
  }

  clearFailedLogins(ip);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
  redirect("/owner/dashboard");
}
