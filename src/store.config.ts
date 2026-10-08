// ZenPaaw Central Store Configuration
// Single source of truth for store policies, thresholds, and business rules

export interface StoreConfig {
  storeName: string;
  tagline: string;
  domain: string;
  supportEmail: string;
  supportPhone: string;
  companyAddress: string;
  currency: string;
  currencySymbol: string;
  freeShippingThresholdCents: number; // in cents
  standardShippingRateCents: number;  // in cents
  returnWindowDays: number;
  deliveryTimeDaysMin: number;
  deliveryTimeDaysMax: number;
  announcementBar: string;
  trademarkNotice: string;
  paymentProviders: ('stripe' | 'paystack')[];
}

export const storeConfig: StoreConfig = {
  storeName: 'ZenPaaw',
  tagline: 'Happy Pets, Happier Lives.',
  domain: 'https://zenpaaw.com',
  supportEmail: 'support@zenpaaw.com',
  supportPhone: '+1 (800) 555-0199',
  companyAddress: '100 Pine Street, Suite 1250, San Francisco, CA 94111',
  currency: 'USD',
  currencySymbol: '$',
  freeShippingThresholdCents: 3500, // $35.00
  standardShippingRateCents: 499,   // $4.99
  returnWindowDays: 30,
  deliveryTimeDaysMin: 3,
  deliveryTimeDaysMax: 7,
  announcementBar: 'Free shipping over $35. 30-day returns.',
  trademarkNotice: 'ZenPaaw is a trademark. All rights reserved.',
  paymentProviders: ['stripe', 'paystack'],
};

export default storeConfig;
