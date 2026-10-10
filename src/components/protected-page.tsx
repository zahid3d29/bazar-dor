"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("এই পৃষ্ঠাটি দেখতে সাইন ইন করুন");
      router.replace("/signin?next=/profile");
    }
  }, [isPending, router, session]);

  if (isPending || !session)
    return (
      <main className="page-main protected-loading">
        <div className="loading-mark" />
      </main>
    );
  return <>{children}</>;
}
