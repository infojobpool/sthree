import { saveSettings } from "@/lib/admin-actions";
import { formatINR } from "@/lib/format";
import { getShopSettings } from "@/lib/storefront";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  saved: "Shop settings saved. Checkout uses them on the next order.",
};

export default async function AdminSettings({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const settings = await getShopSettings();

  return (
    <>
      <header className="desk-head">
        <p className="eyebrow">Shop settings</p>
        <h1>Offer and shipping</h1>
        <p className="desk-note">The festive offer stays a flat 20% when the code is on. You can change the code word, turn it off, and set the shipping line. Complimentary shipping is currently {formatINR(settings.freeShipping)}.</p>
      </header>
      {notice && notices[notice] ? <p className="success">{notices[notice]}</p> : null}
      <form className="desk-card desk-form desk-form-narrow" action={saveSettings}>
        <label className="check"><input type="checkbox" name="promoOn" defaultChecked={settings.promoOn} /><span>Offer code is on</span></label>
        <label className="field">Code word<input name="promoCode" defaultValue={settings.promoCode} required /></label>
        <label className="field">Free shipping from ₹<input name="freeShipping" type="number" min={0} defaultValue={settings.freeShipping} required /></label>
        <label className="field">Shipping fee ₹<input name="shippingFee" type="number" min={0} defaultValue={settings.shippingFee} required /></label>
        <button className="btn" type="submit">Save settings</button>
      </form>
    </>
  );
}
