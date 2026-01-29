"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import Modal from '@/components/Modal';
import { put } from '@/lib/api';
import Toast, { showToast } from '@/components/Toast';

// Main ArticleHeader component
export default function ArticleHeader({ articleData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(articleData?.title || '');
  const [editSubtitle, setEditSubtitle] = useState(articleData?.subtitle || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePath, setImagePath] = useState(articleData?.featuredImage || articleData?.heroImage || '');
  const [displayTitle, setDisplayTitle] = useState(articleData?.title || '');
  const [displaySubtitle, setDisplaySubtitle] = useState(articleData?.subtitle || '');
  const [displayHeroImage, setDisplayHeroImage] = useState(articleData?.heroImage || articleData?.featuredImage || '');
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole && hasRole('admin');
  // Avoid showing duplicate text: only display excerpt when it's different
  // from the subtitle and the first section's content.
  const firstSectionContent = articleData?.sections && articleData.sections.length > 0
    ? String(articleData.sections[0].content || "").trim()
    : "";
  const excerptText = articleData?.excerpt ? String(articleData.excerpt).trim() : "";
  const subtitleText = articleData?.subtitle ? String(articleData.subtitle).trim() : "";
  const showExcerpt = excerptText && (
    excerptText.toLowerCase() !== subtitleText.toLowerCase()
  ) && (
      excerptText.toLowerCase() !== firstSectionContent.toLowerCase()
    );
  // Date formatter: show only day, month and year (e.g. "10 December 2025")
  const formatDate = (d) => {
    if (!d) return "";
    try {
      const dateObj = (d instanceof Date) ? d : new Date(d);
      if (Number.isNaN(dateObj.getTime())) return String(d);
      return dateObj.toLocaleDateString(locale || undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return String(d);
    }
  };
  return (
    <>
      {/* Breadcrumb + admin edit button (edit aligned to right) */}
      <div className="flex items-center justify-between gap-2 px-2 pb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-accent"
          >
            {t("Blog.Home")}
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          <Link
            href="/blog"
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-accent"
          >
            {t("Blog.Blog")}
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
          <span className="text-text-light dark:text-text-dark text-sm font-medium truncate max-w-xs sm:max-w-none">
            {displayTitle}
          </span>
        </div>

        {/* place Edit button to the right of breadcrumb */}
        {isAdmin && (
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditTitle(articleData?.title || '');
                setEditSubtitle(articleData?.subtitle || '');
                setIsModalOpen(true);
              }}
              className="inline-block px-3 py-1 text-lg rounded-md bg-accent text-white hover:bg-accent/90"
              aria-label="Edit article"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Hero Image (only render when a valid non-empty src exists) */}
      {displayHeroImage && String(displayHeroImage).trim() !== "" && (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-4">
          <Image
            src={displayHeroImage}
            alt={displayTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      )}

      {/* Article Header */}
      <article className="max-w-7xl mx-auto w-full">
        <h1 className="text-text-light dark:text-text-dark font-display tracking-tight text-2xl md:text-4xl  font-bold  pb-2">
          {displayTitle}
        </h1>
     
        <h2 className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-body leading-relaxed text-left pb-2">
          {displaySubtitle}
        </h2>

        {/* Excerpt (only show when it isn't a duplicate of subtitle/first section) */}
        {showExcerpt && (
          <p className="text-text-muted-light dark:text-text-muted-dark text-base mb-3">{excerptText}</p>
        )}

        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pb-4 border-b ">
          {t("Blog.By")} {articleData.author || t("Blog.UnknownAuthor")} | {t("Blog.Published")} {formatDate(articleData.publishedDate)}{articleData.readTime ? ` | ${articleData.readTime}` : ''}
        </p>

        {/* Tags and timestamps */}
        <div className="flex flex-wrap items-center gap-2 pt-3 pb-4 border-b">
          {Array.isArray(articleData.tags) && articleData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {articleData.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 text-base rounded-md bg-black text-white">{tag}</span>
              ))}
            </div>
          )}

          {articleData.createdAt && (
            <small className=" text-base ml-2">{t("Blog.Created")} {formatDate(articleData.createdAt)}</small>
          )}
          {articleData.updatedAt && (
            <small className=" text-base ml-2">{t("Blog.Updated")} {formatDate(articleData.updatedAt)}</small>
          )}
        </div>

        {/* Article Sections mapped dynamically */}
        <div className="prose prose-lg dark:prose-invert max-w-none font-body text-text-light dark:text-text-dark pt-2 space-y-3">
          {articleData.sections.map((section, idx) => (
            <section key={idx}>
              <h3 className="font-display font-bold text-2xl mt-2 mb-2">
                {section.heading}
              </h3>
              <p>{section.content}</p>

              {/* Optional Blockquote */}
              {section.blockquote && (
                <blockquote className="border-l-4 border-accent bg-white/50 dark:bg-subtle-dark/50 p-4 rounded-r-lg my-6">
                  <p className="italic text-gray-700 dark:text-gray-300">
                    {section.blockquote}
                  </p>
                </blockquote>
              )}

              {/* Optional Image */}
              {section.image && String(section.image).trim() !== "" && (
                <figure className="w-full">
                  {/* responsive heights: small screens shorter, large screens ~300px */}
                  <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-[700px] rounded-lg overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.heading}
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {section.heading}
                  </figcaption>
                </figure>
              )}

              {/* Optional List */}
              {section.list && (
                <ul className="list-disc pl-5 space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Social Share */}
        <div className="py-4 mt-10 border-t border-b border-subtle-light dark:border-subtle-dark">
          <h4 className="text-center text-lg font-bold mb-4 font-display">
            {t("Blog.ShareThisArticle")}
          </h4>
          <div className="flex justify-center items-center gap-4">
            {["share", "link", "mail"].map((icon, i) => (
              <a
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-subtle-light dark:bg-subtle-dark hover:bg-accent hover:text-white transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-lg">
                  {icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* Edit Article Modal (Admin only) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Edit Article'}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const formData = new FormData();
                  formData.append('title', (editTitle || '').trim());
                  formData.append('excerpt', (editSubtitle || '').trim());

                  if (selectedFile instanceof File) {
                    formData.append('featuredImage', selectedFile);
                  } else if (imagePath) {
                    formData.append('featuredImage', imagePath);
                  }

                  const id = articleData?.id || articleData?._id || null;
                  if (!id) {
                    showToast('Article id not found. Cannot update.', 'error');
                    setIsModalOpen(false);
                    return;
                  }

                  const res = await put(`/blog/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });

                  if (res && res.success) {
                    showToast(res.message || 'Article updated', 'success');
                    // Optimistically update displayed values so UI reflects changes immediately
                    setDisplayTitle(editTitle || displayTitle);
                    setDisplaySubtitle(editSubtitle || displaySubtitle);
                    if (selectedFile instanceof File) {
                      try {
                        const objectUrl = URL.createObjectURL(selectedFile);
                        setDisplayHeroImage(objectUrl);
                      } catch (e) {
                        // ignore
                        setDisplayHeroImage(imagePath || displayHeroImage);
                      }
                    } else if (imagePath) {
                      setDisplayHeroImage(imagePath);
                    }
                  } else {
                    showToast(res?.message || 'Failed to update article', 'error');
                  }
                } catch (err) {
                  console.error('Error updating article:', err);
                  const msg = err?.message || err?.data?.message || 'Update failed';
                  showToast(msg, 'error');
                } finally {
                  setIsModalOpen(false);
                }
              }}
              className="px-4 py-2 rounded-md bg-accent text-white"
            >
              Save
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Title</span>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Subtitle</span>
            <input
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium">Featured Image (file)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Or image path (URL or server path)</span>
              <input
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                placeholder="/uploads/images/featured.jpg or https://..."
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </label>
          </div>
        </div>
      </Modal>
      <Toast />
    </>
  );
}
