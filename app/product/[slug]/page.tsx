import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { products } from "@/lib/catalog";
import { getStorefront } from "@/lib/storefront";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products: live } = await getStorefront();
  const product = live.find((item) => item.slug === slug);
  return { title: product?.name ?? "Piece" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { products: live } = await getStorefront();
  const product = live.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductView key={product.slug} product={product} />;
}
