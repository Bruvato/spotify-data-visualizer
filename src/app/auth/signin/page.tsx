import { getProviders } from "next-auth/react";

import { LoginForm } from "@/components/login-form";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm providers={providers} />
      </div>
    </div>
  );
}
