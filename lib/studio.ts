export const studio = {
  name: "Sthree Designer Studio",
  tagline: "The vintage fashion for modern women",
  phones: ["7995255536, 7995255537, 7995255538"],
  address: "House No. 2-3-443/1, Sainagar Colony, Nagole, Hyderabad, Telangana 500068",
  email: "Sthreedesignerstudios@gmail.com",
  instagram: "https://www.instagram.com/sthreedesignerstudios",
  instagramLabel: "@sthreedesignerstudios",
  whatsapp: "https://wa.me/917995255536",
  sisters: ["Swarna", "Swathi", "Santhoshi"] as const,
  family: "Gitta",
  opened: 2018,
  years: 8,
  families: 500,
  outlets: 2,
};

export const sisterLine = `${studio.sisters.slice(0, -1).join(", ")}, and ${studio.sisters.at(-1)} ${studio.family}`;
