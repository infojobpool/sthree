import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="page prose">
      <p className="eyebrow">Care</p>
      <h1>Privacy</h1>
      <p>Sthree, as built here, is a demonstration store. Your bag, wishlist, account, and orders stay in this browser’s local storage. They are not sent to a server. Clearing the site data removes them.</p>
      <p>The contact form and newsletter only confirm on this page. Do not enter a real card number — checkout does not process payment.</p>
    </div>
  );
}
