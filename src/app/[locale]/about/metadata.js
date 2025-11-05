import { getTranslation } from '@/i18n';

/**
 * Generate SEO metadata for About page
 * Supports both English and French locales
 */
export async function generateMetadata({ params }) {
  const locale = params?.locale || 'en';
  const translations = getTranslation(locale);
  const aboutMeta = translations?.about?.meta || {};

  const title = aboutMeta.title || 'About Us - Q Homes';
  const description =
    aboutMeta.description || 'Learn about Q Homes mission and team';

  return {
    title,
    description,
    keywords: [
      'Q Homes',
      "Côte d'Ivoire real estate",
      'about us',
      'mission',
      'vision',
      'team',
      'verified properties',
      'escrow protection',
      'concierge service',
      'real estate Africa',
      'property investment',
    ],
    authors: [{ name: 'Q Homes' }],
    creator: 'Q Homes',
    publisher: 'Q Homes',
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      siteName: 'Q Homes',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUsrsFcXI85V3QiOO5Yd_WVl6mXNXVgBBRs7kUHtDPSeHrJeGvQvF0HtLMSNR70T88p9YqCpj5mZqKKKtu8YuWbqt0SGFpGFcKnZmLVUrdC2A0WtgPFJ_W2IE9DnRLXzZaul96OruZDn2l6aDS1fsx8t-aNs9fTWbzPahniARx9A6xOBgwMtfbZuhCTeNHYKaKo64DVVnzDq6dV2h2wpm8_KfZRzrdPwJetDUpibx5by9HDVnHe8-B5NY15zq9yF9A2kiz6qvZlS4',
          width: 1200,
          height: 630,
          alt: 'Q Homes - About Us',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUsrsFcXI85V3QiOO5Yd_WVl6mXNXVgBBRs7kUHtDPSeHrJeGvQvF0HtLMSNR70T88p9YqCpj5mZqKKKtu8YuWbqt0SGFpGFcKnZmLVUrdC2A0WtgPFJ_W2IE9DnRLXzZaul96OruZDn2l6aDS1fsx8t-aNs9fTWbzPahniARx9A6xOBgwMtfbZuhCTeNHYKaKo64DVVnzDq6dV2h2wpm8_KfZRzrdPwJetDUpibx5by9HDVnHe8-B5NY15zq9yF9A2kiz6qvZlS4',
      ],
    },
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        fr: '/fr/about',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-site-verification-code', // TODO: Replace with actual code
    },
  };
}
