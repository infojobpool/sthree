export type Audience = "women" | "men" | "kids";

export type CategorySlug =
  | "lehenga"
  | "co-ord-set"
  | "designer"
  | "dress-material"
  | "kurthi"
  | "saree"
  | "dupatta"
  | "night-suit"
  | "top"
  | "kurta"
  | "sherwani"
  | "shirt"
  | "kids-lehenga"
  | "kids-kurta";

export type Highlight = "new" | "bestseller" | "sale";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  colors: string[];
  sizes: string[];
  image: string;
  images?: string[];
  description: string;
  fabric: string;
  includes: string[];
  highlights: Highlight[];
  rating: number;
  reviews: number;
  inStock: boolean;
  audience: Audience;
};

export const categories: { slug: CategorySlug; name: string; line: string }[] = [
  { slug: "lehenga", name: "Lehenga", line: "Explore our lehenga edit — pieces chosen for ease, elegance, and everyday grace." },
  { slug: "co-ord-set", name: "Co-Ord Set", line: "Matched sets that dress up a lunch and come home just as easily." },
  { slug: "designer", name: "Designer", line: "Small-run evening pieces from the Sthree atelier." },
  { slug: "dress-material", name: "Dress Material", line: "Unstitched sets for the tailor you already trust." },
  { slug: "kurthi", name: "Kurthi", line: "Easy kurtis for the studio, the office, and the day after the wedding." },
  { slug: "saree", name: "Sarees", line: "Sarees chosen for drape, border, and a day you can actually move through." },
  { slug: "dupatta", name: "Dupatta", line: "Dupattas to finish a kurti, a suit, or a plain blouse." },
  { slug: "night-suit", name: "Night Suit", line: "Soft cotton sets for the hours after the function." },
  { slug: "top", name: "Top", line: "Short silhouettes to pair with palazzos, denims, or a lehenga skirt." },
  { slug: "kurta", name: "Kurta", line: "Silk and cotton kurtas cut for a long wedding day." },
  { slug: "sherwani", name: "Sherwani", line: "Reception sherwanis with a lighter shoulder." },
  { slug: "shirt", name: "Shirt", line: "Festive shirts that sit with a kurta or on their own." },
  { slug: "kids-lehenga", name: "Kids Lehenga", line: "Small lehengas and pavadai sets for the wedding party." },
  { slug: "kids-kurta", name: "Kids Set", line: "Tops, pants, and shirt sets for the function." },
];

export const audiences: { slug: Audience; name: string; line: string }[] = [
  { slug: "women", name: "Women", line: "Lehengas, kurtis, sarees, and the edit the studio is known for." },
  { slug: "men", name: "Men", line: "Kurtas, sherwanis, and festive shirts." },
  { slug: "kids", name: "Kids", line: "Lehengas, pavadai sets, and shirt sets for the wedding weekend." },
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=75`;

const apparel = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const core = ["S", "M", "L", "XL", "XXL", "3XL"];

const womenPieces: Omit<Product, "audience">[] = [
  {
    slug: "amber-court-lehenga",
    sku: "ST-4101",
    name: "Amber Court Lehenga",
    category: "lehenga",
    price: 18490,
    compareAt: 20690,
    colors: ["Yellow", "Teal"],
    sizes: apparel,
    image: "/looks/amber-court-lehenga.jpg",
    description: "A yellow lehenga with a teal border, a teal-and-gold blouse, and a teal dupatta that sits beside the skirt. Festive colour, cut so the hem can still move.",
    fabric: "Silk blend, zari border",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["sale", "bestseller"],
    rating: 4.8,
    reviews: 126,
    inStock: true,
  },
  {
    slug: "blush-pavilion-lehenga",
    sku: "ST-4102",
    name: "Blush Pavilion Lehenga",
    category: "lehenga",
    price: 18990,
    colors: ["Rani Pink"],
    sizes: apparel,
    image: img("photo-1638456266087-09b1d160748b"),
    description: "Pink and gold work gathered into a lighter skirt, so the embroidery reads as jewellery rather than armour. A pavilion pink made for daytime pheras and late dinners.",
    fabric: "Organza, can-can, gota patti",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["new"],
    rating: 4.7,
    reviews: 64,
    inStock: true,
  },
  {
    slug: "sage-arcade-lehenga",
    sku: "ST-4108",
    name: "Sage Arcade Lehenga",
    category: "lehenga",
    price: 16551,
    compareAt: 18390,
    colors: ["Sage"],
    sizes: apparel,
    image: img("photo-1641382158662-b6ef03d53f53"),
    description: "Sage silk with a narrow gold border and a blouse in the same cloth. Quiet from across the room, detailed when someone stands beside you.",
    fabric: "Art silk, zari border",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["sale", "bestseller"],
    rating: 4.6,
    reviews: 88,
    inStock: true,
  },
  {
    slug: "ivory-arch-lehenga",
    sku: "ST-4114",
    name: "Ivory Arch Lehenga",
    category: "lehenga",
    price: 21490,
    colors: ["Ivory"],
    sizes: apparel,
    image: img("photo-1693336431506-a4f8e43330ea"),
    description: "Ivory ground with a blush border, finished like a wedding arch in cloth. The dupatta is sheer enough to sit in the hair or over one shoulder.",
    fabric: "Georgette, thread embroidery",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["new", "bestseller"],
    rating: 4.9,
    reviews: 41,
    inStock: true,
  },
  {
    slug: "pearl-hour-lehenga",
    sku: "ST-4119",
    name: "Pearl Hour Lehenga",
    category: "lehenga",
    price: 19990,
    colors: ["Blush"],
    sizes: apparel,
    image: img("photo-1693336431373-70bf946433a7"),
    description: "A blush lehenga beaded along the hem in small pearls. It is the piece we pull for engagement lunches that turn into photographs.",
    fabric: "Net, pearl beads, satin lining",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["new"],
    rating: 4.5,
    reviews: 33,
    inStock: true,
  },
  {
    slug: "ruby-filigree-lehenga",
    sku: "ST-4122",
    name: "Ruby Filigree Lehenga",
    category: "lehenga",
    price: 24990,
    colors: ["Red"],
    sizes: apparel,
    image: img("photo-1610030469983-98e550d6193c"),
    description: "Full ruby red with filigree panels that catch light when you turn. Bridal in weight of colour, still comfortable enough for a long reception.",
    fabric: "Velvet bodice, silk skirt, zari",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["bestseller"],
    rating: 4.9,
    reviews: 152,
    inStock: true,
  },
  {
    slug: "marigold-court-lehenga",
    sku: "ST-4128",
    name: "Marigold Court Lehenga",
    category: "lehenga",
    price: 15490,
    compareAt: 17290,
    colors: ["Yellow", "Blue"],
    sizes: core,
    image: "/looks/yellow-lehenga-back.jpg",
    images: [
      "/looks/yellow-lehenga-back.jpg",
      "/looks/yellow-lehenga-blouse.jpg",
      "/looks/yellow-lehenga-keyhole.jpg",
    ],
    description: "A yellow lehenga with a blue border and a blue blouse. The back closes on a keyhole, outlined in small gold butis.",
    fabric: "Silk blend, zari butis",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: ["sale"],
    rating: 4.4,
    reviews: 57,
    inStock: true,
  },
  {
    slug: "garden-rail-lehenga",
    sku: "ST-4133",
    name: "Garden Rail Lehenga",
    category: "lehenga",
    price: 13990,
    colors: ["Multi"],
    sizes: core,
    image: img("photo-1761125064798-530c13c32b6d"),
    description: "A multi-colour border lehenga meant for haldi mornings and garden lunches. Lighter cloth, deeper colour, no heavy can-can.",
    fabric: "Cotton silk",
    includes: ["Lehenga", "Blouse", "Dupatta"],
    highlights: [],
    rating: 4.3,
    reviews: 22,
    inStock: false,
  },
  {
    slug: "lotus-coord",
    sku: "ST-3301",
    name: "Paisley Co-Ord",
    category: "co-ord-set",
    price: 6490,
    colors: ["Orange"],
    sizes: core,
    image: "/looks/orange-paisley-coord.jpg",
    description: "An orange kurta and palazzo printed with small white motifs, finished with a white paisley border at the hem and cuffs.",
    fabric: "Cotton",
    includes: ["Kurta", "Palazzo"],
    highlights: ["new"],
    rating: 4.4,
    reviews: 28,
    inStock: true,
  },
  {
    slug: "cane-stripe-coord",
    sku: "ST-3306",
    name: "Cane Stripe Co-Ord",
    category: "co-ord-set",
    price: 5890,
    colors: ["Beige"],
    sizes: core,
    image: img("photo-1572804013309-59a88b7e92f1"),
    description: "Beige with a cane-thin stripe, cut as a shirt and a pleated bottom. An easy set for showroom visits, brunches, and travel days.",
    fabric: "Handloom cotton",
    includes: ["Shirt", "Bottom"],
    highlights: [],
    rating: 4.3,
    reviews: 19,
    inStock: true,
  },
  {
    slug: "dusk-coord",
    sku: "ST-3312",
    name: "Blue Leaf Co-Ord",
    category: "co-ord-set",
    price: 7290,
    compareAt: 7990,
    colors: ["Blue"],
    sizes: core,
    image: "/looks/blue-leaf-coord.jpg",
    description: "A sleeveless blue kurta with a beaded leaf on the chest, cut long over a matching palazzo.",
    fabric: "Cotton",
    includes: ["Kurta", "Palazzo"],
    highlights: ["sale"],
    rating: 4.6,
    reviews: 36,
    inStock: true,
  },
  {
    slug: "atelier-column-gown",
    sku: "ST-6104",
    name: "Atelier Column Gown",
    category: "designer",
    price: 28990,
    colors: ["Red"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: img("photo-1566174053879-31528523f8ae"),
    description: "A column gown from the atelier rail, beaded at the neck and left clean through the skirt. Made in a short run each season.",
    fabric: "Crepe, hand beading",
    includes: ["Gown"],
    highlights: ["bestseller"],
    rating: 4.9,
    reviews: 18,
    inStock: true,
  },
  {
    slug: "midnight-cape-set",
    sku: "ST-6110",
    name: "Midnight Cape Set",
    category: "designer",
    price: 26490,
    colors: ["Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: img("photo-1539008835657-9e8e9680c956"),
    description: "A midnight slip with a cape that doubles as a dupatta. For receptions that ask for black without asking you to leave the ethnic floor.",
    fabric: "Satin, chiffon cape",
    includes: ["Slip", "Cape"],
    highlights: ["new"],
    rating: 4.7,
    reviews: 14,
    inStock: true,
  },
  {
    slug: "kora-weave-set",
    sku: "ST-7102",
    name: "Kora Weave Set",
    category: "dress-material",
    price: 4590,
    colors: ["Gold"],
    sizes: ["Free Size"],
    image: img("photo-1558171813-4c088753af8f"),
    description: "An unstitched kora set with a woven gold border, enough cloth for a kurta, bottom, and dupatta. Take it to your tailor; the fall is already in the weave.",
    fabric: "Kora silk, 5.5 metres",
    includes: ["Top cloth", "Bottom cloth", "Dupatta"],
    highlights: [],
    rating: 4.5,
    reviews: 27,
    inStock: true,
  },
  {
    slug: "jamdani-note-set",
    sku: "ST-7108",
    name: "Jamdani Note Set",
    category: "dress-material",
    price: 5290,
    colors: ["Mint"],
    sizes: ["Free Size"],
    image: img("photo-1490481651871-ab68de25d43d"),
    description: "A mint ground with small jamdani-style notes. Unstitched, so the neckline and sleeve can be yours rather than ours.",
    fabric: "Cotton jamdani blend",
    includes: ["Top cloth", "Bottom cloth", "Dupatta"],
    highlights: ["new"],
    rating: 4.4,
    reviews: 16,
    inStock: true,
  },
  {
    slug: "rose-day-kurthi",
    sku: "ST-6101",
    name: "Red Hem Kurthi",
    category: "kurthi",
    price: 2490,
    colors: ["Red"],
    sizes: apparel,
    image: "/looks/red-hem-kurthi.jpg",
    description: "A sleeveless red kurthi with small blue floral sprigs and a bright blue hem. Easy through the day, finished enough for the evening.",
    fabric: "Cotton",
    includes: ["Kurthi"],
    highlights: ["bestseller", "new"],
    rating: 4.7,
    reviews: 64,
    inStock: true,
  },
  {
    slug: "ink-pleat-kurthi",
    sku: "ST-6108",
    name: "Ink Pleat Kurthi",
    category: "kurthi",
    price: 2890,
    colors: ["Ink"],
    sizes: apparel,
    image: img("photo-1483985988355-763728e1935b"),
    description: "Ink pleats from a modest neckline, long enough to sit without fuss. A studio kurthi, not a costume.",
    fabric: "Rayon",
    includes: ["Kurthi"],
    highlights: [],
    rating: 4.5,
    reviews: 28,
    inStock: true,
  },
  {
    slug: "saffron-kurthi",
    sku: "ST-6114",
    name: "Saffron Kurthi",
    category: "kurthi",
    price: 2190,
    compareAt: 2590,
    colors: ["Saffron"],
    sizes: core,
    image: img("photo-1566174053879-31528523f8ae"),
    description: "Saffron with a small tie at the neck. Light cloth, bright colour, easy to pack.",
    fabric: "Cotton",
    includes: ["Kurthi"],
    highlights: ["sale"],
    rating: 4.4,
    reviews: 19,
    inStock: true,
  },
  {
    slug: "maroon-border-saree",
    sku: "ST-6201",
    name: "Maroon Border Saree",
    category: "saree",
    price: 6990,
    colors: ["Maroon"],
    sizes: ["Free Size"],
    image: img("photo-1771507056578-f9675a2a8f8a"),
    description: "A maroon saree with a gold border that reads clearly from across the room and stays light on the shoulder.",
    fabric: "Art silk, 5.5 metres",
    includes: ["Saree", "Blouse piece"],
    highlights: ["bestseller"],
    rating: 4.8,
    reviews: 81,
    inStock: true,
  },
  {
    slug: "ivory-weave-saree",
    sku: "ST-6208",
    name: "Ivory Weave Saree",
    category: "saree",
    price: 8490,
    compareAt: 9490,
    colors: ["Ivory"],
    sizes: ["Free Size"],
    image: img("photo-1693336431506-a4f8e43330ea"),
    description: "Ivory with a woven border. The saree we pull for daytime weddings and office festivities.",
    fabric: "Cotton silk",
    includes: ["Saree", "Blouse piece"],
    highlights: ["sale", "new"],
    rating: 4.6,
    reviews: 33,
    inStock: true,
  },
  {
    slug: "garden-saree",
    sku: "ST-6212",
    name: "Garden Saree",
    category: "saree",
    price: 5990,
    colors: ["Multi"],
    sizes: ["Free Size"],
    image: img("photo-1761125064798-530c13c32b6d"),
    description: "A multi-colour border saree for haldi mornings. It drapes without a heavy fall.",
    fabric: "Cotton silk",
    includes: ["Saree", "Blouse piece"],
    highlights: [],
    rating: 4.5,
    reviews: 21,
    inStock: true,
  },
  {
    slug: "gold-line-dupatta",
    sku: "ST-6301",
    name: "Lotus Dupatta",
    category: "dupatta",
    price: 1490,
    colors: ["Teal"],
    sizes: ["Free Size"],
    image: "/looks/lotus-dupatta.jpg",
    description: "A teal dupatta scattered with lotus blooms and a peacock in the border. Styled here over a coral kurta; it finishes a plain suit just as well.",
    fabric: "Cotton silk",
    includes: ["Dupatta"],
    highlights: ["bestseller"],
    rating: 4.6,
    reviews: 44,
    inStock: true,
  },
  {
    slug: "rani-net-dupatta",
    sku: "ST-6306",
    name: "Rani Net Dupatta",
    category: "dupatta",
    price: 1290,
    compareAt: 1590,
    colors: ["Rani Pink"],
    sizes: ["Free Size"],
    image: img("photo-1638456266087-09b1d160748b"),
    description: "Rani net with a scattered motif. Wear it with the red hem kurthi or over a plain blouse.",
    fabric: "Net",
    includes: ["Dupatta"],
    highlights: ["sale"],
    rating: 4.4,
    reviews: 17,
    inStock: true,
  },
  {
    slug: "ivory-tissue-dupatta",
    sku: "ST-6310",
    name: "Ivory Tissue Dupatta",
    category: "dupatta",
    price: 1790,
    colors: ["Ivory"],
    sizes: ["Free Size"],
    image: img("photo-1490481651871-ab68de25d43d"),
    description: "Ivory tissue that catches light without looking dressed for a stage.",
    fabric: "Tissue",
    includes: ["Dupatta"],
    highlights: ["new"],
    rating: 4.5,
    reviews: 12,
    inStock: true,
  },
  {
    slug: "cloud-night-suit",
    sku: "ST-2404",
    name: "Cloud Night Suit",
    category: "night-suit",
    price: 2190,
    colors: ["White"],
    sizes: core,
    image: img("photo-1524504388940-b1c1722653e1"),
    description: "A cloud-white cotton night suit with a notched collar and full-length pyjamas. Washed soft before it reaches you.",
    fabric: "100% cotton",
    includes: ["Shirt", "Pyjama"],
    highlights: [],
    rating: 4.5,
    reviews: 48,
    inStock: true,
  },
  {
    slug: "rose-night-suit",
    sku: "ST-2411",
    name: "Rose Night Suit",
    category: "night-suit",
    price: 2490,
    compareAt: 2890,
    colors: ["Rose"],
    sizes: core,
    image: img("photo-1529626455594-4ff0802cfb7e"),
    description: "Rose cotton with white piping. The set we pack for wedding weekends, when the day outfit needs a quiet opposite.",
    fabric: "Combed cotton",
    includes: ["Shirt", "Pyjama"],
    highlights: ["sale"],
    rating: 4.6,
    reviews: 40,
    inStock: true,
  },
  {
    slug: "pearl-neck-top",
    sku: "ST-1502",
    name: "Pearl Neck Top",
    category: "top",
    price: 1890,
    colors: ["Ivory"],
    sizes: core,
    image: img("photo-1434389677669-e08b4cac3105"),
    description: "An ivory top with a small pearl-trim neckline. Short, lined, and happy over a lehenga skirt or wide denims.",
    fabric: "Cotton silk",
    includes: ["Top"],
    highlights: [],
    rating: 4.2,
    reviews: 17,
    inStock: true,
  },
  {
    slug: "ink-pleat-top",
    sku: "ST-1508",
    name: "Ink Pleat Top",
    category: "top",
    price: 2290,
    colors: ["Ink"],
    sizes: core,
    image: img("photo-1483985988355-763728e1935b"),
    description: "Ink pleats falling from a high neck. A top for the days a full suit feels like too much cloth.",
    fabric: "Georgette",
    includes: ["Top"],
    highlights: ["bestseller"],
    rating: 4.4,
    reviews: 29,
    inStock: false,
  },
  {
    slug: "saffron-tie-top",
    sku: "ST-1514",
    name: "Saffron Tie Top",
    category: "top",
    price: 1990,
    colors: ["Saffron"],
    sizes: core,
    image: img("photo-1487412720507-e7ab37603c6f"),
    description: "Saffron with a front tie and a cropped hem. Pair it with the cane trousers or a plain silk skirt.",
    fabric: "Modal",
    includes: ["Top"],
    highlights: ["new"],
    rating: 4.3,
    reviews: 11,
    inStock: true,
  },
];

const menSizes = ["S", "M", "L", "XL", "XXL", "3XL"];
const kidSizes = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

const familyPieces: Product[] = [
  {
    slug: "ivory-day-kurta",
    sku: "ST-M201",
    name: "Ivory Day Kurta",
    category: "kurta",
    audience: "men",
    price: 4990,
    colors: ["Ivory"],
    sizes: menSizes,
    image: img("photo-1610030469983-98e550d6193c"),
    description: "An ivory silk kurta with a narrow neckline, cut straight so it sits through a long lunch and a longer photo session.",
    fabric: "Art silk",
    includes: ["Kurta"],
    highlights: ["bestseller"],
    rating: 4.7,
    reviews: 54,
    inStock: true,
  },
  {
    slug: "sage-kurta-set",
    sku: "ST-M208",
    name: "Sage Kurta Set",
    category: "kurta",
    audience: "men",
    price: 6490,
    compareAt: 7290,
    colors: ["Sage"],
    sizes: menSizes,
    image: img("photo-1641382158662-b6ef03d53f53"),
    description: "Sage kurta with a matching churidar. The set we keep for groomsmen who want one decision, not three.",
    fabric: "Cotton silk",
    includes: ["Kurta", "Churidar"],
    highlights: ["sale", "new"],
    rating: 4.6,
    reviews: 31,
    inStock: true,
  },
  {
    slug: "maroon-silk-kurta",
    sku: "ST-M214",
    name: "Maroon Silk Kurta",
    category: "kurta",
    audience: "men",
    price: 5790,
    colors: ["Maroon"],
    sizes: menSizes,
    image: img("photo-1638456265353-ecfff630cfd4"),
    description: "A maroon silk kurta with a quiet gold placket. Festive without competing with the bride.",
    fabric: "Art silk",
    includes: ["Kurta"],
    highlights: [],
    rating: 4.5,
    reviews: 22,
    inStock: true,
  },
  {
    slug: "wine-sherwani",
    sku: "ST-M310",
    name: "Wine Sherwani",
    category: "sherwani",
    audience: "men",
    price: 18990,
    colors: ["Wine"],
    sizes: menSizes,
    image: img("photo-1595777457583-95e059d581b8"),
    description: "A wine sherwani with a structured collar and a lighter lining, so a reception does not feel like a costume.",
    fabric: "Silk blend, satin lining",
    includes: ["Sherwani", "Churidar"],
    highlights: ["bestseller"],
    rating: 4.8,
    reviews: 40,
    inStock: true,
  },
  {
    slug: "navy-bandhgala",
    sku: "ST-M318",
    name: "Navy Bandhgala",
    category: "sherwani",
    audience: "men",
    price: 16490,
    compareAt: 18290,
    colors: ["Navy"],
    sizes: menSizes,
    image: img("photo-1539008835657-9e8e9680c956"),
    description: "A navy bandhgala closed to the neck, with a slim trouser. Evening wear that still belongs on an ethnic floor.",
    fabric: "Wool blend",
    includes: ["Bandhgala", "Trouser"],
    highlights: ["sale"],
    rating: 4.6,
    reviews: 18,
    inStock: true,
  },
  {
    slug: "pearl-festive-shirt",
    sku: "ST-M112",
    name: "Pearl Festive Shirt",
    category: "shirt",
    audience: "men",
    price: 3290,
    colors: ["Ivory"],
    sizes: menSizes,
    image: img("photo-1434389677669-e08b4cac3105"),
    description: "An ivory festive shirt with a small embroidered placket. Wear it open over a vest, or buttoned for the ceremony.",
    fabric: "Cotton silk",
    includes: ["Shirt"],
    highlights: ["new"],
    rating: 4.4,
    reviews: 15,
    inStock: true,
  },
  {
    slug: "maroon-mustard-set",
    sku: "ST-K201",
    name: "Maroon Mustard Set",
    category: "kids-kurta",
    audience: "kids",
    price: 2490,
    colors: ["Maroon", "Mustard"],
    sizes: kidSizes,
    image: "/kids/maroon-mustard-set.webp",
    images: ["/kids/maroon-mustard-set.webp", "/kids/maroon-mustard-detail.webp"],
    description: "A sleeveless maroon top with a gold peacock motif, a mustard hem, and matching pants.",
    fabric: "Cotton",
    includes: ["Top", "Pants"],
    highlights: ["new"],
    rating: 4.8,
    reviews: 12,
    inStock: true,
  },
  {
    slug: "magenta-pavadai-set",
    sku: "ST-K208",
    name: "Magenta Pavadai Set",
    category: "kids-kurta",
    audience: "kids",
    price: 2490,
    colors: ["Magenta"],
    sizes: kidSizes,
    image: "/kids/magenta-set.jpg",
    description: "Magenta top with a pleated shoulder, a gold motif, and a paler hem over matching pants.",
    fabric: "Cotton",
    includes: ["Top", "Pants"],
    highlights: ["new", "bestseller"],
    rating: 4.7,
    reviews: 9,
    inStock: true,
  },
  {
    slug: "orange-brown-set",
    sku: "ST-K214",
    name: "Orange Brown Set",
    category: "kids-kurta",
    audience: "kids",
    price: 2490,
    colors: ["Orange", "Brown"],
    sizes: kidSizes,
    image: "/kids/orange-brown-set.jpg",
    description: "An orange sleeveless top with a brown hem and a small embroidered motif, paired with brown pants.",
    fabric: "Cotton",
    includes: ["Top", "Pants"],
    highlights: ["new"],
    rating: 4.6,
    reviews: 7,
    inStock: true,
  },
  {
    slug: "green-gold-shorts-set",
    sku: "ST-K120",
    name: "Green Gold Shorts Set",
    category: "kids-kurta",
    audience: "kids",
    price: 1990,
    colors: ["Green"],
    sizes: kidSizes,
    image: "/kids/green-gold-shorts.webp",
    description: "A green shirt and shorts checked in gold, with a mandarin collar and white buttons.",
    fabric: "Cotton",
    includes: ["Shirt", "Shorts"],
    highlights: ["new"],
    rating: 4.5,
    reviews: 6,
    inStock: true,
  },
  {
    slug: "maroon-polka-lehenga",
    sku: "ST-K401",
    name: "Maroon Polka Lehenga",
    category: "kids-lehenga",
    audience: "kids",
    price: 4490,
    colors: ["Maroon", "Beige"],
    sizes: kidSizes,
    image: "/kids/maroon-polka-lehenga.jpg",
    images: ["/kids/maroon-polka-lehenga.jpg", "/kids/maroon-polka-back.jpg", "/kids/maroon-polka-skirt.jpg"],
    description: "A maroon blouse with gold dots and a woven cuff, over a beige pleated lehenga with a green and maroon border.",
    fabric: "Cotton silk",
    includes: ["Blouse", "Lehenga"],
    highlights: ["bestseller"],
    rating: 4.8,
    reviews: 18,
    inStock: true,
  },
  {
    slug: "navy-border-lehenga",
    sku: "ST-K408",
    name: "Navy Border Lehenga",
    category: "kids-lehenga",
    audience: "kids",
    price: 4990,
    colors: ["Navy"],
    sizes: kidSizes,
    image: "/kids/navy-border-lehenga.webp",
    images: ["/kids/navy-border-lehenga.webp", "/kids/navy-border-blouse.jpg"],
    description: "A navy blouse with a green and gold border, and a pleated lehenga finished in the same border.",
    fabric: "Cotton silk",
    includes: ["Blouse", "Lehenga"],
    highlights: ["new"],
    rating: 4.7,
    reviews: 11,
    inStock: true,
  },
  {
    slug: "purple-teal-lehenga",
    sku: "ST-K416",
    name: "Purple Teal Lehenga",
    category: "kids-lehenga",
    audience: "kids",
    price: 4990,
    colors: ["Purple", "Teal"],
    sizes: kidSizes,
    image: "/kids/purple-teal-lehenga.webp",
    description: "A purple blouse edged in gold beads, with a teal and purple lehenga and a broad woven border.",
    fabric: "Art silk",
    includes: ["Blouse", "Lehenga"],
    highlights: ["new"],
    rating: 4.9,
    reviews: 14,
    inStock: true,
  },
];

export const products: Product[] = [
  ...womenPieces.map((product) => ({ ...product, audience: "women" as const })),
  ...familyPieces,
];

export const PRICE_MIN = 0;
export const PRICE_MAX = 30000;
export const PAGE_SIZE = 12;

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "Free Size", "One Size", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function categoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function categoryLine(slug: string) {
  return categories.find((category) => category.slug === slug)?.line;
}

export const allColors = Array.from(new Set(products.flatMap((product) => product.colors))).sort();

export const allSizes = SIZE_ORDER.filter((size) => products.some((product) => product.sizes.includes(size)));

export type ShopQuery = {
  q: string;
  who: Audience | "";
  cats: string[];
  highlights: string[];
  sizes: string[];
  colors: string[];
  min: number;
  max: number;
  sort: string;
  page: number;
};

export function parseShopQuery(params: URLSearchParams): ShopQuery {
  const num = (key: string, fallback: number) => {
    const raw = params.get(key);
    if (raw == null || raw.trim() === "") return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  };
  const list = (key: string) =>
    (params.get(key) ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const whoRaw = params.get("who") ?? "";
  const who = whoRaw === "women" || whoRaw === "men" || whoRaw === "kids" ? whoRaw : "";

  return {
    q: params.get("q")?.trim() ?? "",
    who,
    cats: list("cat"),
    highlights: list("highlight"),
    sizes: list("size"),
    colors: list("color"),
    min: num("min", PRICE_MIN),
    max: num("max", PRICE_MAX),
    sort: params.get("sort") ?? "featured",
    page: Math.max(1, num("page", 1)),
  };
}

export function filterProducts(query: ShopQuery, source: Product[] = products) {
  let items = source.filter((product) => {
    if (query.who && product.audience !== query.who) return false;
    if (query.cats.length && !query.cats.includes(product.category)) return false;
    if (query.highlights.length && !query.highlights.some((item) => product.highlights.includes(item as Highlight))) return false;
    if (query.sizes.length && !query.sizes.some((size) => product.sizes.includes(size))) return false;
    if (query.colors.length && !query.colors.some((color) => product.colors.includes(color))) return false;
    if (product.price < query.min || product.price > query.max) return false;
    if (query.q) {
      const haystack = `${product.name} ${product.sku} ${product.category} ${product.colors.join(" ")} ${product.fabric}`.toLowerCase();
      if (!haystack.includes(query.q.toLowerCase())) return false;
    }
    return true;
  });

  items = [...items].sort((a, b) => {
    if (query.sort === "price-asc") return a.price - b.price;
    if (query.sort === "price-desc") return b.price - a.price;
    if (query.sort === "rating") return b.rating - a.rating;
    if (query.sort === "latest") return source.indexOf(a) - source.indexOf(b);
    const score = (product: Product) =>
      (product.highlights.includes("bestseller") ? 2 : 0) + (product.highlights.includes("new") ? 1 : 0);
    return score(b) - score(a);
  });

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  return { items: items.slice(start, start + PAGE_SIZE), total, page, pageCount, start };
}
