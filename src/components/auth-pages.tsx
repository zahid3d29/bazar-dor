"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function SignInPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const requestedNext = searchParams.get("next");
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  useEffect(() => {
    if (!isPending && session) router.replace(next);
  }, [isPending, next, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message || "সাইন ইন করা যায়নি");
      } else {
        toast.success("স্বাগতম, সাইন ইন সম্পন্ন হয়েছে");
        router.push(next);
      }
    } catch {
      toast.error("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-main">
      <div className="auth-heading">
        <span className="auth-eyebrow">আপনার বাজার, আপনার সঙ্গে</span>
        <h1>সাইন ইন</h1>
        <p>
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে প্রবেশ করুন।
        </p>
      </div>
      <section className="auth-panel">
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            ইমেইল
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            পাসওয়ার্ড
            <span className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="current-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          <button className="button auth-submit" disabled={submitting}>
            {submitting ? "প্রবেশ করা হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>
        <SocialButtons />
        <p className="auth-switch">
          অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link>
        </p>
      </section>
      <Link className="auth-back" href="/">
        <ArrowLeft size={14} /> হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}

export function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) return toast.error("দুটি পাসওয়ার্ড মিলছে না");
    setSubmitting(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি হয়নি");
      } else {
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
        router.push("/");
      }
    } catch {
      toast.error("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-main">
      <div className="auth-heading">
        <span className="auth-eyebrow">বাজার দর-এ স্বাগতম</span>
        <h1>অ্যাকাউন্ট তৈরি করুন</h1>
        <p>বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>
      <section className="auth-panel">
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            নাম
            <input
              required
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            ইমেইল
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            পাসওয়ার্ড
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label>
            পাসওয়ার্ড নিশ্চিত করুন
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </label>
          <button className="button auth-submit" disabled={submitting}>
            {submitting ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>
        <SocialButtons />
        <p className="auth-switch">
          অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link>
        </p>
      </section>
      <Link className="auth-back" href="/">
        <ArrowLeft size={14} /> হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}

function SocialButtons() {
  const providers = {
    google: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true",
    github: process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "true",
  };

  async function socialSignIn(provider: "google" | "github") {
    if (!providers[provider]) {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} OAuth চালু করতে সার্ভার কনফিগারেশন প্রয়োজন`,
      );
      return;
    }
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (result.error)
        toast.error(
          result.error.message || `${provider} দিয়ে সাইন ইন করা যায়নি`,
        );
    } catch {
      toast.error("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <>
      <div className="divider">
        <span>অথবা</span>
      </div>
      <div className="social-buttons">
        <button type="button" onClick={() => void socialSignIn("google")}>
          <span className="provider-mark google-mark">G</span> Google দিয়ে
          চালিয়ে যান
        </button>
        <button type="button" onClick={() => void socialSignIn("github")}>
          <span className="provider-mark">GH</span> GitHub দিয়ে চালিয়ে যান
        </button>
      </div>
    </>
  );
}

function AuthSkeleton() {
  return (
    <main className="auth-main">
      <div className="auth-skeleton" />
    </main>
  );
}
