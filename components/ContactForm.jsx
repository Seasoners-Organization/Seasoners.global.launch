"use client";
import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    await fetch("https://formspree.io/f/manywrjl", { // Replace with your Formspree ID
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    setSubmitted(true);
    form.reset();
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold text-sky-800 mb-4">Contact Us</h3>
      {submitted ? (
        <p className="text-green-600">Thank you! Your message has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" name="name" placeholder="Your Name" className="w-full border p-3 rounded-lg" />
          <input required type="email" name="email" placeholder="Your Email" className="w-full border p-3 rounded-lg" />
          <textarea required name="message" placeholder="Your Message" rows="4" className="w-full border p-3 rounded-lg"></textarea>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
