import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <div className="page prose">
      <p className="eyebrow">Care</p>
      <h1>Shipping & returns</h1>
      <h2>Shipping</h2>
      <p>Orders leave Hyderabad in 2–4 working days. Shipping is ₹149, and complimentary when the order, after any code, is ₹15,000 or more. Cash on delivery, UPI, and card are offered at checkout in this demonstration shop.</p>
      <h2>Exchanges</h2>
      <p>Unworn pieces with tags intact can be exchanged within 7 days of delivery. Bridal lehengas that have been altered in the studio are final. Write to Sthreedesignerstudios@gmail.com with your order id.</p>
    </div>
  );
}
