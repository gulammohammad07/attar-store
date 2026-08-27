export type FragranceNote = {
  name: string;
  intensity: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  productType: "ATTAR" | "PERFUME";
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
  video?: string;
  gallery: string[];
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New Arrival" | "Limited Edition" | "Sale";
  featured?: boolean;
  sizes?: { id: string; size: string; price: number; stock: number }[];
};

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
