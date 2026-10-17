"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOut from "@/components/admin/SignOut";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/media", label: "Images" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/exchanges", label: "Exchanges" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/staff", label: "Staff" },
];

export default function DeskNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-nav">
      <strong className="admin-brand">Sthree<span>Studio desk</span></strong>
      <nav>
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return <Link key={link.href} href={link.href} className={active ? "is-active" : undefined}>{link.label}</Link>;
        })}
      </nav>
      <div className="admin-nav-foot">
        <Link href="/">View shop</Link>
        <SignOut />
      </div>
    </aside>
  );
}
