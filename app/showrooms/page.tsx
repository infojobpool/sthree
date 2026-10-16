import type { Metadata } from "next";

export const metadata: Metadata = { title: "Showrooms" };

const rooms = [
  {
    name: "Nagole studio",
    address: "House No. 2-3-443/1, Sainagar Colony, Nagole, Hyderabad, Telangana 500068",
    hours: "Open daily, 11:00 – 8:30",
    phone: "7995255536 · 7995255537 · 7995255538",
  },
];

export default function ShowroomsPage() {
  return (
    <div className="page">
      <header className="page-title">
        <p className="eyebrow">Visit</p>
        <h1>Showrooms</h1>
        <p>Try the fall of a lehenga before you take it home. Appointments are welcome; walk-ins are fine on weekdays.</p>
      </header>
      <div className="room-grid">
        {rooms.map((room) => (
          <article key={room.name} className="room">
            <h3>{room.name}</h3>
            <p>{room.address}</p>
            <p>{room.hours}</p>
            <p>{room.phone}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
