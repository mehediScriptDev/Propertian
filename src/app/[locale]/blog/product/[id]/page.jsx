import BlogPost from "@/components/blog/BlogPost";
import { get } from "@/lib/api";

// Generate metadata server-side for better SEO and social cards
export async function generateMetadata({ params, searchParams }) {
  // params may be a Promise in some Next.js environments — await it.
  const resolvedParams = await params;
  // prefer route params, but fall back to search params if params is empty
  const id = (resolvedParams && resolvedParams.id) ?? (searchParams && searchParams.id);

  let blog = null;
  try {
    // Try endpoint for single blog first
    const single = await get(`/blog/${id}`);
    // API may return { success:true, data: { blog: {...} } } or { data: {...} }
    blog = single?.data?.blog || single?.blog || single?.data || single;
  } catch (e) {
    try {
      // fallback to list endpoint and find by id
      const list = await get(`/blog`, { params: { id } });
      const items = list?.data?.blogs || list?.blogs || (Array.isArray(list) ? list : null);
      if (Array.isArray(items)) blog = items.find((b) => String(b.id) === String(id));
    } catch (err) {
      // give up; blog remains null
      blog = null;
    }
  }

  if (!blog) {
    return {
      title: "Article not found - Blog",
      description: "The requested article was not found.",
    };
  }

  const title = blog.title;
  const description = blog.subtitle || blog.snippet || "";
  const image = blog.heroImage || blog.image;

  // Build a locale-aware canonical path (no domain so it's safe in dev)
  const localePrefix = resolvedParams && resolvedParams.locale ? `/${resolvedParams.locale}` : "";
  const canonicalPath = `${localePrefix}/blog/product/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
    // provide a canonical path so crawlers see a canonical link
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function SingleProductPage({ params, searchParams }) {
  // params may be a Promise — unwrap it before accessing properties
  const resolvedParams = await params;
  const id = (resolvedParams && resolvedParams.id) ?? (searchParams && searchParams.id);

  let blog = null;
  try {
    const single = await get(`/blog/${id}`);
    blog = single?.data?.blog || single?.blog || single?.data || single;
  } catch (e) {
    try {
      const list = await get(`/blog`, { params: { id } });
      const items = list?.data?.blogs || list?.blogs || (Array.isArray(list) ? list : null);
      if (Array.isArray(items)) blog = items.find((b) => String(b.id) === String(id));
    } catch (err) {
      blog = null;
    }
  }

  if (!blog) {
    const serverDebug = { params: resolvedParams || {}, searchParams: searchParams || {}, blogId: id };
    return (
      <div>
        <BlogPost articleData={null} relatedArticles={[]} locale={resolvedParams?.locale} serverDebug={serverDebug} />
      </div>
    );
  }

  const articleData = {
    // preserve all useful API fields so the Article UI can display them
    id: blog.id,
    slug: blog.slug || "",
    title: blog.title,
    subtitle: blog.subtitle || blog.snippet || blog.excerpt || "",
    excerpt: blog.excerpt || blog.snippet || "",
    author: blog.author || "",
    // Format dates server-side to Day Month Year using resolved locale when available
    publishedDate: (() => {
      try {
        const raw = blog.publishedAt || blog.publishedDate || blog.date || "";
        const d = raw ? new Date(raw) : null;
        if (!d || Number.isNaN(d.getTime())) return raw;
        return d.toLocaleDateString(resolvedParams?.locale || undefined, { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        return (blog.publishedAt || blog.publishedDate || blog.date || "");
      }
    })(),
    createdAt: (() => {
      try {
        const raw = blog.createdAt || "";
        const d = raw ? new Date(raw) : null;
        if (!d || Number.isNaN(d.getTime())) return raw;
        return d.toLocaleDateString(resolvedParams?.locale || undefined, { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        return (blog.createdAt || "");
      }
    })(),
    updatedAt: (() => {
      try {
        const raw = blog.updatedAt || "";
        const d = raw ? new Date(raw) : null;
        if (!d || Number.isNaN(d.getTime())) return raw;
        return d.toLocaleDateString(resolvedParams?.locale || undefined, { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        return (blog.updatedAt || "");
      }
    })(),
    readTime: blog.readTime || "",
    heroImage: blog.featuredImage || blog.heroImage || blog.image,
    featuredImage: blog.featuredImage || blog.heroImage || blog.image,
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    content: blog.content || blog.body || blog.html || null,
    sections: Array.isArray(blog.sections) && blog.sections.length > 0
      ? blog.sections
      : (
        blog.content
          ? [{ heading: blog.title, content: blog.content, image: blog.featuredImage || blog.image }]
          : [{ heading: blog.title, content: blog.snippet || blog.excerpt || "", image: blog.image }]
      ),
  };

  // JSON-LD structured data for this article (server-rendered)
  // Validate published date before calling toISOString to avoid RangeError
  let isoDatePublished;
  try {
    const d = new Date(articleData.publishedDate);
    if (!Number.isNaN(d.getTime())) isoDatePublished = d.toISOString();
  } catch (e) {
    isoDatePublished = undefined;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: articleData.title,
    description: articleData.excerpt || articleData.subtitle,
    author: articleData.author || undefined,
    image: articleData.heroImage || articleData.featuredImage || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${(resolvedParams && resolvedParams.locale) ? `/${resolvedParams.locale}` : ''}/blog/product/${blog.id}`,
    },
  };

  if (isoDatePublished) jsonLd.datePublished = isoDatePublished;
  if (Array.isArray(articleData.tags) && articleData.tags.length > 0) jsonLd.keywords = articleData.tags.join(", ");

  // related articles: try fetching nearby articles, fallback to empty
  let relatedArticles = [];
  try {
    const list = await get(`/blog`, { params: { page: 1, limit: 10, status: 'PUBLISHED' } });
    const items = list?.data?.blogs || list?.blogs || (Array.isArray(list) ? list : []);
    relatedArticles = Array.isArray(items) ? items.filter((b) => String(b.id) !== String(blog.id)).slice(0, 3) : [];
  } catch (e) {
    relatedArticles = [];
  }

  return (
    <div>
      {/* JSON-LD for crawlers / rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost articleData={articleData} relatedArticles={relatedArticles} locale={resolvedParams?.locale} />
    </div>
  );
}
