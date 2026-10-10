"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowUp, ArrowDown, Minus, MapPin } from "lucide-react";
import { useApp } from "@/app/providers";
import { authClient } from "@/lib/auth-client";
import { EmptyState, ProductSkeletons } from "@/components/loading";
import {
  formatPrice,
  getAveragePrice,
  Product,
  toBengaliNumber,
  unitLabel,
} from "@/lib/data";

export function ProductDetailPage({ slug }: { slug: string }) {
  const { products, loading } = useApp();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const router = useRouter();
  const product = products.find((item) => item.slug === slug);

  useEffect(() => {
    if (!loading && product && !sessionPending && !session) {
      toast.error("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন");
      router.replace(`/signin?next=/product/${slug}`);
    }
  }, [loading, product, router, session, sessionPending, slug]);

  if (loading)
    return (
      <main className="page-main detail-main">
        <ProductSkeletons count={3} />
      </main>
    );
  if (!product)
    return (
      <main className="page-main detail-main">
        <EmptyState
          title="পণ্যটি পাওয়া যায়নি"
          message="এই পণ্যের কোনো তথ্য নেই।"
        />
      </main>
    );
  if (sessionPending || !session)
    return (
      <main className="page-main detail-main">
        <ProductSkeletons count={3} />
      </main>
    );

  const values = product.markets.flatMap((market) => [market.min, market.max]);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);
  const averagePrice = getAveragePrice(product);
  const Trend =
    product.change.dir === "up"
      ? ArrowUp
      : product.change.dir === "down"
        ? ArrowDown
        : Minus;

  return (
    <main className="page-main detail-main">
      <div className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span>›</span>
        <Link href={`/category/${product.category}`}>
          {product.categoryNameBn}
        </Link>
        <span>›</span>
        <span>{product.nameBn}</span>
      </div>
      <section className="detail-summary">
        <div className="detail-product">
          <span className="detail-emoji">{product.image}</span>
          <div>
            <h1>{product.nameBn}</h1>
            <p>
              {product.categoryNameBn} · {unitLabel(product.unit)}
            </p>
            <span className="market-summary">
              <MapPin size={14} /> {product.markets.length}টি বাজার থেকে সংগৃহীত
            </span>
          </div>
        </div>
        <div className="current-price">
          <small>আজকের দাম</small>
          <strong>{formatPrice(product.today)}</strong>
          <span>{unitLabel(product.unit)}</span>
          <em className={`change-inline ${product.change.dir}`}>
            <Trend size={13} />
            {toBengaliNumber(Math.abs(product.change.pct))}%
          </em>
        </div>
      </section>
      <section className="detail-content">
        <h2>দামের সারসংক্ষেপ</h2>
        <div className="price-summary-grid">
          <PriceSummary label="সর্বনিম্ন দাম" value={minPrice} tone="low" />
          <PriceSummary label="সর্বোচ্চ দাম" value={maxPrice} tone="high" />
          <PriceSummary label="গড় দাম" value={averagePrice} tone="average" />
        </div>
        <div className="market-table-heading">
          <div>
            <h2>বাজারভিত্তিক আজকের দাম</h2>
            <p>বিভিন্ন বাজারের সর্বশেষ মূল্য তুলনা করুন</p>
          </div>
          <span>{product.markets.length}টি বাজার</span>
        </div>
        <div className="table-scroll">
          <table className="market-table">
            <thead>
              <tr>
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th>সর্বনিম্ন</th>
                <th>সর্বোচ্চ</th>
                <th>গড়</th>
              </tr>
            </thead>
            <tbody>
              {product.markets.map((market) => (
                <tr key={`${market.market}-${market.division}`}>
                  <td>{market.market}</td>
                  <td>{market.division}</td>
                  <td>{formatPrice(market.min)}</td>
                  <td>{formatPrice(market.max)}</td>
                  <td>
                    {formatPrice(Math.round((market.min + market.max) / 2))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Link className="back-link" href={`/category/${product.category}`}>
        <ArrowLeft size={16} /> {product.categoryNameBn} বিভাগে ফিরুন
      </Link>
    </main>
  );
}

function PriceSummary({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={`price-summary ${tone}`}>
      <small>{label}</small>
      <strong>{formatPrice(value)}</strong>
      <span>
        {toBengaliNumber(value)} টাকা / {"একক"}
      </span>
    </div>
  );
}

export function productSubtitle(product: Product) {
  return `${product.nameBn} · ${product.categoryNameBn} · ${unitLabel(product.unit)}`;
}
