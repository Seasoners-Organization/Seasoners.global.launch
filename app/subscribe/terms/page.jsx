import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function SubscriptionTerms() {
  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">Subscription Terms & Launch Offer</h1>
        <div className="prose prose-sky max-w-none">
          <p><strong>Launch Offer:</strong> All subscriptions are <span style={{color:'#22c55e'}}>free</span> until the official paid launch date. You can sign up and enter your card details, but you will <strong>not</strong> be charged until we announce the start of paid subscriptions.</p>
          <ul>
            <li>Your free trial lasts 30 days from the date you subscribe.</li>
            <li>You will be notified by email at least 7 days before your first payment is processed.</li>
            <li>You may cancel your subscription at any time before the paid period begins and you will not be charged.</li>
            <li>By subscribing now, you reserve your spot and lock in your launch offer benefits.</li>
            <li>When paid subscriptions begin, your card will be charged the monthly fee unless you cancel.</li>
          </ul>
          <p>For questions, contact <a href="mailto:support@seasoners.eu">support@seasoners.eu</a>.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
