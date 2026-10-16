export function formatINR(value: number) {
  const n = Math.round(value).toString();
  if (n.length <= 3) return `₹${n}`;
  const last3 = n.slice(-3);
  const rest = n.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${grouped},${last3}`;
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const FREE_SHIPPING = 15000;
export const SHIPPING_FEE = 149;
export const PROMO_CODE = "GRACE10";
export const PROMO_RATE = 0.2;

export type OfferSettings = {
  promoOn: boolean;
  promoCode: string;
  freeShipping: number;
  shippingFee: number;
};

export const defaultOffer: OfferSettings = {
  promoOn: true,
  promoCode: PROMO_CODE,
  freeShipping: FREE_SHIPPING,
  shippingFee: SHIPPING_FEE,
};

export function discountFor(subtotal: number, code: string, offer: OfferSettings = defaultOffer) {
  if (!offer.promoOn) return 0;
  if (code.trim().toUpperCase() !== offer.promoCode.trim().toUpperCase()) return 0;
  return Math.round(subtotal * PROMO_RATE);
}

export function shippingFor(subtotal: number, discount: number, offer: OfferSettings = defaultOffer) {
  if (subtotal <= 0) return 0;
  if (subtotal - discount >= offer.freeShipping) return 0;
  return offer.shippingFee;
}
