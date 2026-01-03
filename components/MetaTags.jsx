import Head from 'next/head';

export default function MetaTags({
  title = 'Seasoners - Find Seasonal Jobs & Accommodation Worldwide',
  description = 'Connect with seasonal employers and find trusted accommodation for winter and summer jobs across Europe, Asia, and beyond. Join thousands of seasonal workers.',
  image = 'https://www.seasoners.eu/seasoner-mountain-logo.png',
  url = 'https://www.seasoners.eu',
  type = 'website'
}) {
  const fullTitle = title.includes('Seasoners') ? title : `${title} | Seasoners`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Seasoners" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Seasoners" />
    </Head>
  );
}
