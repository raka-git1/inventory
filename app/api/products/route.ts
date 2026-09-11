import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    minimumStock: product.minimumStock,
    price: Number(product.price),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const sku = String(body.sku ?? "").trim();
    const stock = Number(body.stock);
    const minimumStock = Number(body.minimumStock);
    const price = Number(body.price);

    if (!name || !sku) {
      return NextResponse.json({ error: "Nama dan SKU wajib diisi." }, { status: 400 });
    }
    if (!Number.isInteger(stock) || stock < 0 || !Number.isInteger(minimumStock) || minimumStock < 0) {
      return NextResponse.json({ error: "Stock dan minimum stock harus angka bulat 0 atau lebih." }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Harga tidak valid." }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return NextResponse.json({ error: "SKU sudah digunakan." }, { status: 409 });
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: { name, sku, stock, minimumStock, price },
      });

      if (stock > 0) {
        await tx.stockMovement.create({
          data: { productId: created.id, quantity: stock, type: "IN", note: "Stock awal" },
        });
      }
      return created;
    });

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error("POST /api/products", error);
    return NextResponse.json({ error: "Gagal membuat produk." }, { status: 500 });
  }
}
