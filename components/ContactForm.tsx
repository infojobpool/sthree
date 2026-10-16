"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return <p className="success">Message received. The house will write back on the next working day.</p>;
  }

  return (
    <form className="stack-form" onSubmit={submit}>
      <label className="field">Name<input name="name" required /></label>
      <label className="field">Email<input name="email" type="email" required /></label>
      <label className="field">Mobile<input name="phone" required /></label>
      <label className="field">Message<textarea name="message" rows={5} required /></label>
      <button className="btn" type="submit">Send message</button>
    </form>
  );
}
