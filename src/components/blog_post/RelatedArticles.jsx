"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";

export default function RelatedArticles({ relatedArticles, locale }) {
  const [list, setList] = useState(Array.isArray(relatedArticles) ? relatedArticles : []);
  useEffect(() => {
    let mounted = true;
    // if relatedArticles prop provided use it, otherwise try fetching top articles
    if (Array.isArray(relatedArticles) && relatedArticles.length > 0) {
      setList(relatedArticles);
      return () => (mounted = false);
    }

    const fetchRelated = async () => {
      try {
        const res = await get(`/blog`, { params: { page: 1, limit: 3, status: 'PUBLISHED' } });
        const items = res?.data?.blogs || res?.blogs || (Array.isArray(res) ? res : []);
        if (mounted) setList(Array.isArray(items) ? items : []);
      } catch (e) {
        if (mounted) setList([]);
      }
    };

    fetchRelated();
    return () => {
      mounted = false;
    };
  }, [relatedArticles]);
  const base = locale ? `/${locale}` : "";
  const { locale: lang } = useLanguage();

  const { t } = useTranslation(lang);

  return (
    <div className="w-full mt-8">
      <h3 className="text-3xl font-bold font-display text-center mb-8">
        {t("Blog.ReadMoreArticles")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((article) => (
          <div
            key={article.id}
            className="flex flex-col gap-3 rounded-xl bg-white/50 dark:bg-card-dark shadow-md border border-[#f6efcb] dark:border-border-dark overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full aspect-5/3 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {article.image && String(article.image).trim() !== "" ? (
                <Image
                  src={article.image}
                  alt={article.alt || article.title}
                  fill
                  className="object-cover rounded-t-xl"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
            <div className="p-4 flex flex-col grow">
              <h3 className="font-bold text-lg mb-2 text-text-light dark:text-text-dark">
                {article.title}
              </h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
                {article.date}
              </p>
              <p className="text-text-light dark:text-text-dark grow">
                {article.snippet}
              </p>
              <Link
                href={`${base}/blog/product/${article.id}?id=${article.id}`}
                className="mt-4 inline-block text-accent hover:underline"
              >
                {t("Blog.ReadMore")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
