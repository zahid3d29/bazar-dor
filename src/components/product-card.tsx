import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { formatPrice, Product, toBengaliNumber, unitLabel } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const TrendIcon =
    product.change.dir === "up"
      ? ArrowUp
      : product.change.dir === "down"
        ? ArrowDown
        : Minus;
  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="product-card-top">
        <span className="product-emoji">{product.image}</span>
        <span className="product-title">
          <strong>{product.nameBn}</strong>
          <small>{unitLabel(product.unit)}</small>
        </span>
      </div>
      <div className="product-price-row">
        <div>
          <small>আজকের দাম</small>
          <strong>{formatPrice(product.today)}</strong>
        </div>
        <span className={`change-badge ${product.change.dir}`}>
          <TrendIcon size={12} strokeWidth={3} />
          {toBengaliNumber(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
}
