import { Product } from '@/types';

export const initialProducts: Product[] = [
  {
    id: 'zenpaaw-3-in-1-pet-toy',
    slug: 'zenpaaw-3-in-1-pet-toy',
    name: 'ZenPaaw 3-in-1 Pet Toy',
    tagline: 'One toy. Three ways to play. More value.',
    category: 'Dog Toys',
    price: 24.99,
    compareAtPrice: 34.99,
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockCount: 142,
    isFlagship: true,
    isBestSeller: true,
    images: [
      '/images/toy-isolated.jpg',
      '/images/hero-dog.jpg',
      '/images/packaging-box.jpg',
      '/images/packaging-concepts.png'
    ],
    description: 'Thoughtfully designed for dogs who love variety. The ZenPaaw 3-in-1 Pet Toy combines an ultra-tactile textured rubber ball, a ribbed dental chew roller, and a heavy-duty braided rope in a single, balanced toy. Switch effortlessly between interactive fetch, satisfying chewing, and vigorous tug-of-war without cluttering your floor with multiple separate toys.',
    features: [
      'Dual textured natural rubber elements engineered for grip and bounce',
      'Gentle dental nubs that massage gums and clean teeth during chewing',
      'Reinforced multi-strand braided cotton-poly rope for secure tugging',
      'Balanced weight for effortless long-distance outdoor throws',
      'Easy to rinse and dishwasher-safe rubber modules'
    ],
    specs: {
      materials: 'BPA-free food-grade TPR rubber & natural cotton-poly braided rope',
      dimensions: 'Total length 13.5 in (34 cm) | Ball diameter 2.8 in (7 cm)',
      weight: '8.4 oz (238 g)',
      suitableFor: 'Medium to large dogs (20 - 75 lbs) & active chewers',
      cleaning: 'Rinse with warm soapy water or top-rack dishwasher safe'
    },
    playModes: {
      play: 'Multi-sensory roll and bounce keeps dogs curious, mentally stimulated, and focused during solo or guided play.',
      chew: 'Ergonomic ribbed roller with textured nubs provides a satisfying chew sensation while naturally scraping plaque.',
      fetch: 'Loop handle and weighted ball allow smooth, aerodynamic throwing for high-energy backyard or park retrieval.'
    },
    includedItems: [
      '1x ZenPaaw 3-in-1 Multipurpose Pet Toy',
      '1x ZenPaaw Eco-Friendly Kraft Packaging Box',
      '1x Pet Parent Play & Safety Quickstart Guide'
    ],
    safetyGuidance: 'Always supervise your pet during play. Inspect regularly for wear and tear. Discontinue use and replace if any component becomes loose or torn. Not designed for aggressive industrial-level destructors.'
  },
  {
    id: 'zenpaaw-dental-chew-ring',
    slug: 'zenpaaw-dental-chew-ring',
    name: 'ZenPaaw Dental Ridge Chew Ring',
    tagline: 'Textured rubber ring designed for daily dental hygiene.',
    category: 'Chew Toys',
    price: 16.99,
    compareAtPrice: 22.99,
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
    stockCount: 88,
    isBestSeller: false,
    images: [
      '/images/toy-isolated.jpg',
      '/images/packaging-box.jpg'
    ],
    description: 'A durable geometric chew ring with multidirectional rubber ridges that stimulate gums and reduce tartar buildup during everyday chew sessions.',
    features: [
      'Ergonomic ring shape that dogs can easily grip between their front paws',
      'High-resilience non-toxic rubber compound',
      'Dental ridges channel pet-safe toothpaste or peanut butter',
      'Floats in water for lake and pool retrieval'
    ],
    specs: {
      materials: 'Non-toxic natural rubber',
      dimensions: 'Diameter 5.5 in (14 cm)',
      weight: '6.2 oz (175 g)',
      suitableFor: 'Small to medium dogs (15 - 50 lbs)',
      cleaning: 'Warm water and mild soap'
    },
    includedItems: [
      '1x ZenPaaw Dental Ridge Chew Ring',
      '1x Kraft paper protective sleeve'
    ],
    safetyGuidance: 'Supervise playtime and discard if cracks develop.'
  },
  {
    id: 'zenpaaw-puzzle-treat-ball',
    slug: 'zenpaaw-puzzle-treat-ball',
    name: 'ZenPaaw Interactive Treat Puzzle Ball',
    tagline: 'Dispenses kibble as your dog rolls and nudges it.',
    category: 'Interactive Toys',
    price: 19.99,
    compareAtPrice: 26.99,
    rating: 4.9,
    reviewCount: 31,
    inStock: true,
    stockCount: 65,
    isBestSeller: true,
    images: [
      '/images/toy-isolated.jpg',
      '/images/hero-dog.jpg'
    ],
    description: 'Keeps clever dogs engaged for 20+ minutes at a time. Adjustable treat aperture dispenses dry treats or kibble at a controlled pace to prevent fast eating and relieve boredom.',
    features: [
      'Internal maze labyrinth slows treat release',
      'Adjustable opening fits various kibble sizes',
      'Weighted base creates unpredictable rolling action',
      'Twists apart completely for thorough cleaning'
    ],
    specs: {
      materials: 'Heavy-duty food-grade ABS & polycarbonate',
      dimensions: 'Diameter 4.2 in (10.5 cm)',
      weight: '7.5 oz (212 g)',
      suitableFor: 'All dog breeds and curious cats',
      cleaning: 'Dishwasher safe (top rack)'
    },
    includedItems: [
      '1x ZenPaaw Treat Puzzle Ball',
      '1x User adjustment guide'
    ],
    safetyGuidance: 'Use dry treats only. Clean interior chamber weekly.'
  },
  {
    id: 'zenpaaw-braided-fetch-launcher',
    slug: 'zenpaaw-braided-fetch-launcher',
    name: 'ZenPaaw Braided Tug & Fetch Launcher',
    tagline: 'Aerodynamic double-knot rope built for long field throws.',
    category: 'Fetch & Outdoor',
    price: 18.99,
    compareAtPrice: 24.99,
    rating: 4.7,
    reviewCount: 19,
    inStock: true,
    stockCount: 94,
    isBestSeller: false,
    images: [
      '/images/toy-isolated.jpg',
      '/images/hero-dog.jpg'
    ],
    description: 'Built for high-energy park sessions. The reinforced loop handle gives pet parents maximum leverage to launch the ball 40+ yards without straining their arm.',
    features: [
      'Extra-thick braided cotton blend absorbs high tug tension',
      'Dense natural rubber core ball for high bounce on grass and turf',
      'Comfort-grip woven wrist loop',
      'Vibrant high-visibility contrast coloring'
    ],
    specs: {
      materials: '100% natural unbleached cotton rope & solid rubber core',
      dimensions: 'Length 18 in (46 cm)',
      weight: '9.1 oz (258 g)',
      suitableFor: 'Active medium to giant breeds',
      cleaning: 'Machine washable (gentle cycle in wash bag)'
    },
    includedItems: [
      '1x ZenPaaw Braided Tug & Fetch Launcher'
    ],
    safetyGuidance: 'Inspect rope fibers periodically and trim frayed ends.'
  },
  {
    id: 'zenpaaw-calming-snuggle-plush',
    slug: 'zenpaaw-calming-snuggle-plush',
    name: 'ZenPaaw Calming Crinkle Snuggle Toy',
    tagline: 'Gentle plush with soothing crinkle lining for cozy rest.',
    category: 'Best Sellers',
    price: 15.99,
    compareAtPrice: 21.99,
    rating: 4.9,
    reviewCount: 28,
    inStock: true,
    stockCount: 52,
    isBestSeller: true,
    images: [
      '/images/packaging-box.jpg',
      '/images/toy-isolated.jpg'
    ],
    description: 'Designed for downtime. Features a gentle puncture-resistant crinkle layer and a low-frequency squeaker that entices without annoying everyone in the house.',
    features: [
      'Double-stitched reinforced seam technology',
      'No loose plastic beads or dangerous small parts',
      'Soft corduroy texture pets love nuzzling',
      'Machine washable for easy hygiene'
    ],
    specs: {
      materials: 'Soft corduroy, reinforced mesh lining, recycled polyfill',
      dimensions: '11 x 6 in (28 x 15 cm)',
      weight: '4.8 oz (136 g)',
      suitableFor: 'Puppies, seniors, and gentle chewers',
      cleaning: 'Machine wash cold, air dry'
    },
    includedItems: [
      '1x ZenPaaw Calming Crinkle Snuggle Toy'
    ],
    safetyGuidance: 'Not intended for aggressive chewers. Remove if torn.'
  }
];
