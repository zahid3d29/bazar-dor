"use client";

import { ArrowDownRight, ArrowUpRight, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductSkeletons } from "@/components/loading";
import { useApp } from "@/app/providers";

export function HomePage() {
  const { products, loading, error } = useApp();
  const gainers = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallers = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <main className="page-main home-main">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">আজকের বাজার, এক নজরে</span>
          <h1>আজকের বাজারের দাম এক নজরে</h1>
          <p>
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, দ্রুত, সবসময়-সর্বশেষ এবং সহজে তুলনা করার জন্য।
          </p>
          <a className="button" href="#সব-পণ্য">
            সব পণ্য দেখুন <ArrowRight size={16} />
          </a>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <span className="produce produce-one">🍅</span>
          <span className="produce produce-two">🥕</span>
          <span className="produce produce-three">🫑</span>
          <span className="produce produce-four">🍊</span>
          <span className="basket">▰</span>
          <span className="basket-base" />
        </div>
      </section>

      {loading ? (
        <section className="data-section">
          <SectionTitle title="আজ দাম বেড়েছে" rising />
          <ProductSkeletons />
          <SectionTitle title="আজ দাম কমেছে" />
          <ProductSkeletons />
          <SectionTitle title="সব পণ্য" />
          <ProductSkeletons count={9} />
        </section>
      ) : error ? (
        <div className="inline-error">{error}</div>
      ) : (
        <>
          <ProductSection title="আজ দাম বেড়েছে" products={gainers} rising />
          <ProductSection title="আজ দাম কমেছে" products={fallers} />
          <section className="data-section" id="সব-পণ্য">
            <div className="section-heading">
              <div>
                <SectionTitle title="সব পণ্য" />
                <p>বাজারের সব প্রয়োজনীয় পণ্যের সর্বশেষ দর</p>
              </div>
              <span className="product-count">{products.length}টি পণ্য</span>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function ProductSection({
  title,
  products,
  rising,
}: {
  title: string;
  products: ReturnType<typeof useApp>["products"];
  rising?: boolean;
}) {
  const Trend = rising ? ArrowUpRight : ArrowDownRight;
  return (
    <section className="data-section">
      <div className={`section-title ${rising ? "red" : "green"}`}>
        <Trend size={18} strokeWidth={3} />
        <h2>{title}</h2>
        <span className="section-rule" />
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <p className="muted-copy">এই মুহূর্তে কোনো পরিবর্তনের তথ্য নেই।</p>
      )}
    </section>
  );
}

function SectionTitle({ title, rising }: { title: string; rising?: boolean }) {
  const Trend = rising ? ArrowUpRight : ArrowDownRight;
  return (
    <div className={`section-title ${rising ? "red" : "green"}`}>
      <Trend size={18} strokeWidth={3} />
      <h2>{title}</h2>
      <span className="section-rule" />
    </div>
  );
}
