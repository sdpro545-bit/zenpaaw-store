export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'Dog Toys' | 'Cat Toys' | 'Interactive Toys' | 'Chew Toys' | 'Fetch & Outdoor' | 'Best Sellers';
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFlagship?: boolean;
  isBestSeller?: boolean;
  images: string[];
  description: string;
  features: string[];
  specs: {
    materials: string;
    dimensions: string;
    weight: string;
    suitableFor: string;
    cleaning: string;
  };
  playModes?: {
    play: string;
    chew: string;
    fetch: string;
  };
  includedItems: string[];
  safetyGuidance: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface ShippingTier {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  fulfillmentStatus: 'Processing' | 'Awaiting Fulfillment' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  verifiedBuyer: boolean;
  petName?: string;
  petBreed?: string;
  title: string;
  comment: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  freeShipping?: boolean;
  minSubtotal?: number;
  description: string;
}

export interface SiteContent {
  announcementBar: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  promoBadgeText: string;
  freeShippingThreshold: number;
}
