import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
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
              <span className="text-xl font-bold text-sky-900">{t('footerBrand')}</span>
            </div>
            <p className="text-xs text-gray-600 italic">
              "{t('footerBrandMotto')}"
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">{t('footerPlatformSection')}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/stays" className="hover:text-sky-600 transition-colors">{t('footerStays')}</a></li>
              <li><a href="/jobs" className="hover:text-sky-600 transition-colors">{t('footerJobs')}</a></li>
              <li><a href="/flatshares" className="hover:text-sky-600 transition-colors">{t('footerFlatshares')}</a></li>
              <li><a href="/list" className="hover:text-sky-600 transition-colors">{t('footerListPlace')}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">{t('footerResourcesSection')}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/help" className="hover:text-sky-600 transition-colors">{t('footerHelp')}</a></li>
              <li><a href="/docs" className="hover:text-sky-600 transition-colors">{t('footerDocs')}</a></li>
              <li><a href="/community" className="hover:text-sky-600 transition-colors">{t('footerCommunity')}</a></li>
              <li><a href="/agreement" className="hover:text-sky-600 transition-colors">{t('footerAgreements')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">{t('footerCompanySection')}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-sky-600 transition-colors">{t('footerAbout')}</a></li>
              <li><a href="/subscribe" className="hover:text-sky-600 transition-colors">{t('footerMembers')}</a></li>
              <li><a href="mailto:hello@seasoners.eu" className="hover:text-sky-600 transition-colors">{t('footerContact')}</a></li>
              <li><a href="mailto:support@seasoners.eu" className="hover:text-sky-600 transition-colors">{t('footerSupport')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            {t('footerCopyright').replace('{{year}}', new Date().getFullYear())}
          </p>
          <p className="mt-2 text-sm">
            <a href="mailto:hello@seasoners.eu" className="text-sky-700 hover:underline">
              {t('footerEmail')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
