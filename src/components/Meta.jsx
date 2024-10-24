import { Helmet } from "react-helmet-async";

function Meta({ title, description, keywords, canonicalUrl }) {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="LazzyShop" />
      <meta charSet="UTF-8" />

      {/* Open Graph Meta Tags (for social sharing) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="LazzyShop" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@LazzyShop" />
      <meta name="twitter:creator" content="@LazzyShop" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Meta Tag */}
      <meta name="robots" content="index, follow" />

      {/* Additional SEO Enhancements */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
}

export default Meta;
