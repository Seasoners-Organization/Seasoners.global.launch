"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from './LanguageProvider';
import { ZONES } from '../data/zones';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [userDetails, setUserDetails] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const destinationsRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/me', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch');
          }
          return res.json();
        })
        .then(data => {
          if (data.user) {
            setUserDetails(data.user);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user details:', err);
          // Don't show error to user, just use session data
        });
    }
  }, [session]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsSupportOpen(false);
      }
      if (destinationsRef.current && !destinationsRef.current.contains(event.target)) {
        setIsDestinationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Logo - Far left */}
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/seasoner-mountain-logo.png"
            alt="Seasoners Logo"
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
          />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-700 to-sky-900 bg-clip-text text-transparent tracking-tight">Seasoners</span>
        </a>

        {/* Profile Dropdown - Next to logo */}
        {session && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {userDetails?.profilePicture ? (
                <img 
                  src={userDetails.profilePicture} 
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white font-semibold text-sm">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {userDetails && (
                <div className="flex items-center gap-1 ml-1">
                  {userDetails.emailVerified && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-100 text-green-700">{t('emailVerifiedBadge')}</span>
                  )}
                  {userDetails.phoneVerified && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-100 text-green-700">{t('phoneVerifiedBadge')}</span>
                  )}
                </div>
              )}
              <svg
                className={`w-4 h-4 text-slate-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <span>👤</span>
                    <span>{t('profile')}</span>
                    {session.user.identityVerified === 'PENDING' && (
                      <span className="ml-auto h-2 w-2 bg-amber-500 rounded-full" />
                    )}
                  </a>

                  <a
                    href="/agreements"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <span>📄</span>
                    <span>{t('agreements')}</span>
                  </a>

                  <a
                    href="/subscribe"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {userDetails && (
                      <>
                        {userDetails.isEarlyBird && userDetails.waitlistStatus === 'active' ? (
                          <span>{t('foundingMember')}</span>
                        ) : userDetails.subscriptionTier === 'FREE' || userDetails.subscriptionStatus !== 'ACTIVE' ? (
                          <span>{t('upgrade')}</span>
                        ) : userDetails.subscriptionTier === 'LISTER' ? (
                          <span>{t('lister')}</span>
                        ) : (
                          <span>{t('searcher')}</span>
                        )}
                      </>
                    )}
                  </a>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <span>🚪</span>
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main navigation - Centered */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 mx-auto">
          {session && (
            <a href="/list" className="hover:text-sky-700 relative group">
              {t('list')}
              {(!session.user.emailVerified || !session.user.phoneVerified) && (
                <span className="absolute -top-1 -right-2 h-2 w-2 bg-amber-500 rounded-full group-hover:bg-amber-600" />
              )}
            </a>
          )}
          <a href="/stays" className="hover:text-sky-700">{t('stays')}</a>
          <a href="/flatshares" className="hover:text-sky-700">{t('flatshares') || 'Flatshares'}</a>
          <a href="/jobs" className="hover:text-sky-700">{t('jobs')}</a>
          {/* Destinations dropdown */}
          <div className="relative" ref={destinationsRef}>
            <button 
              onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
              className="hover:text-sky-700 flex items-center gap-2"
            >
              {t('destinations')}
              <svg className={`w-4 h-4 text-slate-600 transition-transform ${isDestinationsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDestinationsOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 text-xs text-slate-500">❄️ {t('seasonWinter')}</div>
                {ZONES.filter(z => z.season === 'winter').map(z => (
                  <a key={z.slug} href={`/zones/${z.slug}`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">{z.title}</a>
                ))}
                <div className="px-4 pt-2 text-xs text-slate-500">☀️ {t('seasonSummer')}</div>
                {ZONES.filter(z => z.season === 'summer').map(z => (
                  <a key={z.slug} href={`/zones/${z.slug}`} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">{z.title}</a>
                ))}
              </div>
            )}
          </div>
          <a href="/agreement" className="hover:text-sky-700">{t('agreement')}</a>
          {/* Support Dropdown (click-controlled for better usability) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSupportOpen(prev => !prev)}
              className="hover:text-sky-700 flex items-center gap-2 focus:outline-none"
            >
              {t('support') || 'Support'}
              <svg className={`w-4 h-4 text-slate-600 transition-transform ${isSupportOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSupportOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <a href="/faq" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setIsSupportOpen(false)}>{t('faq')}</a>
                <a href="/help" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setIsSupportOpen(false)}>{t('help')}</a>
                <a href="/community" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setIsSupportOpen(false)}>💬 {t('community')}</a>
              </div>
            )}
          </div>
          <a href="/about" className="hover:text-sky-700">{t('about')}</a>
        </nav>

        {/* Right side - Auth or Language (desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {!session && (
            <>
              <button
                onClick={() => signIn()}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                {t('signIn')}
              </button>
              <a
                href="/auth/register"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white transition"
              >
                {t('register')}
              </a>
            </>
          )}
          <LanguageToggle />
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden ml-auto p-2 rounded-md text-slate-700 hover:bg-slate-100"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile menu panel */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2 text-slate-800">
            {session && (
              <a href="/list" className="py-2" onClick={() => setIsMobileOpen(false)}>
                {t('list')}
              </a>
            )}
            <a href="/stays" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('stays')}</a>
            <a href="/flatshares" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('flatshares') || 'Flatshares'}</a>
            <a href="/jobs" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('jobs')}</a>
            <div className="py-1.5">
              <details>
                <summary className="cursor-pointer select-none flex items-center gap-2">
                  {t('destinations')}
                </summary>
                <div className="mt-1 pl-3">
                  <div className="text-xs text-slate-500 mb-1">{t('seasonWinter')}</div>
                  {ZONES.filter(z => z.season === 'winter').map(z => (
                    <a key={z.slug} href={`/zones/${z.slug}`} className="block py-1.5" onClick={() => setIsMobileOpen(false)}>{z.title}</a>
                  ))}
                  <div className="text-xs text-slate-500 mt-2 mb-1">{t('seasonSummer')}</div>
                  {ZONES.filter(z => z.season === 'summer').map(z => (
                    <a key={z.slug} href={`/zones/${z.slug}`} className="block py-1.5" onClick={() => setIsMobileOpen(false)}>{z.title}</a>
                  ))}
                </div>
              </details>
            </div>
            <a href="/agreement" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('agreement')}</a>
            {/* Support Dropdown (Mobile) */}
            <details>
              <summary className="py-2 cursor-pointer select-none flex items-center gap-2">{t('support') || 'Support'}</summary>
              <div className="pl-4 flex flex-col">
                <a href="/faq" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('faq')}</a>
                <a href="/help" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('help')}</a>
                <a href="/community" className="py-2" onClick={() => setIsMobileOpen(false)}>💬 {t('community')}</a>
              </div>
            </details>
            <a href="/about" className="py-2" onClick={() => setIsMobileOpen(false)}>{t('about')}</a>
            <div className="h-px bg-slate-200 my-1" />
            {!session ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsMobileOpen(false); signIn(); }}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition w-full"
                >
                  {t('signIn')}
                </button>
                <a
                  href="/auth/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white transition w-full text-center"
                >
                  {t('register')}
                </a>
              </div>
            ) : (
              <button
                onClick={() => { setIsMobileOpen(false); signOut(); }}
                className="px-3 py-2 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition w-full text-left"
              >
                {t('signOut')}
              </button>
            )}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-600">{t('languageLabel')}</span>
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
