"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <p className="contact-done">
        Message received. The house will write back on the next working day.
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">Name<input name="name" required autoComplete="name" placeholder="Your name" /></label>
      <label className="field">Email<input name="email" type="email" required autoComplete="email" placeholder="you@email.com" /></label>
      <label className="field is-wide">Mobile<input name="phone" type="tel" required autoComplete="tel" placeholder="10-digit mobile" /></label>
      <label className="field is-wide">Message<textarea name="message" rows={5} required placeholder="A size, a blouse, or a piece you saw on the floor." /></label>
      <button className="btn is-wide" type="submit">Send message</button>
    </form>
  );
}
