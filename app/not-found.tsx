import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty">
        <p className="eyebrow">404</p>
        <h2>This page has left the floor</h2>
        <Link className="btn" href="/shop">Back to the shop</Link>
      </div>
    </div>
  );
}
