import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsOfService() {
  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-sky max-w-none">
          <p>Welcome to Seasoners! By using our platform, you agree to these Terms of Service. Please read them carefully.</p>
          <h2>1. Use of the Platform</h2>
          <ul>
            <li>You must be at least 18 years old to use Seasoners.</li>
            <li>You are responsible for your account and all activity under it.</li>
            <li>Do not use Seasoners for unlawful, harmful, or abusive purposes.</li>
          </ul>
          <h2>2. Listings & Agreements</h2>
          <ul>
            <li>All listings and agreements must be honest, accurate, and comply with local laws.</li>
            <li>Seasoners is not a party to private agreements between users. We provide tools for clarity and trust, but legal responsibility remains with the parties.</li>
            <li>We may remove content or accounts that violate these terms or applicable law.</li>
          </ul>
          <h2>3. Payments & Subscriptions</h2>
          <ul>
            <li>Subscription fees are clearly disclosed. You will be notified before any charges.</li>
            <li>You may cancel your subscription at any time before the paid period begins to avoid charges.</li>
            <li>All payments are processed securely via Stripe.</li>
          </ul>
          <h2>4. Disclaimers</h2>
          <ul>
            <li>Seasoners is provided "as is" without warranties of any kind.</li>
            <li>We are not liable for user conduct, agreements, or third-party services.</li>
            <li>Nothing on this site is legal advice. Consult a qualified professional for legal matters.</li>
          </ul>
          <h2>5. Changes & Contact</h2>
          <ul>
            <li>We may update these terms. We will notify you of significant changes.</li>
            <li>Contact <a href="mailto:support@seasoners.eu">support@seasoners.eu</a> with questions.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  );
}
