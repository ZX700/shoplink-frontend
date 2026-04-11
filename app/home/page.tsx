"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("none");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category === "All" ? true : p.category === category
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <main style={{ padding: 20 }}>
      <h1>Marketplace</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>All</option>
        <option>Electronics</option>
        <option>Fashion</option>
        <option>Furniture</option>
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="none">Sort</option>
        <option value="low">Low → High</option>
        <option value="high">High → Low</option>
      </select>

      <ul>
  {filteredProducts.map((p) => (
    <li key={p.id}>
      {/* Link directly to the product's real ID */}
      <a href={`/product/${p.id}`}>
        {p.name} — ${p.price} ({p.category})
      </a>
    </li>
  ))}
</ul>

    </main>
  );
}
