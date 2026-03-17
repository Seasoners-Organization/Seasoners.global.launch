import Image from 'next/image';

const EXPLORE_LINKS = [
  { href: '/stays', label: 'Stays' },
  { href: '/flatshares', label: 'Flatshares' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/list', label: 'List Your Place' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/agreement', label: 'The Agreement' },
  { href: '/auth/register', label: 'Join Seasoners' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-0">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/seasoner-mountain-logo.png"
                alt="Seasoners Logo"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Seasoners
              </span>
            </a>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connecting seasonal workers, travelers, and hosts around the world.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-slate-600 hover:text-blue-900 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-slate-600 hover:text-blue-900 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:info@seasoners.eu"
                  className="text-sm text-slate-600 hover:text-blue-900 transition-colors"
                >
                  info@seasoners.eu
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs text-slate-400 italic">
              "Helping travelers and hosts connect globally."
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Seasoners — All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-xs text-slate-500 hover:text-blue-900 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
