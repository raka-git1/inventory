import { prisma } from "@/lib/prisma";
import InventoryClient from "./inventory-client";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    minimumStock: product.minimumStock,
    price: Number(product.price),
  }));

  return <InventoryClient initialProducts={serializedProducts} />;
}