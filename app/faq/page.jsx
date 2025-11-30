import { redirect } from "next/navigation";

// Server-side redirect to maintain /faq legacy link
export default function FAQRedirect() {
  redirect('/help');
}
