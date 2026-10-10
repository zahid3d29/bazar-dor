"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useApp } from "@/app/providers";
import { ProductCard } from "@/components/product-card";
import { EmptyState, ProductSkeletons } from "@/components/loading";
import { sortProducts } from "@/lib/data";

export function CategoryPage({ slug }: { slug: string }) {
  const { products, categories, loading, error } = useApp();
  const [sort, setSort] = useState("default");
  const category = categories.find((item) => item.slug === slug);
  const categoryProducts = useMemo(
    () =>
      sortProducts(
        products.filter((product) => product.category === slug),
        sort,
      ),
    [products, slug, sort],
  );

  if (loading)
    return (
      <main className="page-main category-main">
        <ProductSkeletons count={6} />
      </main>
    );
  if (!category || (categoryProducts.length === 0 && !error))
    return (
      <main className="page-main category-main">
        <EmptyState
          title="বিভাগটি পাওয়া যায়নি"
          message="এই নামে কোনো পণ্য বিভাগ নেই।"
        />
      </main>
    );

  return (
    <main className="page-main category-main">
      <div className="category-banner">
        <div className="category-heading">
          <span className="category-large-icon">{category.icon}</span>
          <div>
            <h1>{category.nameBn}</h1>
            <p>{categoryProducts.length}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </div>
        <div className="sort-control">
          <label htmlFor="sort-products">সাজান</label>
          <div className="select-wrap">
            <select
              id="sort-products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="default">ডিফল্ট</option>
              <option value="ascending">দাম: কম থেকে বেশি</option>
              <option value="descending">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      <div className="category-results">
        <div className="results-meta">
          <span>
            {error || `মোট ${categoryProducts.length}টি পণ্য দেখানো হচ্ছে`}
          </span>
          <Link href="/">সব পণ্য দেখুন</Link>
        </div>
        {categoryProducts.length ? (
          <div className="product-grid">
            {categoryProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="কোনো পণ্য নেই"
            message="এই বিভাগে এখন কোনো পণ্য পাওয়া যাচ্ছে না।"
          />
        )}
      </div>
    </main>
  );
}
