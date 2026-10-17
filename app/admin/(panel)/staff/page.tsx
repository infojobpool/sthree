import { addStaff, changePassword } from "@/lib/admin-actions";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  staff: "Staff login added.",
  password: "Password changed.",
};
const errors: Record<string, string> = {
  details: "Name, email, and a password of at least 6 characters are required.",
  email: "That email already has an account.",
  short: "Use at least 6 characters.",
  password: "The current password does not match.",
};

export default async function AdminStaff({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const { notice, error } = await searchParams;
  const session = await getSession();
  const staff = await prisma.user.findMany({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });

  return (
    <>
      <header className="desk-head">
        <h1>Staff</h1>
        <p className="desk-note">Signed in as {session?.email}. Add a desk login or change your password.</p>
      </header>
      {notice && notices[notice] ? <p className="success">{notices[notice]}</p> : null}
      {error && errors[error] ? <p className="error">{errors[error]}</p> : null}
      <div className="desk-split">
        <form className="desk-card desk-form" action={addStaff}>
          <h2>Add a login</h2>
          <label className="field">Name<input name="name" required /></label>
          <label className="field">Email<input name="email" type="email" required /></label>
          <label className="field">Password<input name="password" type="password" minLength={6} required /></label>
          <button className="btn" type="submit">Add staff</button>
        </form>
        <form className="desk-card desk-form" action={changePassword}>
          <h2>Change your password</h2>
          <label className="field">Current password<input name="current" type="password" required /></label>
          <label className="field">New password<input name="next" type="password" minLength={6} required /></label>
          <button className="btn" type="submit">Change password</button>
        </form>
      </div>
      <div className="desk-table-wrap">
        <table className="desk-table">
          <thead><tr><th>Name</th><th>Email</th><th>Since</th></tr></thead>
          <tbody>
            {staff.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
