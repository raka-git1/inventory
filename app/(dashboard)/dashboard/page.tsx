import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      stock: true,
      minimumStock: true,
      price: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minimumStock
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.stock * Number(product.price),
    0
  );

  // Ambil maksimal 8 produk untuk grafik
  const chartProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8);

  const maxStock =
    chartProducts.length > 0
      ? Math.max(...chartProducts.map((product) => product.stock))
      : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">
          Ringkasan inventory kamu.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Total Produk
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalProducts}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Total Stock
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalStock}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Low Stock
          </p>

          <p className="mt-2 text-3xl font-bold">
            {lowStockProducts.length}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Nilai Inventory
          </p>

          <p className="mt-2 text-2xl font-bold">
            Rp {inventoryValue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Grafik Stock */}
      <div className="rounded-lg border p-5">
        <div>
          <h2 className="font-semibold">
            Stock Produk
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Produk dengan jumlah stock terbanyak.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {chartProducts.map((product) => {
            const percentage =
              maxStock > 0
                ? (product.stock / maxStock) * 100
                : 0;

            return (
              <div key={product.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate pr-4 font-medium">
                    {product.name}
                  </span>

                  <span className="shrink-0 text-muted-foreground">
                    {product.stock}
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-muted">
                  <div
                    className="h-3 rounded-full bg-primary"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {chartProducts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada data produk.
            </p>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-lg border p-5">
          <div>
            <h2 className="font-semibold">
              ⚠️ Low Stock
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Produk yang stock-nya sudah mencapai atau di bawah
              minimum.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">
                    {product.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock} · Minimum:{" "}
                    {product.minimumStock}
                  </p>
                </div>

                <span className="rounded-md border px-2 py-1 text-xs font-medium">
                  Low
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Aman */}
      {lowStockProducts.length === 0 && (
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold">
            ✅ Stock Aman
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tidak ada produk yang berada di bawah minimum stock.
          </p>
        </div>
      )}
    </div>
  );
}