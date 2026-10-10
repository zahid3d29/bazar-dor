export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
  markets: Market[];
};

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export function getProducts() {
  return fetchCatalog<Product[]>("products");
}

export function getCategories() {
  return fetchCatalog<Category[]>("categories");
}

async function fetchCatalog<T>(resource: "products" | "categories") {
  const response = await fetch(`/api/catalog/${resource}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(
      "বাজারের তথ্য এখন পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
    );
  }
  return (await response.json()) as T;
}

export function toBengaliNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 }).format(value)} টাকা`;
}

export function unitLabel(unit: string) {
  const labels: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };
  return labels[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

export function getAveragePrice(product: Product) {
  return Math.round(
    (product.today +
      product.markets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0,
      )) /
      (product.markets.length + 1),
  );
}

export function sortProducts(products: Product[], order: string) {
  return [...products].sort((first, second) => {
    if (order === "ascending") return first.today - second.today;
    if (order === "descending") return second.today - first.today;
    return first.id - second.id;
  });
}
