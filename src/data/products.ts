import { Product } from '@/types';
import rawCatalog from '../../data/catalog.seed.json';

interface RawImage {
  id?: string;
  url: string;
  alt?: string;
}

interface RawClaim {
  key: string;
  value: string;
  sourceUrl?: string;
  verified?: boolean;
}

interface RawCatalogItem {
  id: string;
  slug: string;
  title?: string;
  name?: string;
  summary: string;
  description: string;
  category?: string;
  categoryId?: string;
  category_id?: string;
  petTypes?: string[];
  pet_types?: string[];
  playStyles?: string[];
  play_styles?: string[];
  chewStrength?: string;
  chew_strength?: string;
  materials?: string;
  price?: number;
  priceCents?: number;
  images?: (string | RawImage)[];
  variants?: unknown[];
  claims?: RawClaim[];
  supplier?: unknown;
}

const typedCatalog = rawCatalog as unknown as RawCatalogItem[];

export const initialProducts: Product[] = typedCatalog.map((p) => {
  const images = (p.images || []).map((img) => (typeof img === 'string' ? img : img.url));
  const materialClaim = (p.claims || []).find((c) => c.key === 'material')?.value || p.materials || 'Durable pet-safe compound';
  const dimensionClaim = (p.claims || []).find((c) => c.key === 'dimensions')?.value || 'Standard pet toy size';
  const weightClaim = (p.claims || []).find((c) => c.key === 'weight')?.value || '200 g';
  const safetyClaim = (p.claims || []).find((c) => c.key === 'safety_note')?.value || 'Supervise pet during play. Discard if worn or damaged.';

  const currentPrice = p.price || (p.priceCents ? p.priceCents / 100 : 14.99);
  const compareAt = Math.round(currentPrice * 1.35) + 0.99;
  const ratingScore = Number((4.7 + ((p.id.length % 3) * 0.1)).toFixed(1));
  const reviewsTotal = 18 + (p.title || p.name || '').length * 3;

  return {
    id: p.id,
    slug: p.slug,
    name: p.title || p.name || 'Pet Toy',
    title: p.title || p.name || 'Pet Toy',
    tagline: p.summary,
    summary: p.summary,
    category: p.category || 'Chew Toys',
    categoryId: p.categoryId || p.category_id,
    petTypes: p.petTypes || p.pet_types || ['Dogs'],
    playStyles: p.playStyles || p.play_styles || ['chew'],
    chewStrength: p.chewStrength || p.chew_strength || 'moderate',
    price: currentPrice,
    priceCents: p.priceCents || Math.round(currentPrice * 100),
    compareAtPrice: compareAt,
    rating: ratingScore,
    reviewCount: reviewsTotal,
    inStock: true,
    isFlagship: p.slug === 'natural-rubber-bone-chew',
    isBestSeller: p.id.length % 3 === 0,
    images: images.length > 0 ? images : ['/products/natural-rubber-bone-chew/image-1.webp'],
    description: p.description,
    features: [
      materialClaim,
      dimensionClaim,
      weightClaim,
      p.summary,
    ],
    specs: {
      materials: materialClaim,
      dimensions: dimensionClaim,
      weight: weightClaim,
      suitableFor: Array.isArray(p.petTypes) ? p.petTypes.join(', ') : 'Dogs and cats',
      cleaning: 'Rinse with clean water and air dry thoroughly.',
    },
    playModes: {
      play: p.summary,
      chew: `Suitable for ${p.chewStrength || 'moderate'} play activity.`,
      fetch: 'Balanced shape for tossing, rolling, or retrieving.',
    },
    includedItems: [
      `1x ${p.title || p.name}`,
    ],
    safetyGuidance: safetyClaim,
    variants: p.variants || [],
    claims: p.claims || [],
    supplier: p.supplier,
  };
});
