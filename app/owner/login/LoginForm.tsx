"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const field =
  "w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-body">Email</span>
        <input name="email" type="email" required autoComplete="username" className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-body">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
