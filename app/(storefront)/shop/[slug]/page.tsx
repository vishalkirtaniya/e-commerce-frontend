import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "./ui/DetailsPage";
import { API_URL } from "@/lib/api";

// ── Types matching backend response ──────────────────────────
interface ApiSize {
  id: number;
  label: string;
  price: number;
  is_default: boolean;
}

interface ApiReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
  created_at: string;
}

interface ApiRelatedProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  rating: number;
  image: string | null;
}

interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  material: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  rating: number;
  review_count: number;
  is_customizable: boolean;
  category_name: string;
  images: { url: string; is_primary: boolean; sort_order: number }[];
  sizes: ApiSize[];
  occasions: { name: string; slug: string }[];
  reviews: ApiReview[];
  related_products: ApiRelatedProduct[];
}

// ── Map API → UI types ────────────────────────────────────────
function mapToProduct(p: ApiProduct) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    discount: p.discount ?? undefined,
    rating: p.rating,
    reviewCount: p.review_count,
    material: p.material,
    isCustomizable: p.is_customizable,
    images:
      p.images.length > 0
        ? p.images
            .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
            .map((img, index) => ({ id: index + 1, src: img.url }))
        : [{ id: 1, src: "/images/placeholder.png" }],
    sizes: p.sizes,
    colors: [],
  };
}

function mapToReviews(reviews: ApiReview[]) {
  return reviews.map((r) => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    comment: r.comment,
    verified: r.verified,
    date: new Date(r.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  }));
}

function mapToRelated(products: ApiRelatedProduct[]) {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    rating: p.rating,
    image: p.image ?? "/images/placeholder.png",
  }));
}

// ── Next.js 15: params is a Promise ──────────────────────────
type PageParams = Promise<{ slug: string }>;

// ── Dynamic metadata ──────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: "Product Not Found" };
    const data: ApiProduct = await res.json();
    return {
      title: `${data.name} | Santushti Trophy Craft`,
      description: data.description,
    };
  } catch {
    return { title: "Santushti Trophy Craft" };
  }
}

// ── Page component ────────────────────────────────────────────
export default async function Page({ params }: { params: PageParams }) {
  const { slug } = await params;

  const res = await fetch(`${API_URL}/api/products/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) notFound();

  const data: ApiProduct = await res.json();

  return (
    <ProductDetailPage
      product={mapToProduct(data)}
      reviews={mapToReviews(data.reviews)}
      relatedProducts={mapToRelated(data.related_products)}
    />
  );
}
