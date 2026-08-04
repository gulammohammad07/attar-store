export type FragranceNote = {
  name: string;
  intensity: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: "Oud" | "Musk" | "Rose" | "Amber" | "Floral" | "Gourmand";
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
  occasions: string[];
  gender: "Unisex" | "Men" | "Women";
  volume: string;
  price: number;
  salePrice?: number;
  image: string;
  gallery: string[];
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New Arrival" | "Limited Edition" | "Sale";
  featured?: boolean;
};

const IMAGES = {
  oud: "/images/products/oud.png",
  hawas: "/images/products/hawas.png",
  rasasi: "/images/products/rasasi.png",
  aurum: "/images/products/aurum.png",
  wave: "/images/products/wave.png",
  raindrop: "/images/products/raindrop.png",
  pro1: "/images/products/pro1.png",
  gift: "/images/products/gift.png",
};

export const products: Product[] = [
  {
    id: "p01",
    name: "Royal Oud",
    slug: "royal-oud",
    brand: "MD Perfumes",
    category: "Oud",
    notes: {
      top: [
        { name: "Saffron", intensity: 80 },
        { name: "Bergamot", intensity: 55 },
      ],
      heart: [
        { name: "Cambodian Oud", intensity: 95 },
        { name: "Rose", intensity: 65 },
      ],
      base: [
        { name: "Amber", intensity: 75 },
        { name: "Sandalwood", intensity: 70 },
      ],
    },
    occasions: ["Wedding", "Evening Out"],
    gender: "Unisex",
    volume: "3ml",
    price: 4999,
    salePrice: 3999,
    image: IMAGES.oud,
    gallery: [IMAGES.oud, IMAGES.aurum, IMAGES.gift],
    description:
      "A regal composition of smoked Cambodian oud, saffron and aged rose. Reserved for evenings that demand presence.",
    stock: 12,
    rating: 4.9,
    reviewCount: 214,
    badge: "Bestseller",
    featured: true,
  },
  {
    id: "p02",
    name: "Amber Nights",
    slug: "amber-nights",
    brand: "MD Perfumes",
    category: "Amber",
    notes: {
      top: [
        { name: "Pink Pepper", intensity: 60 },
        { name: "Mandarin", intensity: 45 },
      ],
      heart: [
        { name: "Amber", intensity: 90 },
        { name: "Cinnamon", intensity: 55 },
      ],
      base: [
        { name: "Vanilla", intensity: 78 },
        { name: "Tonka Bean", intensity: 68 },
      ],
    },
    occasions: ["Evening Out", "Festive"],
    gender: "Unisex",
    volume: "12ml",
    price: 3499,
    image: IMAGES.aurum,
    gallery: [IMAGES.aurum, IMAGES.wave, IMAGES.oud],
    description:
      "Warm golden amber wrapped in vanilla and tonka bean. A luminous trail that lingers long after you leave.",
    stock: 20,
    rating: 4.8,
    reviewCount: 167,
    badge: "Bestseller",
    featured: true,
  },
  {
    id: "p03",
    name: "White Musk",
    slug: "white-musk",
    brand: "MD Perfumes",
    category: "Musk",
    notes: {
      top: [
        { name: "Neroli", intensity: 50 },
        { name: "Lemon", intensity: 40 },
      ],
      heart: [
        { name: "White Musk", intensity: 92 },
        { name: "Jasmine", intensity: 60 },
      ],
      base: [
        { name: "Sandalwood", intensity: 55 },
        { name: "Iris", intensity: 45 },
      ],
    },
    occasions: ["Everyday", "Office"],
    gender: "Unisex",
    volume: "6ml",
    price: 2499,
    image: IMAGES.wave,
    gallery: [IMAGES.wave, IMAGES.raindrop, IMAGES.pro1],
    description:
      "An immaculate veil of white musk softened by neroli and jasmine. Pure, clean and quietly magnetic.",
    stock: 30,
    rating: 4.7,
    reviewCount: 98,
    badge: "New Arrival",
  },
  {
    id: "p04",
    name: "Velvet Rose",
    slug: "velvet-rose",
    brand: "MD Perfumes",
    category: "Rose",
    notes: {
      top: [
        { name: "Turkish Rose", intensity: 88 },
        { name: "Lychee", intensity: 40 },
      ],
      heart: [
        { name: "Damask Rose", intensity: 92 },
        { name: "Peony", intensity: 55 },
      ],
      base: [
        { name: "Musk", intensity: 60 },
        { name: "Cedarwood", intensity: 50 },
      ],
    },
    occasions: ["Wedding", "Everyday"],
    gender: "Women",
    volume: "30ml",
    price: 3999,
    salePrice: 3199,
    image: IMAGES.hawas,
    gallery: [IMAGES.hawas, IMAGES.gift, IMAGES.wave],
    description:
      "Velvet petals of Damask rose resting on a musky, woody base. Romantic, opulent and unforgettable.",
    stock: 8,
    rating: 4.8,
    reviewCount: 145,
    badge: "Sale",
    featured: true,
  },
  {
    id: "p05",
    name: "Oud Royale",
    slug: "oud-royale",
    brand: "Al Haramain",
    category: "Oud",
    notes: {
      top: [
        { name: "Saffron", intensity: 85 },
        { name: "Smoke", intensity: 70 },
      ],
      heart: [
        { name: "Agarwood", intensity: 96 },
        { name: "Leather", intensity: 62 },
      ],
      base: [
        { name: "Patchouli", intensity: 72 },
        { name: "Musk", intensity: 58 },
      ],
    },
    occasions: ["Wedding", "Evening Out"],
    gender: "Men",
    volume: "6ml",
    price: 6499,
    image: IMAGES.rasasi,
    gallery: [IMAGES.rasasi, IMAGES.oud, IMAGES.aurum],
    description:
      "Deep, resinous agarwood darkened with leather and smoke. The signature of quiet authority.",
    stock: 6,
    rating: 5.0,
    reviewCount: 89,
    badge: "Limited Edition",
  },
  {
    id: "p06",
    name: "Sahara Musk",
    slug: "sahara-musk",
    brand: "Rasasi",
    category: "Musk",
    notes: {
      top: [
        { name: "Bergamot", intensity: 48 },
        { name: "Cardamom", intensity: 52 },
      ],
      heart: [
        { name: "Musk", intensity: 90 },
        { name: "Lavender", intensity: 45 },
      ],
      base: [
        { name: "Vetiver", intensity: 60 },
        { name: "Amber", intensity: 55 },
      ],
    },
    occasions: ["Everyday", "Office"],
    gender: "Men",
    volume: "12ml",
    price: 2999,
    image: IMAGES.raindrop,
    gallery: [IMAGES.raindrop, IMAGES.wave, IMAGES.hawas],
    description:
      "A sun-baked blend of clean musk and cardamom with an earthy vetiver finish. Effortless daily luxury.",
    stock: 25,
    rating: 4.6,
    reviewCount: 76,
    badge: "New Arrival",
  },
  {
    id: "p07",
    name: "Amber Oud Fusion",
    slug: "amber-oud-fusion",
    brand: "Swiss Arabian",
    category: "Oud",
    notes: {
      top: [
        { name: "Rose", intensity: 60 },
        { name: "Saffron", intensity: 55 },
      ],
      heart: [
        { name: "Oud", intensity: 92 },
        { name: "Amber", intensity: 88 },
      ],
      base: [
        { name: "Vanilla", intensity: 66 },
        { name: "Sandalwood", intensity: 62 },
      ],
    },
    occasions: ["Evening Out", "Festive"],
    gender: "Unisex",
    volume: "50ml",
    price: 7999,
    salePrice: 6499,
    image: IMAGES.pro1,
    gallery: [IMAGES.pro1, IMAGES.gift, IMAGES.rasasi],
    description:
      "The legendary marriage of oud and amber — resinous, sweet and deeply addictive.",
    stock: 15,
    rating: 4.9,
    reviewCount: 132,
    badge: "Bestseller",
    featured: true,
  },
  {
    id: "p08",
    name: "Rose Petals",
    slug: "rose-petals",
    brand: "Ajmal",
    category: "Rose",
    notes: {
      top: [
        { name: "Rose Water", intensity: 70 },
        { name: "Citrus", intensity: 38 },
      ],
      heart: [
        { name: "Rose", intensity: 85 },
        { name: "Violet", intensity: 48 },
      ],
      base: [
        { name: "Musk", intensity: 52 },
        { name: "Powder", intensity: 42 },
      ],
    },
    occasions: ["Everyday", "Office"],
    gender: "Women",
    volume: "100ml",
    price: 1999,
    salePrice: 1499,
    image: IMAGES.gift,
    gallery: [IMAGES.gift, IMAGES.hawas, IMAGES.wave],
    description:
      "Fresh rose petals lifted with citrus and softened with violet. A graceful, feminine classic.",
    stock: 40,
    rating: 4.5,
    reviewCount: 203,
    badge: "Sale",
  },
  {
    id: "p09",
    name: "Vanilla Oud",
    slug: "vanilla-oud",
    brand: "Lattafa",
    category: "Gourmand",
    notes: {
      top: [
        { name: "Orange Blossom", intensity: 55 },
        { name: "Cinnamon", intensity: 50 },
      ],
      heart: [
        { name: "Vanilla", intensity: 90 },
        { name: "Oud", intensity: 80 },
      ],
      base: [
        { name: "Caramel", intensity: 62 },
        { name: "Benzoin", intensity: 58 },
      ],
    },
    occasions: ["Evening Out", "Festive"],
    gender: "Unisex",
    volume: "12ml",
    price: 3299,
    image: IMAGES.oud,
    gallery: [IMAGES.oud, IMAGES.pro1, IMAGES.aurum],
    description:
      "Silky vanilla smoothed over smoky oud with a whisper of caramel. Comforting, indulgent, irresistible.",
    stock: 18,
    rating: 4.7,
    reviewCount: 112,
    featured: true,
  },
  {
    id: "p10",
    name: "Golden Amber",
    slug: "golden-amber",
    brand: "MD Perfumes",
    category: "Amber",
    notes: {
      top: [
        { name: "Bergamot", intensity: 42 },
        { name: "Honey", intensity: 58 },
      ],
      heart: [
        { name: "Amber", intensity: 88 },
        { name: "Ginger", intensity: 45 },
      ],
      base: [
        { name: "Sandalwood", intensity: 60 },
        { name: "Tonka", intensity: 54 },
      ],
    },
    occasions: ["Wedding", "Festive"],
    gender: "Unisex",
    volume: "6ml",
    price: 2799,
    image: IMAGES.aurum,
    gallery: [IMAGES.aurum, IMAGES.oud, IMAGES.rasasi],
    description:
      "Molten honey and golden amber warmed with ginger. Radiant, rich and celebratory.",
    stock: 22,
    rating: 4.8,
    reviewCount: 84,
    badge: "New Arrival",
  },
  {
    id: "p11",
    name: "Midnight Oud",
    slug: "midnight-oud",
    brand: "Al Haramain",
    category: "Oud",
    notes: {
      top: [
        { name: "Saffron", intensity: 72 },
        { name: "Davana", intensity: 48 },
      ],
      heart: [
        { name: "Oud", intensity: 94 },
        { name: "Rose", intensity: 50 },
      ],
      base: [
        { name: "Musk", intensity: 66 },
        { name: "Vetiver", intensity: 55 },
      ],
    },
    occasions: ["Evening Out"],
    gender: "Men",
    volume: "3ml",
    price: 5499,
    image: IMAGES.rasasi,
    gallery: [IMAGES.rasasi, IMAGES.wave, IMAGES.gift],
    description:
      "An after-dark oud of smoked saffron and midnight rose. Brooding, dark and magnetic.",
    stock: 5,
    rating: 4.9,
    reviewCount: 61,
  },
  {
    id: "p12",
    name: "Floral Dream",
    slug: "floral-dream",
    brand: "Ajmal",
    category: "Floral",
    notes: {
      top: [
        { name: "Freesia", intensity: 52 },
        { name: "Pink Pepper", intensity: 40 },
      ],
      heart: [
        { name: "Peony", intensity: 74 },
        { name: "Lily", intensity: 60 },
      ],
      base: [
        { name: "Musk", intensity: 48 },
        { name: "Cedarwood", intensity: 42 },
      ],
    },
    occasions: ["Everyday", "Office"],
    gender: "Women",
    volume: "50ml",
    price: 2299,
    salePrice: 1799,
    image: IMAGES.wave,
    gallery: [IMAGES.wave, IMAGES.hawas, IMAGES.raindrop],
    description:
      "A dreamy bouquet of peony and freesia over cedarwood. Airy, soft and effortlessly pretty.",
    stock: 35,
    rating: 4.4,
    reviewCount: 59,
    badge: "Sale",
  },
  {
    id: "p13",
    name: "Sandal Mystique",
    slug: "sandal-mystique",
    brand: "Lattafa",
    category: "Musk",
    notes: {
      top: [
        { name: "Cardamom", intensity: 55 },
        { name: "Nutmeg", intensity: 42 },
      ],
      heart: [
        { name: "Sandalwood", intensity: 90 },
        { name: "Iris", intensity: 50 },
      ],
      base: [
        { name: "Musk", intensity: 64 },
        { name: "Amber", intensity: 52 },
      ],
    },
    occasions: ["Everyday", "Office", "Festive"],
    gender: "Unisex",
    volume: "30ml",
    price: 3799,
    image: IMAGES.pro1,
    gallery: [IMAGES.pro1, IMAGES.oud, IMAGES.wave],
    description:
      "Creamy Mysore sandalwood laced with cardamom and soft iris. Meditative, warm and serene.",
    stock: 14,
    rating: 4.6,
    reviewCount: 47,
  },
  {
    id: "p14",
    name: "Citrus Bloom",
    slug: "citrus-bloom",
    brand: "MD Perfumes",
    category: "Floral",
    notes: {
      top: [
        { name: "Bergamot", intensity: 80 },
        { name: "Mandarin", intensity: 72 },
      ],
      heart: [
        { name: "Orange Blossom", intensity: 68 },
        { name: "Neroli", intensity: 58 },
      ],
      base: [
        { name: "Musk", intensity: 42 },
        { name: "White Woods", intensity: 46 },
      ],
    },
    occasions: ["Everyday", "Office"],
    gender: "Unisex",
    volume: "6ml",
    price: 1899,
    image: IMAGES.raindrop,
    gallery: [IMAGES.raindrop, IMAGES.wave, IMAGES.hawas],
    description:
      "Sunlit bergamot and orange blossom over white woods. A sparkling, energising pick-me-up.",
    stock: 28,
    rating: 4.5,
    reviewCount: 38,
    badge: "New Arrival",
  },
  {
    id: "p15",
    name: "Sultan Oud",
    slug: "sultan-oud",
    brand: "Rasasi",
    category: "Oud",
    notes: {
      top: [
        { name: "Saffron", intensity: 78 },
        { name: "Black Pepper", intensity: 58 },
      ],
      heart: [
        { name: "Kashmiri Oud", intensity: 96 },
        { name: "Leather", intensity: 64 },
      ],
      base: [
        { name: "Amber", intensity: 76 },
        { name: "Musk", intensity: 62 },
      ],
    },
    occasions: ["Wedding", "Evening Out"],
    gender: "Men",
    volume: "12ml",
    price: 8999,
    image: IMAGES.hawas,
    gallery: [IMAGES.hawas, IMAGES.rasasi, IMAGES.gift],
    description:
      "The sultan of ouds — Kashmiri agarwood crowned with saffron and dark leather. Uncompromising luxury.",
    stock: 4,
    rating: 5.0,
    reviewCount: 52,
    badge: "Limited Edition",
  },
  {
    id: "p16",
    name: "Pink Pepper Attar",
    slug: "pink-pepper-attar",
    brand: "Swiss Arabian",
    category: "Gourmand",
    notes: {
      top: [
        { name: "Pink Pepper", intensity: 85 },
        { name: "Raspberry", intensity: 55 },
      ],
      heart: [
        { name: "Rose", intensity: 62 },
        { name: "Peony", intensity: 48 },
      ],
      base: [
        { name: "Musk", intensity: 54 },
        { name: "Suede", intensity: 50 },
      ],
    },
    occasions: ["Everyday", "Evening Out"],
    gender: "Unisex",
    volume: "3ml",
    price: 2199,
    image: IMAGES.gift,
    gallery: [IMAGES.gift, IMAGES.pro1, IMAGES.aurum],
    description:
      "Sparkling pink pepper over juicy raspberry and suede. Playful, modern and confident.",
    stock: 19,
    rating: 4.6,
    reviewCount: 44,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.occasions.some((o) => product.occasions.includes(o))),
    )
    .slice(0, count);
}

export const categories = [
  { name: "Oud", slug: "oud", image: IMAGES.oud, tagline: "The King of Fragrances" },
  { name: "Musk", slug: "musk", image: IMAGES.wave, tagline: "Clean & Magnetic" },
  { name: "Rose", slug: "rose", image: IMAGES.hawas, tagline: "Romantic Petals" },
  { name: "Amber", slug: "amber", image: IMAGES.aurum, tagline: "Warm & Golden" },
  { name: "Floral", slug: "floral", image: IMAGES.raindrop, tagline: "Fresh Bouquets" },
  { name: "Gourmand", slug: "gourmand", image: IMAGES.pro1, tagline: "Sweet Indulgence" },
] as const;

export const notes = [
  "Oud",
  "Musk",
  "Rose",
  "Amber",
  "Vanilla",
  "Saffron",
  "Sandalwood",
  "Jasmine",
  "Bergamot",
  "Cardamom",
];

export const occasions = [
  "Wedding",
  "Evening Out",
  "Everyday",
  "Office",
  "Festive",
];

export const brands = [
  "MD Perfumes",
  "Al Haramain",
  "Rasasi",
  "Swiss Arabian",
  "Ajmal",
  "Lattafa",
];

export const testimonials = [
  {
    name: "Ayesha Khan",
    location: "Mumbai",
    rating: 5,
    quote:
      "The Royal Oud is pure magic. I receive compliments everywhere I go — it lasts all day and smells like a thousand rupees more than it costs.",
  },
  {
    name: "Rohan Mehta",
    location: "Delhi",
    rating: 5,
    quote:
      "Finally a place that takes attar seriously. The packaging, the curation, the service — everything feels premium. Amber Nights is my signature now.",
  },
  {
    name: "Priya Sharma",
    location: "Bengaluru",
    rating: 5,
    quote:
      "Velvet Rose is the most beautiful rose I have ever owned. Delivery was swift and the little samples they send are a lovely touch.",
  },
  {
    name: "Arjun Nair",
    location: "Kochi",
    rating: 4,
    quote:
      "Sultan Oud is a beast — projection and longevity are outstanding. A true luxury experience from start to finish.",
  },
  {
    name: "Sana Kapoor",
    location: "Jaipur",
    rating: 5,
    quote:
      "Their collection feels hand-picked. White Musk is subtle yet intoxicating, perfect for the office. I will definitely be back.",
  },
];

export const instagramPosts = [
  { image: IMAGES.oud, label: "Behind the Craft" },
  { image: IMAGES.hawas, label: "The Rose Room" },
  { image: IMAGES.aurum, label: "Golden Hour" },
  { image: IMAGES.pro1, label: "Atelier Diaries" },
  { image: IMAGES.rasasi, label: "Oud & Smoke" },
  { image: IMAGES.wave, label: "Fresh Waters" },
];
