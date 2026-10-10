"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Pencil, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedPage } from "@/components/protected-page";
import { authClient } from "@/lib/auth-client";

export function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <ProtectedPage>
      <main className="profile-main">
        <div className="profile-heading">
          <span className="profile-avatar">
            <UserRound size={27} />
          </span>
          <h1>আমার প্রোফাইল</h1>
          <p>আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>
        <section className="profile-card">
          <span className="profile-user-icon">{user?.name.slice(0, 1)}</span>
          <div className="profile-user-copy">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <Link className="button button-outline" href="/profile/edit">
            <Pencil size={15} /> তথ্য হালনাগাদ
          </Link>
        </section>
        <section className="profile-details">
          <h2>তথ্য</h2>
          <div>
            <span>নাম</span>
            <strong>{user?.name}</strong>
          </div>
          <div>
            <span>ইমেইল</span>
            <strong>{user?.email}</strong>
          </div>
        </section>
        <Link className="back-link" href="/">
          <ArrowLeft size={15} /> হোম পেজে ফিরুন
        </Link>
      </main>
    </ProtectedPage>
  );
}

export function ProfileEditPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return toast.error("নাম লিখুন");
    setSubmitting(true);
    const result = await authClient.updateUser({ name: name.trim() });
    if (result.error) {
      toast.error(result.error.message || "তথ্য হালনাগাদ করা যায়নি");
      setSubmitting(false);
      return;
    }
    toast.success("তথ্য হালনাগাদ হয়েছে");
    router.push("/profile");
  }

  return (
    <ProtectedPage>
      <main className="profile-main">
        <div className="profile-heading">
          <h1>তথ্য হালনাগাদ</h1>
          <p>আপনার প্রোফাইলের নাম পরিবর্তন করুন।</p>
        </div>
        <form className="profile-details profile-edit-form" onSubmit={submit}>
          <h2>তথ্য</h2>
          <label>
            নাম
            <input
              value={name || user?.name || ""}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <button className="button" disabled={submitting}>
            {submitting ? "আপডেট হচ্ছে..." : "আপডেট"}
          </button>
        </form>
        <Link className="back-link" href="/profile">
          <ArrowLeft size={15} /> প্রোফাইলে ফিরে যান
        </Link>
      </main>
    </ProtectedPage>
  );
}
