import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-sky max-w-none">
          <p>Your privacy is important to us. This Privacy Policy explains how Seasoners collects, uses, and protects your information.</p>
          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Account Information:</strong> Name, email, phone number, and other details you provide when registering.</li>
            <li><strong>Listings & Content:</strong> Information you submit for listings, agreements, and messages.</li>
            <li><strong>Usage Data:</strong> Analytics, device, and log data to improve our service.</li>
          </ul>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve the Seasoners platform.</li>
            <li>To communicate with you about your account, listings, and agreements.</li>
            <li>To comply with legal obligations and protect our users.</li>
          </ul>
          <h2>Sharing & Disclosure</h2>
          <ul>
            <li>We do not sell your personal data.</li>
            <li>We may share information with trusted service providers (e.g., payment, hosting, analytics) as needed to operate the platform.</li>
            <li>We may disclose information if required by law or to protect our rights and users.</li>
          </ul>
          <h2>Your Rights</h2>
          <ul>
            <li>You can access, update, or delete your account at any time.</li>
            <li>You may request a copy of your data or ask us to delete it, subject to legal requirements.</li>
            <li>Contact <a href="mailto:support@seasoners.eu">support@seasoners.eu</a> for privacy requests.</li>
          </ul>
          <h2>Cookies & Tracking</h2>
          <p>We use cookies and analytics to improve your experience. You can control cookies in your browser settings.</p>
          <h2>International Users</h2>
          <p>Your data may be processed outside your country. We use industry-standard safeguards to protect your information.</p>
          <h2>Changes to This Policy</h2>
          <p>We may update this policy. We will notify you of significant changes by email or on the platform.</p>
          <h2>Contact</h2>
          <p>For questions, contact <a href="mailto:support@seasoners.eu">support@seasoners.eu</a>.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
