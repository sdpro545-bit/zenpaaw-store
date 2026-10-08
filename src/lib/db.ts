import { Product, Order, Coupon, SiteContent, Review } from '@/types';
import { initialProducts } from '@/data/products';

// Initial Mock Seed Data for Dropshipping Operations
let products: Product[] = [...initialProducts];

let orders: Order[] = [
  {
    id: 'ZP-10829',
    customer: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zipCode: '97477',
      country: 'United States'
    },
    items: [
      {
        productId: 'zenpaaw-3-in-1-pet-toy',
        productName: 'ZenPaaw 3-in-1 Pet Toy',
        price: 24.99,
        quantity: 1,
        image: '/images/toy-isolated.jpg'
      }
    ],
    subtotal: 24.99,
    shippingCost: 4.99,
    discount: 0,
    total: 29.98,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    paymentMethod: 'Credit Card (Stripe)',
    trackingNumber: 'USPS-9400111899562910394812',
    createdAt: '2026-10-06T14:22:00.000Z',
    updatedAt: '2026-10-06T18:30:00.000Z'
  },
  {
    id: 'ZP-10830',
    customer: {
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'm.vance@example.com',
      phone: '+1 (555) 489-1029',
      address: '1440 Mission Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'United States'
    },
    items: [
      {
        productId: 'zenpaaw-3-in-1-pet-toy',
        productName: 'ZenPaaw 3-in-1 Pet Toy',
        price: 24.99,
        quantity: 2,
        image: '/images/toy-isolated.jpg'
      },
      {
        productId: 'zenpaaw-puzzle-treat-ball',
        productName: 'ZenPaaw Interactive Treat Puzzle Ball',
        price: 19.99,
        quantity: 1,
        image: '/images/toy-isolated.jpg'
      }
    ],
    subtotal: 69.97,
    shippingCost: 0,
    discount: 6.99,
    couponCode: 'ZEN10',
    total: 62.98,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Awaiting Fulfillment',
    paymentMethod: 'Apple Pay',
    createdAt: '2026-10-07T09:15:00.000Z',
    updatedAt: '2026-10-07T09:15:00.000Z'
  }
];

let coupons: Coupon[] = [
  {
    code: 'ZEN10',
    discountPercent: 10,
    description: '10% off any order'
  },
  {
    code: 'PLAYMORE',
    discountPercent: 15,
    minSubtotal: 40,
    description: '15% off orders over $40'
  },
  {
    code: 'FREESHIP',
    discountPercent: 0,
    freeShipping: true,
    description: 'Free standard shipping on your order'
  }
];

let reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'zenpaaw-3-in-1-pet-toy',
    author: 'Emily R.',
    rating: 5,
    date: 'October 2, 2026',
    verifiedBuyer: true,
    petName: 'Barnaby',
    petBreed: 'Golden Retriever (2 yrs)',
    title: 'Kept him occupied all afternoon!',
    comment: 'Barnaby usually destroys plush toys in under ten minutes. The rubber chew roller has held up remarkably well, and the rope handle makes fetch so much easier to launch.'
  },
  {
    id: 'rev-2',
    productId: 'zenpaaw-3-in-1-pet-toy',
    author: 'David L.',
    rating: 5,
    date: 'September 28, 2026',
    verifiedBuyer: true,
    petName: 'Ziggy',
    petBreed: 'Border Collie (3 yrs)',
    title: 'Great value for 3 play styles',
    comment: 'Really like having one toy that transitions from indoor chewing to outdoor park fetch. The colors are vibrant and easy to spot in tall grass.'
  },
  {
    id: 'rev-3',
    productId: 'zenpaaw-3-in-1-pet-toy',
    author: 'Jessica T.',
    rating: 5,
    date: 'September 24, 2026',
    verifiedBuyer: true,
    petName: 'Milo',
    petBreed: 'Labrador Mix (4 yrs)',
    title: 'Nice clean packaging too',
    comment: 'The kraft box packaging was surprisingly clean and eco-friendly. Toy has no chemical smell right out of the box. Highly recommend!'
  }
];

let siteContent: SiteContent = {
  announcementBar: '🐾 FREE U.S. SHIPPING ON ORDERS OVER $35 • 30-DAY SATISFACTION GUARANTEE',
  heroEyebrow: 'BETTER PLAY. HAPPIER PETS.',
  heroHeadline: 'More Play. More Fun. Happier Paws.',
  heroSubheadline: 'Thoughtfully selected pet toys designed to keep dogs engaged, active and ready to play.',
  promoBadgeText: 'FLAGSHIP LAUNCH OFFER',
  freeShippingThreshold: 35
};

export const db = {
  // Products
  getProducts: () => [...products],
  getProductById: (idOrSlug: string) => 
    products.find(p => p.id === idOrSlug || p.slug === idOrSlug),
  updateProduct: (id: string, updates: Partial<Product>) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      return products[idx];
    }
    return null;
  },
  addProduct: (newProd: Product) => {
    products.push(newProd);
    return newProd;
  },

  // Orders
  getOrders: () => [...orders],
  getOrderById: (id: string) => orders.find(o => o.id === id),
  createOrder: (order: Order) => {
    orders.unshift(order);
    return order;
  },
  updateOrderStatus: (id: string, fulfillmentStatus: Order['fulfillmentStatus'], trackingNumber?: string) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      order.fulfillmentStatus = fulfillmentStatus;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return null;
  },

  // Coupons
  getCoupons: () => [...coupons],
  validateCoupon: (code: string, subtotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) return { valid: false, message: 'Invalid promo code' };
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return { 
        valid: false, 
        message: `Requires a minimum subtotal of $${coupon.minSubtotal.toFixed(2)}` 
      };
    }
    return { valid: true, coupon };
  },

  // Reviews
  getReviews: (productId?: string) => {
    if (!productId) return [...reviews];
    return reviews.filter(r => r.productId === productId);
  },
  addReview: (review: Review) => {
    reviews.unshift(review);
    return review;
  },

  // Site Content
  getContent: () => ({ ...siteContent }),
  updateContent: (updates: Partial<SiteContent>) => {
    siteContent = { ...siteContent, ...updates };
    return siteContent;
  }
};
