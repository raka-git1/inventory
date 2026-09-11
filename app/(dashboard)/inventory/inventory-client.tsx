"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minimumStock: number;
  price: number;
};

type Props = { initialProducts: Product[] };

export default function InventoryClient({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", stock: "0", minimumStock: "0", price: "" });

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return products;
    return products.filter((p) => p.name.toLowerCase().includes(keyword) || p.sku.toLowerCase().includes(keyword));
  }, [products, search]);

  async function addProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error ?? "Gagal menambahkan produk.");
        return;
      }
      setProducts((current) => [data, ...current]);
      setForm({ name: "", sku: "", stock: "0", minimumStock: "0", price: "" });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error ?? "Gagal menghapus produk.");
        return;
      }
      setProducts((current) => current.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Tidak bisa terhubung ke server.");
    }
  }

  async function stockMovement(productId: string, type: "IN" | "OUT") {
    const quantityText = window.prompt(type === "IN" ? "Stock In — jumlah:" : "Stock Out — jumlah:");
    if (quantityText === null) return;
    const quantity = Number(quantityText);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Jumlah harus angka bulat lebih dari 0.");
      return;
    }
    const note = window.prompt("Catatan (opsional):") ?? "";

    try {
      const response = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, type, note }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error ?? "Gagal memperbarui stock.");
        return;
      }
      setProducts((current) => current.map((p) => p.id === productId ? { ...p, stock: data.product.stock } : p));
    } catch (error) {
      console.error(error);
      alert("Tidak bisa terhubung ke server.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Kelola produk dan stock.</p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {showForm ? "Batal" : "+ Tambah Produk"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProduct} className="space-y-4 rounded-lg border p-4">
          <h2 className="font-semibold">Tambah Produk</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-md border bg-background px-3 py-2" placeholder="Nama produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="rounded-md border bg-background px-3 py-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <input className="rounded-md border bg-background px-3 py-2" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input className="rounded-md border bg-background px-3 py-2" type="number" min="0" placeholder="Minimum stock" value={form.minimumStock} onChange={(e) => setForm({ ...form, minimumStock: e.target.value })} />
            <input className="rounded-md border bg-background px-3 py-2" type="number" min="0" step="0.01" placeholder="Harga" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </form>
      )}

      <div className="rounded-lg border">
        <div className="border-b p-4">
          <input className="w-full rounded-md border bg-background px-3 py-2" placeholder="Cari nama produk atau SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">Produk</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">Minimum</th>
                <th className="px-4 py-3 text-right">Harga</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-3 text-right">{product.stock}</td>
                  <td className="px-4 py-3 text-right">{product.minimumStock}</td>
                  <td className="px-4 py-3 text-right">Rp {product.price.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => stockMovement(product.id, "IN")} className="rounded border px-2 py-1 text-xs">+ Stock</button>
                      <button type="button" onClick={() => stockMovement(product.id, "OUT")} className="rounded border px-2 py-1 text-xs">- Stock</button>
                      <button type="button" onClick={() => deleteProduct(product.id)} className="rounded border px-2 py-1 text-xs">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Produk tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
