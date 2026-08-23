export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Log in</h1>
      {/* TODO (auth): email/password + Google sign-in form.
          react-hook-form + @hookform/resolvers(zod) are already installed —
          pair with the Zod schema in features/auth/auth.types.ts. On
          success, call setToken() from lib/auth-token.ts and
          useAuthStore.setUser() from features/auth/auth.store.ts. */}
    </main>
  );
}
