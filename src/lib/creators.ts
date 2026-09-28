// SAMPLE DATA ONLY. Every creator, handle, amount and photo here is invented
// for the prototype. Photos are Lorem Picsum (Unsplash licence) stand-ins and
// must be replaced by the creator's real Instagram photo at verification.

export const NICHES = [
  "Fashion",
  "Beauty",
  "Fitness",
  "Food",
  "Travel",
  "Tech",
  "Finance",
  "Music",
  "Comedy",
  "Education",
  "Lifestyle",
  "Parenting",
] as const;
export type Niche = (typeof NICHES)[number];

export const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
  "Goa",
  "Dehradun",
  "Manali",
  "Shillong",
] as const;

export const LANGUAGES = [
  "Hindi",
  "English",
  "Bengali",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Konkani",
  "Khasi",
] as const;

/** A payment: `d` days before today (0 = today), `f` = how far through that day (0 to 1). */
export interface Payment {
  amount: number;
  d: number;
  f: number;
}

export interface Creator {
  handle: string;
  name: string;
  niche: Niche;
  city: string;
  languages: string[];
  followers: number;
  photo: number;
  bio: string;
  professional: boolean;
  payments: Payment[];
  profileVisits: number;
  brandRequests: number;
}

export const creators: Creator[] = [
  {
    handle: "tara.frames", name: "Tara Menon", niche: "Travel", city: "Kochi", languages: ["English", "Malayalam"],
    followers: 312400, photo: 823, professional: true, profileVisits: 61382, brandRequests: 38,
    bio: "Slow travel across Kerala and the Western Ghats, shot on film and on my phone.",
    payments: [{ amount: 5000, d: 21, f: 0.4 }, { amount: 8000, d: 12, f: 0.7 }, { amount: 4450, d: 3, f: 0.3 }, { amount: 1000, d: 0, f: 0.2 }],
  },
  {
    handle: "riya.wears", name: "Riya Malhotra", niche: "Fashion", city: "Delhi", languages: ["Hindi", "English"],
    followers: 402100, photo: 64, professional: true, profileVisits: 44210, brandRequests: 29,
    bio: "Everyday Delhi street style, every look under ₹2,000.",
    payments: [{ amount: 6000, d: 18, f: 0.5 }, { amount: 5210, d: 9, f: 0.8 }, { amount: 3000, d: 1, f: 0.6 }],
  },
  {
    handle: "zoya.strings", name: "Zoya Qureshi", niche: "Music", city: "Hyderabad", languages: ["Hindi", "English"],
    followers: 184700, photo: 836, professional: true, profileVisits: 39870, brandRequests: 21,
    bio: "Guitar covers of old Hindi songs. A new one every Friday.",
    payments: [{ amount: 7000, d: 20, f: 0.2 }, { amount: 3960, d: 6, f: 0.9 }, { amount: 2000, d: 0, f: 0.55 }],
  },
  {
    handle: "ishita.glow", name: "Ishita Bose", niche: "Beauty", city: "Kolkata", languages: ["Bengali", "English"],
    followers: 241300, photo: 1027, professional: true, profileVisits: 27440, brandRequests: 24,
    bio: "Skincare for humid weather, tested on my own skin first.",
    payments: [{ amount: 4880, d: 15, f: 0.3 }, { amount: 5000, d: 4, f: 0.45 }],
  },
  {
    handle: "vikram.moneywise", name: "Vikram Shah", niche: "Finance", city: "Mumbai", languages: ["Gujarati", "Hindi"],
    followers: 211900, photo: 856, professional: true, profileVisits: 25310, brandRequests: 17,
    bio: "Personal finance in plain Hindi. SIPs, taxes and your first salary.",
    payments: [{ amount: 6000, d: 16, f: 0.6 }, { amount: 2340, d: 2, f: 0.35 }],
  },
  {
    handle: "kavya.rides", name: "Kavya Reddy", niche: "Fitness", city: "Bengaluru", languages: ["Kannada", "English"],
    followers: 73200, photo: 839, professional: true, profileVisits: 18920, brandRequests: 12,
    bio: "Cycling, strength training and honest recovery days.",
    payments: [{ amount: 3120, d: 10, f: 0.5 }, { amount: 3000, d: 0, f: 0.4 }],
  },
  {
    handle: "aditi.bakes", name: "Aditi Joshi", niche: "Food", city: "Pune", languages: ["Marathi", "English"],
    followers: 156800, photo: 1080, professional: true, profileVisits: 17650, brandRequests: 14,
    bio: "Eggless baking that actually rises. Full recipes in the captions.",
    payments: [{ amount: 4000, d: 13, f: 0.25 }, { amount: 1480, d: 5, f: 0.7 }],
  },
  {
    handle: "arjun.layers", name: "Arjun Sethi", niche: "Fashion", city: "Delhi", languages: ["Hindi", "English"],
    followers: 88900, photo: 1005, professional: true, profileVisits: 12870, brandRequests: 9,
    bio: "Menswear for Delhi winters and everything after.",
    payments: [{ amount: 4760, d: 11, f: 0.6 }],
  },
  {
    handle: "nisha.and.kiara", name: "Nisha D'Souza", niche: "Parenting", city: "Mumbai", languages: ["English", "Hindi"],
    followers: 128500, photo: 822, professional: true, profileVisits: 11940, brandRequests: 11,
    bio: "Life with a four-year-old in Bandra. Mostly snacks.",
    payments: [{ amount: 2150, d: 9, f: 0.3 }, { amount: 2000, d: 1, f: 0.75 }],
  },
  {
    handle: "kabir.above", name: "Kabir Arora", niche: "Travel", city: "Chandigarh", languages: ["Hindi", "Punjabi"],
    followers: 97600, photo: 685, professional: true, profileVisits: 10380, brandRequests: 7,
    bio: "Himalayan treks planned on a salary budget.",
    payments: [{ amount: 3990, d: 14, f: 0.55 }],
  },
  {
    handle: "ananya.reads", name: "Ananya Iyer", niche: "Education", city: "Chennai", languages: ["Tamil", "English"],
    followers: 96400, photo: 832, professional: true, profileVisits: 9720, brandRequests: 8,
    bio: "One book a week, summarised in sixty seconds.",
    payments: [{ amount: 2410, d: 8, f: 0.4 }, { amount: 1000, d: 0, f: 0.7 }],
  },
  {
    handle: "monsoonstatic", name: "Monsoon Static", niche: "Music", city: "Bengaluru", languages: ["English", "Kannada"],
    followers: 64300, photo: 453, professional: true, profileVisits: 8210, brandRequests: 6,
    bio: "Four-piece indie band. New EP out this monsoon.",
    payments: [{ amount: 3150, d: 17, f: 0.65 }],
  },
  {
    handle: "meera.paddles", name: "Meera Nair", niche: "Travel", city: "Goa", languages: ["English", "Konkani"],
    followers: 58900, photo: 1011, professional: true, profileVisits: 7460, brandRequests: 5,
    bio: "Kayaking, backwaters and quiet beaches before 7 am.",
    payments: [{ amount: 1860, d: 7, f: 0.2 }, { amount: 1000, d: 2, f: 0.8 }],
  },
  {
    handle: "tanmay.explains", name: "Tanmay Kulkarni", niche: "Tech", city: "Bengaluru", languages: ["Marathi", "English"],
    followers: 71800, photo: 48, professional: true, profileVisits: 6930, brandRequests: 6,
    bio: "Phones and laptops reviewed at Indian prices.",
    payments: [{ amount: 1640, d: 6, f: 0.3 }, { amount: 1000, d: 0, f: 0.85 }],
  },
  {
    handle: "rohan.swims", name: "Rohan Das", niche: "Fitness", city: "Kolkata", languages: ["Bengali", "English"],
    followers: 42100, photo: 841, professional: false, profileVisits: 5120, brandRequests: 3,
    bio: "Open-water swimming and dryland workouts.",
    payments: [{ amount: 2210, d: 12, f: 0.5 }],
  },
  {
    handle: "aisha.skin", name: "Aisha Khan", niche: "Beauty", city: "Lucknow", languages: ["Urdu", "Hindi"],
    followers: 67500, photo: 996, professional: true, profileVisits: 4870, brandRequests: 4,
    bio: "Ingredient-first skincare reviews. No sponsored ratings.",
    payments: [{ amount: 1990, d: 3, f: 0.6 }],
  },
  {
    handle: "pooja.slowdays", name: "Pooja Rawat", niche: "Lifestyle", city: "Dehradun", languages: ["Hindi", "English"],
    followers: 35700, photo: 777, professional: false, profileVisits: 3390, brandRequests: 2,
    bio: "Slow mornings, hill-town weekends and small routines.",
    payments: [{ amount: 1540, d: 5, f: 0.4 }],
  },
  {
    handle: "dev.filmroll", name: "Dev Mehta", niche: "Lifestyle", city: "Ahmedabad", languages: ["Gujarati", "English"],
    followers: 29800, photo: 91, professional: true, profileVisits: 2980, brandRequests: 2,
    bio: "35 mm film photography and the stories behind each roll.",
    payments: [{ amount: 1280, d: 19, f: 0.3 }],
  },
  {
    handle: "yash.streets", name: "Yash Bhatia", niche: "Fashion", city: "Mumbai", languages: ["Hindi", "Marathi"],
    followers: 51200, photo: 669, professional: true, profileVisits: 2610, brandRequests: 2,
    bio: "Streetwear drops, thrift finds and sneaker care.",
    payments: [{ amount: 1150, d: 1, f: 0.45 }],
  },
  {
    handle: "harsh.builds", name: "Harsh Vora", niche: "Tech", city: "Ahmedabad", languages: ["Gujarati", "English"],
    followers: 38400, photo: 2, professional: true, profileVisits: 2140, brandRequests: 1,
    bio: "Building small apps in public. Notion templates on Sundays.",
    payments: [{ amount: 990, d: 4, f: 0.5 }],
  },
  {
    handle: "neel.eats", name: "Neel Sharma", niche: "Food", city: "Delhi", languages: ["Hindi", "English"],
    followers: 112300, photo: 429, professional: true, profileVisits: 1870, brandRequests: 3,
    bio: "Delhi street food, rated by price and queue length.",
    payments: [{ amount: 860, d: 0, f: 0.3 }],
  },
  {
    handle: "sana.moves", name: "Sana Mirza", niche: "Fitness", city: "Jaipur", languages: ["Hindi", "English"],
    followers: 44600, photo: 656, professional: false, profileVisits: 1320, brandRequests: 1,
    bio: "Dance workouts you can do in a small room.",
    payments: [{ amount: 640, d: 2, f: 0.55 }],
  },
  {
    handle: "pierpressure.in", name: "Pier Pressure", niche: "Comedy", city: "Mumbai", languages: ["Hindi", "English"],
    followers: 83900, photo: 390, professional: true, profileVisits: 1180, brandRequests: 2,
    bio: "Three friends, one pier, far too many sketches.",
    payments: [{ amount: 420, d: 0, f: 0.6 }],
  },
  {
    handle: "manav.trails", name: "Manav Rana", niche: "Travel", city: "Manali", languages: ["Hindi", "English"],
    followers: 26100, photo: 177, professional: false, profileVisits: 640, brandRequests: 0,
    bio: "Solo treks and homestays across Himachal.",
    payments: [{ amount: 299, d: 1, f: 0.2 }],
  },
  {
    handle: "ishaan.unplugged", name: "Ishaan Roy", niche: "Music", city: "Shillong", languages: ["English", "Khasi"],
    followers: 21500, photo: 334, professional: true, profileVisits: 410, brandRequests: 0,
    bio: "Acoustic sets recorded outdoors across the Northeast.",
    payments: [{ amount: 199, d: 0, f: 0.9 }],
  },
];

/** Sample post photos per niche, shown on creator profiles as "recent posts". */
export const POSTS_BY_NICHE: Record<Niche, number[]> = {
  Fashion: [21, 26, 325, 669, 1005, 64, 454],
  Beauty: [996, 1027, 64, 660, 325, 21, 26],
  Fitness: [841, 1009, 839, 656, 646, 177, 493],
  Food: [429, 1080, 63, 493, 0, 26, 660],
  Travel: [685, 1011, 177, 442, 646, 656, 823],
  Tech: [816, 2, 0, 48, 26, 454, 628],
  Finance: [856, 2, 48, 26, 0, 63, 816],
  Music: [453, 452, 334, 836, 660, 596, 646],
  Comedy: [390, 452, 596, 660, 646, 63, 656],
  Education: [832, 442, 26, 0, 777, 63, 48],
  Lifestyle: [777, 646, 660, 628, 91, 454, 63],
  Parenting: [822, 596, 646, 660, 777, 1011, 656],
};

export function getCreator(handle: string) {
  return creators.find((c) => c.handle === handle.toLowerCase());
}

export function photoSrc(id: number, ratio: number) {
  return `/photo/${id}/${ratio}`;
}
