"use client";

export default function PrintButton() {
  return <button className="btn btn-ghost no-print" type="button" onClick={() => window.print()}>Print bill</button>;
}
