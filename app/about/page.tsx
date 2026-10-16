import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "About & Contact" };

export default function AboutPage() {
  return (
    <div className="page">
      <div className="prose">
        <p className="eyebrow">The house</p>
        <h1>About us</h1>
        <p>Sthree Designer Studio is a Hyderabad atelier for festive clothes that can actually be worn. The name is the word for woman — and the floor now holds women, men, and kids.</p>
        <h2>How the edit is chosen</h2>
        <p>Lehengas, kurtas, sherwanis, and the smaller things that finish an outfit. Embroidery sits lightly, linings breathe, and women’s sizing runs from XS through 5XL.</p>
        <p>The studio is at House No. 2-3-443/1, Sainagar Colony, Nagole. If a blouse needs a nip or a hem needs an hour, come in and the studio can arrange it.</p>
      </div>
      <section id="contact" className="section contact-grid">
        <div className="prose">
          <p className="eyebrow">Write to us</p>
          <h2>Contact</h2>
          <p>Questions about a size, a blouse alteration, or an order id — send a note. The desk replies on working days.</p>
          <p>
            <a href="tel:7995255536">7995255536</a><br />
            <a href="tel:7995255537">7995255537</a><br />
            <a href="tel:7995255538">7995255538</a><br />
            House No. 2-3-443/1, Sainagar Colony, Nagole, Hyderabad, Telangana 500068<br />
            <a href="mailto:Sthreedesignerstudios@gmail.com">Sthreedesignerstudios@gmail.com</a><br />
            <a href="https://www.instagram.com/sthreedesignerstudios">sthreedesignerstudios</a><br />
            <a href="https://www.sthreedesignerstudios.com">www.sthreedesignerstudios.com</a>
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
