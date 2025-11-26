import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Image
                src="/seasoner-mountain-logo.png"
                alt="Seasoners Logo"
                width={40}
                height={40}
                className="h-10 w-auto opacity-85"
              />
              <span className="text-xl font-bold text-sky-900">Seasoners</span>
            </div>
            <p className="text-xs text-gray-600 italic">
              "Helping travelers and hosts connect globally."
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/stays" className="hover:text-sky-600 transition-colors">Seasonal Stays</a></li>
              <li><a href="/jobs" className="hover:text-sky-600 transition-colors">Seasonal Jobs</a></li>
              <li><a href="/flatshares" className="hover:text-sky-600 transition-colors">Flatshares</a></li>
              <li><a href="/list" className="hover:text-sky-600 transition-colors">List Your Place</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/help" className="hover:text-sky-600 transition-colors">Help Center</a></li>
              <li><a href="/docs" className="hover:text-sky-600 transition-colors">Documentation</a></li>
              <li><a href="/community" className="hover:text-sky-600 transition-colors">Community Forum</a></li>
              <li><a href="/agreement" className="hover:text-sky-600 transition-colors">Agreements</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-sky-600 transition-colors">About Us</a></li>
              <li><a href="/subscribe" className="hover:text-sky-600 transition-colors">Founding Members</a></li>
              <li><a href="mailto:hello@seasoners.eu" className="hover:text-sky-600 transition-colors">Contact</a></li>
              <li><a href="mailto:support@seasoners.eu" className="hover:text-sky-600 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Seasoners — All Rights Reserved.
          </p>
          <p className="mt-2 text-sm">
            <a href="mailto:hello@seasoners.eu" className="text-sky-700 hover:underline">
              hello@seasoners.eu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
