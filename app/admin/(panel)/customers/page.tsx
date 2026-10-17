import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <>
      <header className="desk-head">
        <h1>Customers</h1>
        <p className="desk-note">{customers.length === 1 ? "1 account" : `${customers.length} accounts`}</p>
      </header>
      {customers.length === 0 ? <p>No customer accounts yet.</p> : (
        <div className="desk-table-wrap">
          <table className="desk-table">
            <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Orders</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer._count.orders}</td>
                  <td>{customer.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
