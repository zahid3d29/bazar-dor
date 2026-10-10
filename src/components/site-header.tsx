"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { formatPrice, Product, toBengaliNumber } from "@/lib/data";
import { useApp } from "@/app/providers";

export function SiteHeader() {
  const { categories, products } = useApp();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const movers = products.slice(0, 12);
  const [today, setToday] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      setToday(
        new Intl.DateTimeFormat("bn-BD", { dateStyle: "long" }).format(
          new Date(),
        ),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function openProtectedProfile() {
    setMenuOpen(false);
    if (!user) {
      router.push("/signin?next=/profile");
      return;
    }
    router.push("/profile");
  }

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/" aria-label="বাজার দর হোম পেজ">
            <span className="brand-mark">৳</span>
            <span className="brand-copy">
              <strong>বাজার দর</strong>
              <small>{today}</small>
            </span>
          </Link>
          <div className="account-actions">
            {mounted && user ? (
              <div className="account-wrap">
                <button
                  className="account-trigger"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                >
                  <span className="avatar">{user.name.slice(0, 1)}</span>
                  <span>{user.name}</span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div className="account-menu">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                    <button onClick={openProtectedProfile}>
                      <UserRound size={15} /> আমার প্রোফাইল
                    </button>
                    <button
                      className="logout-link"
                      onClick={async () => {
                        await authClient.signOut();
                        toast.success("সাইন আউট সম্পন্ন হয়েছে");
                        setMenuOpen(false);
                      }}
                    >
                      <LogOut size={15} /> সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="signin-link" href="/signin">
                  সাইন ইন
                </Link>
                <Link className="button button-small" href="/signup">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <nav className="category-nav" aria-label="পণ্যের বিভাগ">
        <div className="category-nav-inner">
          <Link
            href="/"
            className={`nav-category ${pathname === "/" ? "active" : ""}`}
          >
            <span>⌂</span> সব পণ্য
          </Link>
          {mounted &&
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`nav-category ${pathname === `/category/${category.slug}` ? "active" : ""}`}
              >
                <span>{category.icon}</span>
                {category.nameBn}
              </Link>
            ))}
        </div>
      </nav>
      <div className="ticker" aria-label="আজকের বাজারদর">
        <div className="ticker-track">
          {mounted &&
            [...movers, ...movers].map((product: Product, index) => (
              <TickerItem key={`${product.id}-${index}`} product={product} />
            ))}
          {(!mounted || movers.length === 0) && (
            <span className="ticker-placeholder">🍚 বাজারের আজকের দর</span>
          )}
        </div>
      </div>
    </header>
  );
}

function TickerItem({ product }: { product: Product }) {
  const rising = product.change.dir === "up";
  const falling = product.change.dir === "down";
  return (
    <span className="ticker-item">
      <span>{product.image}</span> {product.nameBn}{" "}
      <b>{formatPrice(product.today)}</b>{" "}
      <em
        className={
          rising ? "change-up" : falling ? "change-down" : "change-flat"
        }
      >
        {rising ? "▲" : falling ? "▼" : "—"}{" "}
        {toBengaliNumber(Math.abs(product.change.pct))}%
      </em>
    </span>
  );
}
