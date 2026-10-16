export type CartItem = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderLine = CartItem & {
  name: string;
  sku: string;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  email: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  code: string;
  customer: Customer;
  payment: string;
  paymentStatus: string;
  note: string;
  createdAt: string;
  status: string;
};

export type AccountUser = {
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN";
};
