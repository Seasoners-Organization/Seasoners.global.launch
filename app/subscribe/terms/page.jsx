import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function SubscriptionTerms() {
  return (
    <main>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8 text-sky-900">Subscription Terms & Conditions</h1>
        
        {/* Early Bird Promotion Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-3 flex items-center gap-2">
            Early Bird Promotion - 3 Months Free
          </h2>
          <p className="text-amber-800 font-semibold mb-3">
            Sign up during our launch period and receive <strong>90 days (3 months) of completely free access</strong> to your chosen plan.
          </p>
          <ul className="space-y-2 text-amber-900 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>No payment required for 90 days</strong> - Full access to all premium features</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Monthly email reminders</strong> - We'll notify you at 60, 30, 7, and 1 day before trial ends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Cancel anytime</strong> - No charges if you cancel before day 90</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Automatic billing after trial</strong> - Your card will be charged on day 91 unless you cancel</span>
            </li>
          </ul>
        </div>

        <div className="prose prose-sky max-w-none space-y-8">
          
          {/* Section 1: Free Trial Period */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">1. Free Trial Period (Early Bird Promotion)</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">1.1 Trial Duration</h3>
            <p>Users who sign up during the Early Bird promotion period receive a <strong>90-day (3-month) free trial</strong> of their selected subscription plan (Searcher or Lister). This trial period begins on the date of subscription activation.</p>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">1.2 What You Get During Trial</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Full Access:</strong> Complete access to all features included in your chosen plan</li>
              <li><strong>No Payment Required:</strong> No charges for 90 days from subscription date</li>
              <li><strong>Credit Card Required:</strong> Payment method needed to start trial, but not charged until day 91</li>
              <li><strong>Premium Features:</strong> All Searcher or Lister benefits active immediately</li>
            </ul>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">1.3 Trial Period Modifications</h3>
            <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <strong>Important Notice:</strong> Seasoners reserves the right to adjust the free trial duration for new sign-ups as our user base grows. Current users will maintain their original 90-day trial period. Future promotions may offer shorter trial periods (e.g., 30 days, 7 days, or no trial).
            </p>
          </section>

          {/* Section 2: Email Notifications */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">2. Trial Reminder Notifications</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">2.1 Automated Email Schedule</h3>
            <p>To ensure you're never caught off guard, we will send email reminders at the following intervals:</p>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold">Day 30</span>
                <span>First reminder - 60 days remaining on your free trial</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold">Day 60</span>
                <span>Second reminder - 30 days remaining on your free trial</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">Day 83</span>
                <span><strong>Important:</strong> 7 days until billing begins</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">Day 89</span>
                <span><strong>Final notice:</strong> 1 day until your card will be charged</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">2.2 Email Content</h3>
            <p>Each reminder email will include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Exact number of days remaining in your trial</li>
              <li>Your current subscription plan and monthly price</li>
              <li>Direct link to manage or cancel your subscription</li>
              <li>Summary of features you've been enjoying</li>
              <li>Contact information for support questions</li>
            </ul>
          </section>

          {/* Section 3: Billing */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">3. Billing After Trial Period</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">3.1 Automatic Billing</h3>
            <p className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              On <strong>day 91</strong> (the day after your 90-day trial ends), your payment method on file will be automatically charged the monthly subscription fee for your selected plan:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Searcher Plan:</strong> €7.00 per month</li>
              <li><strong>Lister Plan:</strong> €12.00 per month</li>
            </ul>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">3.2 Recurring Billing</h3>
            <p>After your trial ends, you will be billed monthly on the same calendar day each month. For example, if your trial ends on January 15th, you'll be charged on the 15th of each subsequent month.</p>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">3.3 Payment Methods</h3>
            <p>We accept major credit cards and debit cards through our secure payment processor, Stripe. All payment information is encrypted and stored securely.</p>
          </section>

          {/* Section 4: Cancellation */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">4. Cancellation Policy</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">4.1 Cancel Anytime</h3>
            <p>You may cancel your subscription at any time, for any reason, with no penalties or fees.</p>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">4.2 Cancellation During Trial</h3>
            <p className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <strong>Cancel before day 90:</strong> If you cancel anytime during your 90-day free trial, you will not be charged anything. Your access will continue until the end of your trial period.
            </p>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">4.3 Cancellation After Trial</h3>
            <p>If you cancel after your trial has ended and billing has begun:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You will not be charged for future months</li>
              <li>You retain access until the end of your current billing period</li>
              <li>No partial refunds for unused days in the current month</li>
            </ul>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">4.4 How to Cancel</h3>
            <p>To cancel your subscription:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Log into your Seasoners account</li>
              <li>Go to Profile → Subscription tab</li>
              <li>Click "Manage Subscription" or "Cancel Subscription"</li>
              <li>Follow the cancellation prompts</li>
              <li>You'll receive an email confirmation</li>
            </ol>
          </section>

          {/* Section 5: Plan Features */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">5. Subscription Plans</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">5.1 Searcher Plan (€7/month after trial)</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contact unlimited hosts and employers</li>
              <li>Unlimited in-app messaging</li>
              <li>Save unlimited favorite listings</li>
              <li>Advanced search filters</li>
              <li>Priority customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">5.2 Lister Plan (€12/month after trial)</h3>
            <p>Includes everything in Searcher, plus:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create unlimited listings (stays, jobs, flatshares)</li>
              <li>Featured badge on all your listings</li>
              <li>Create and manage digital agreements</li>
              <li>Response analytics and insights</li>
              <li>Early access to new features</li>
            </ul>
          </section>

          {/* Section 6: Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">6. Changes to Terms & Pricing</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">6.1 Grandfathered Pricing</h3>
            <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <strong>Price Protection:</strong> Your monthly subscription price (€7 for Searcher, €12 for Lister) is locked in for as long as you maintain an active subscription. If we increase prices in the future, existing subscribers keep their current rate.
            </p>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">6.2 Changes for New Users</h3>
            <p>We reserve the right to modify subscription pricing, trial duration, or features for new sign-ups. Changes will be communicated through:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Website announcements</li>
              <li>Email notifications to existing users</li>
              <li>Updated terms on this page (with revision date)</li>
            </ul>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">6.3 Material Changes</h3>
            <p>For any material changes to existing subscriber terms, we will provide at least 30 days advance notice via email. Continued use of the service after the notice period constitutes acceptance of the new terms.</p>
          </section>

          {/* Section 7: Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">7. Refund Policy</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">7.1 Trial Period</h3>
            <p>No refunds are applicable during the free trial period as no charges are made.</p>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">7.2 Post-Trial Refunds</h3>
            <p>If you are charged after your trial ends and believe the charge was in error:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contact us within 7 days: <a href="mailto:support@seasoners.eu" className="text-sky-600 hover:underline">support@seasoners.eu</a></li>
              <li>We will review your case and issue a refund if appropriate</li>
              <li>Refunds typically process within 5-10 business days</li>
            </ul>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">7.3 No Partial Refunds</h3>
            <p>We do not offer partial refunds for unused portions of a billing period. If you cancel mid-month, you retain access until the end of that month but will not receive a prorated refund.</p>
          </section>

          {/* Section 8: Account Termination */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">8. Account Termination</h2>
            
            <h3 className="text-xl font-semibold text-sky-800 mb-2">8.1 Termination by User</h3>
            <p>You may terminate your account at any time by canceling your subscription and deleting your account through your profile settings.</p>

            <h3 className="text-xl font-semibold text-sky-800 mb-2 mt-4">8.2 Termination by Seasoners</h3>
            <p>We reserve the right to suspend or terminate accounts that violate our Terms of Service, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fraudulent activity or payment disputes</li>
              <li>Violations of community guidelines</li>
              <li>Abuse of platform features or other users</li>
              <li>Illegal activity</li>
            </ul>
            <p className="mt-2">In such cases, no refund will be provided for the current billing period.</p>
          </section>

          {/* Section 9: Contact & Support */}
          <section>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">9. Contact Information</h2>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <p className="mb-3"><strong>For subscription questions or support:</strong></p>
              <ul className="space-y-2">
                <li>📧 Email: <a href="mailto:support@seasoners.eu" className="text-sky-600 hover:underline font-semibold">support@seasoners.eu</a></li>
                <li>💬 In-app support: Message us through your account dashboard</li>
                <li>📄 Help Center: <a href="/help" className="text-sky-600 hover:underline">www.seasoners.eu/help</a></li>
              </ul>
              <p className="mt-4 text-sm text-slate-600">We typically respond within 24 hours (Monday-Friday)</p>
            </div>
          </section>

          {/* Effective Date */}
          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-slate-600">
              <strong>Effective Date:</strong> January 4, 2026<br/>
              <strong>Last Updated:</strong> January 4, 2026<br/>
              <strong>Version:</strong> 1.0 (Early Bird Launch)
            </p>
            <p className="text-sm text-slate-600 mt-4">
              By subscribing to Seasoners, you acknowledge that you have read, understood, and agree to these Subscription Terms & Conditions.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
