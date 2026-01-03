"use client";
import { Component } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service (add Sentry here later)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center px-6 py-16">
            <div className="max-w-2xl text-center">
              <div className="text-6xl mb-6">😕</div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                We're sorry, but something unexpected happened. Our team has been notified and we're working on a fix.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Try Again
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-800">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
