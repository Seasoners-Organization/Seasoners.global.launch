import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />);

    // Check for logo and brand name
    expect(screen.getByAltText('Seasoners Logo')).toBeInTheDocument();
    expect(screen.getByText('Seasoners')).toBeInTheDocument();

    // Current navbar shows these items (lowercase labels are intentional)
    const links = ['stays', '🏠 Flatshares', 'jobs', 'destinations', 'agreement', 'about'];
    links.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('has correct link destinations', () => {
    render(<Navbar />);

    const linkMappings = {
      'stays': '/stays',
      '🏠 Flatshares': '/flatshares',
      'jobs': '/jobs',
      'agreement': '/agreement',
      'about': '/about'
    };

    Object.entries(linkMappings).forEach(([text, href]) => {
      const link = screen.getByText(text);
      expect(link.closest('a')).toHaveAttribute('href', href);
    });
  });
});