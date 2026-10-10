"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Category, getCategories, getProducts, Product } from "@/lib/data";

type AppContextValue = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([items, groups]) => {
        setProducts(items);
        setCategories(groups);
      })
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error ? reason.message : "তথ্য লোড করা যায়নি।",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProviders");
  return value;
}
