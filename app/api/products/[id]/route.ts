import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: { id: string } };

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id]", error);
    return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 500 });
  }
}
