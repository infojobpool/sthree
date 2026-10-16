import DeskNav from "@/components/admin/DeskNav";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/admin/login");

  return (
    <div className="admin-shell">
      <DeskNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}
