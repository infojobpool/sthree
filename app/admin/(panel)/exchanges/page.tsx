import Link from "next/link";
import { saveExchange } from "@/lib/admin-actions";
import { prisma } from "@/lib/db";
import { EXCHANGE_STATUSES } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminExchanges() {
  const rows = await prisma.exchange.findMany({ orderBy: { createdAt: "desc" }, include: { order: true } });

  return (
    <>
      <header className="desk-head">
        <h1>Exchanges</h1>
        <p className="desk-note">{rows.length === 1 ? "1 exchange" : `${rows.length} exchanges`} · requests from the order page land here.</p>
      </header>
      {rows.length === 0 ? <p className="desk-note">No exchanges yet.</p> : (
        <div className="desk-table-wrap">
          <table className="desk-table">
            <thead><tr><th>When</th><th>Order</th><th>Request</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.createdAt.toLocaleString("en-IN")}</td>
                  <td><Link href={`/admin/orders/${row.orderId}`}>{row.orderId}</Link><br /><small>{row.order.email}</small></td>
                  <td>{row.reason}</td>
                  <td>
                    <form className="desk-inline" action={saveExchange}>
                      <input type="hidden" name="id" value={row.id} />
                      <select name="status" defaultValue={row.status} aria-label={`Status for exchange ${row.id}`}>
                        {EXCHANGE_STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <button className="btn" type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
