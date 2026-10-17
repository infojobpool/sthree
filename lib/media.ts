import { footerPhoto, heroPhoto, looks, portraitPhoto } from "@/lib/photos";

export type OccasionCard = { name: string; href: string; image: string };

export type HomeMedia = {
  heroes: string[];
  dasara: string;
  occasions: OccasionCard[];
  footer: string;
};

export const defaultOccasions: OccasionCard[] = [
  { name: "Wedding", href: "/shop?cat=lehenga", image: portraitPhoto(looks.ivory) },
  { name: "Sangeet", href: "/shop?cat=lehenga", image: portraitPhoto(looks.blush) },
  { name: "Festive morning", href: "/shop?cat=dupatta", image: portraitPhoto(looks.pearl) },
  { name: "Everyday", href: "/shop?cat=co-ord-set", image: portraitPhoto(looks.sage) },
  { name: "Brunch", href: "/shop?cat=co-ord-set", image: portraitPhoto(looks.garden) },
  { name: "Festive day", href: "/shop?cat=saree", image: portraitPhoto(looks.ruby) },
];

export const defaultHomeMedia: HomeMedia = {
  heroes: [heroPhoto(looks.ivory), heroPhoto(looks.blush), heroPhoto(looks.pearl)],
  dasara: "/banners/dasara-double-dhamaka.jpg",
  occasions: defaultOccasions,
  footer: footerPhoto(looks.ivory),
};

export function parseHomeMedia(raw: string | null | undefined): HomeMedia {
  if (!raw) return defaultHomeMedia;
  try {
    const data = JSON.parse(raw) as Partial<HomeMedia> & { occasionImages?: Record<string, string> };
    const heroes = defaultHomeMedia.heroes.map((src, index) => {
      const next = Array.isArray(data.heroes) ? data.heroes[index] : "";
      return typeof next === "string" && next.trim() ? next.trim() : src;
    });
    const occasions = defaultOccasions.map((occasion) => {
      const fromList = data.occasions?.find((item) => item.name === occasion.name)?.image;
      const fromMap = data.occasionImages?.[occasion.name];
      const image = (fromList || fromMap || occasion.image).trim();
      return { ...occasion, image: image || occasion.image };
    });
    return {
      heroes,
      dasara: typeof data.dasara === "string" && data.dasara.trim() ? data.dasara.trim() : defaultHomeMedia.dasara,
      occasions,
      footer: typeof data.footer === "string" && data.footer.trim() ? data.footer.trim() : defaultHomeMedia.footer,
    };
  } catch {
    return defaultHomeMedia;
  }
}

