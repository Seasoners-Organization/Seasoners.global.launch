import { redirect } from "next/navigation";

// Redirect /help to /contact
export default function HelpRedirect() {
  redirect('/contact');
}
