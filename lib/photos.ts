const crop = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=faces,center&w=${w}&h=${h}&q=80`;

export const heroPhoto = (id: string) => crop(id, 1920, 1080);
export const portraitPhoto = (id: string) => crop(id, 900, 1200);
export const footerPhoto = (id: string) => crop(id, 2400, 720);

export const looks = {
  ivory: "photo-1693336431506-a4f8e43330ea",
  blush: "photo-1638456266087-09b1d160748b",
  pearl: "photo-1693336431373-70bf946433a7",
  ruby: "photo-1610030469983-98e550d6193c",
  sage: "photo-1641382158662-b6ef03d53f53",
  garden: "photo-1761125064798-530c13c32b6d",
};
