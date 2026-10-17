import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { heroPhoto, looks, portraitPhoto } from "@/lib/photos";
import { sisterLine, studio } from "@/lib/studio";

export const metadata: Metadata = { title: "About & Contact" };

const chapters = [
  {
    year: String(studio.opened),
    title: "A small Nagole floor",
    text: "The Gitta sisters opened Sthree for lehengas, kurtis, and sarees they would wear to a wedding in their own family. The name is the word for woman — the floor has since grown to hold men and kids as well.",
  },
  {
    year: "The edit",
    title: "Clothes that last the function",
    text: "Embroidery sits lightly, linings breathe, and women’s sizing runs from XS through 5XL. If a blouse needs a nip or a hem needs an hour, the studio can arrange it on the floor.",
  },
  {
    year: "Today",
    title: "Two outlets, five hundred families",
    text: "Eight years on, the house keeps two shopping outlets in Hyderabad and a following of five hundred families who still come in to try the fall before they take a piece home.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-stage">
        <img src={heroPhoto(looks.blush)} alt="" />
        <div className="about-stage-copy">
          <p className="eyebrow">The house · Nagole, {studio.opened}</p>
          <p className="about-script">Sthree</p>
          <h1>A sisters' atelier, kept close</h1>
          <p>
            {sisterLine} opened the floor for festive clothes they would wear themselves. The work is still theirs: a blouse that sits, a lehenga you can walk in, and a desk that remembers you.
          </p>
        </div>
      </section>

      <div className="about-body">
        <section className="about-sisters" aria-label="The Gitta sisters">
          {studio.sisters.map((name, index) => (
            <article key={name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{name}</strong>
              <em>{studio.family}</em>
            </article>
          ))}
        </section>

        <section className="about-letter">
          <p className="eyebrow">A note from the floor</p>
          <blockquote>
            They chose the pieces, stood on the floor, and built a following by sending people home in clothes that moved with them — not only photographed well.
          </blockquote>
        </section>
      </div>

      <section className="about-tally" aria-label="The house in numbers">
        <p><strong>{studio.years}</strong><span>Years on the floor</span></p>
        <p><strong>{studio.families}+</strong><span>Loyal families</span></p>
        <p><strong>{studio.outlets}</strong><span>Hyderabad outlets</span></p>
      </section>

      <div className="about-body">
        <ol className="about-line">
          {chapters.map((chapter) => (
            <li key={chapter.title}>
              <span>{chapter.year}</span>
              <div>
                <h2>{chapter.title}</h2>
                <p>{chapter.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="about-visit">
          <img src={portraitPhoto(looks.ruby)} alt="" />
          <div>
            <p className="eyebrow">On the floor</p>
            <h2>Visit before you decide</h2>
            <p>
              Try the fall, the blouse, and the dupatta at the Nagole studio. Weekdays are quieter.
              For the second Hyderabad outlet, call the desk and they will send you to the nearer floor.
            </p>
            <div className="contact-actions">
              <Link className="btn" href="/showrooms">Showroom details</Link>
              <a className="btn btn-ghost" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp the studio</a>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-desk">
          <div className="contact-intro">
            <p className="eyebrow">Write to us</p>
            <h2>The desk is in Nagole</h2>
            <p>A size, a blouse alteration, or an order — send a note. The house replies on working days, and WhatsApp is the fastest way to catch them on the floor.</p>
            <ul className="contact-ways">
              <li>
                <span>Call</span>
                <div>
                  {studio.phones[0].split(",").map((phone) => {
                    const digits = phone.replace(/\D/g, "");
                    return <a key={digits} href={`tel:+91${digits}`}>{digits}</a>;
                  })}
                </div>
              </li>
              <li>
                <span>Visit</span>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(studio.address)}`} target="_blank" rel="noreferrer">{studio.address}</a>
              </li>
              <li>
                <span>Hours</span>
                <p>Open daily, 11:00 – 8:30</p>
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${studio.email}`}>{studio.email}</a>
              </li>
              <li>
                <span>Instagram</span>
                <a href={studio.instagram}>{studio.instagramLabel}</a>
              </li>
            </ul>
            <div className="contact-actions">
              <a className="btn" href={studio.whatsapp} target="_blank" rel="noreferrer">WhatsApp the studio</a>
              <Link className="btn btn-ghost" href="/showrooms">Showroom details</Link>
            </div>
          </div>
          <div className="contact-card">
            <p className="eyebrow">A note to the house</p>
            <h3>Send a message</h3>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
