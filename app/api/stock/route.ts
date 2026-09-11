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
    const productId = String(body.productId ?? "");
    const quantity = Number(body.quantity);
    const type = body.type === "IN" || body.type === "OUT" ? body.type : null;
    const note = String(body.note ?? "").trim();

    if (!productId) return NextResponse.json({ error: "Produk wajib dipilih." }, { status: 400 });
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Quantity harus angka bulat lebih dari 0." }, { status: 400 });
    }
    if (!type) return NextResponse.json({ error: "Tipe stock tidak valid." }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("PRODUCT_NOT_FOUND");
      if (type === "OUT" && product.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

      const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;
      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });
      const movement = await tx.stockMovement.create({
        data: { productId, quantity, type, note: note || null },
      });
      return { updated, movement };
    });

    return NextResponse.json({ product: serializeProduct(result.updated), movement: result.movement });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "Stock tidak mencukupi." }, { status: 400 });
    }
    console.error("POST /api/stock", error);
    return NextResponse.json({ error: "Gagal memperbarui stock." }, { status: 500 });
  }
}
