export function generateListingStructuredData(listing) {
  if (!listing) return null;

  const baseData = {
    "@context": "https://schema.org",
    "@type": listing.type === 'JOB' ? "JobPosting" : "RentalOffer",
    name: listing.title,
    description: listing.description,
    datePosted: listing.createdAt,
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
  };

  if (listing.type === 'JOB') {
    return {
      ...baseData,
      hiringOrganization: {
        "@type": "Organization",
        name: listing.user?.name || "Anonymous Employer",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: listing.city || listing.location,
          addressCountry: "AT" // Default to Austria
        }
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "EUR",
        value: {
          "@type": "QuantitativeValue",
          value: listing.price,
          unitText: "MONTH"
        }
      },
      employmentType: "SEASONAL"
    };
  } else {
    return {
      ...baseData,
      "@type": "Accommodation",
      name: listing.title,
      description: listing.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: listing.city || listing.location,
        addressCountry: "AT"
      },
      priceRange: `€${listing.price}/month`,
      image: listing.photos && listing.photos.length > 0 ? listing.photos[0] : null,
      offers: {
        "@type": "Offer",
        price: listing.price,
        priceCurrency: "EUR"
      }
    };
  }
}

export function generateBreadcrumbStructuredData(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Seasoners",
    url: "https://www.seasoners.eu",
    logo: "https://www.seasoners.eu/seasoner-mountain-logo.png",
    description: "Find seasonal jobs and accommodation worldwide. Connect with employers and trusted hosts for winter and summer work opportunities.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "hello@seasoners.eu"
    },
    sameAs: [
      // Add social media links when available
    ]
  };
}
