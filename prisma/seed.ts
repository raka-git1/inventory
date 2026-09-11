import { PrismaClient, StockMovementType } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  ["Air Mineral 600ml", "MIN-001", 48, 10, 3500],
  ["Teh Botol 450ml", "MIN-002", 32, 10, 5000],
  ["Kopi Sachet", "MIN-003", 18, 8, 2500],
  ["Indomie Goreng", "MKN-001", 55, 15, 3500],
  ["Biskuit Cokelat", "MKN-002", 27, 10, 8000],
  ["Mi Instan Kuah", "MKN-003", 42, 12, 3200],
  ["Pulpen Biru", "ATK-001", 64, 20, 3000],
  ["Buku Tulis", "ATK-002", 36, 12, 6500],
  ["Kertas A4 80gsm", "ATK-003", 14, 5, 55000],
  ["Mouse Wireless", "ELK-001", 11, 5, 85000],
  ["Keyboard USB", "ELK-002", 9, 5, 120000],
  ["Kabel USB-C", "ELK-003", 23, 8, 45000],
  ["Lakban Bening", "PRL-001", 31, 10, 12000],
  ["Gunting Serbaguna", "PRL-002", 16, 6, 18000],
  ["Kantong Belanja", "PRL-003", 70, 20, 25000],
] as const;

async function main() {
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();

  for (const [name, sku, stock, minimumStock, price] of products) {
    const product = await prisma.product.create({
      data: { name, sku, stock, minimumStock, price },
    });

    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        quantity: stock,
        type: StockMovementType.IN,
        note: "Stok awal dari seed Fase 1",
      },
    });
  }

  console.log(`Seed selesai: ${products.length} produk dibuat.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
