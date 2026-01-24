// 'use client';

// import { use, useState, useMemo, useCallback } from 'react';
// import { useTranslation } from '@/i18n';
// import { Eye, Send } from 'lucide-react';
// import BlogContentEditor from '@/components/dashboard/admin/BlogContentEditor';
// import SEOMetadata from '@/components/dashboard/admin/SEOMetadata';
// import BlogPublishSidebar from '@/components/dashboard/admin/BlogPublishSidebar';
// import FeaturedImageUpload from '@/components/dashboard/admin/FeaturedImageUpload';
// import { post } from '@/lib/api';
// import Toast, { showToast } from '@/components/Toast';
// import Modal from '@/components/Modal';

// export default function BlogEditor({ params }) {
//   const { locale } = use(params);
//   const { t } = useTranslation(locale);

//   // Form State
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [metaTitle, setMetaTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [urlSlug, setUrlSlug] = useState('');
//   const [status, setStatus] = useState('draft');
//   const [category, setCategory] = useState('');
//   const [tags, setTags] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [altText, setAltText] = useState('');
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [publishError, setPublishError] = useState(null);

//   // Memoized translations
//   const blogEditorTranslations = useMemo(
//     () => ({
//       title: t('dashboard.admin.blogEditor.title'),
//       preview: t('dashboard.admin.blogEditor.preview'),
//       publish: t('dashboard.admin.blogEditor.publish'),
//       saveDraft: t('dashboard.admin.blogEditor.saveDraft'),
//       cancel: t('dashboard.admin.blogEditor.cancel'),
//       postTitle: t('dashboard.admin.blogEditor.postTitle'),
//       postTitlePlaceholder: t(
//         'dashboard.admin.blogEditor.postTitlePlaceholder'
//       ),
//       articleContent: t('dashboard.admin.blogEditor.articleContent'),
//       editorPlaceholder: t('dashboard.admin.blogEditor.editorPlaceholder'),
//       seoMetadata: t('dashboard.admin.blogEditor.seoMetadata'),
//       metaTitle: t('dashboard.admin.blogEditor.metaTitle'),
//       metaTitlePlaceholder: t(
//         'dashboard.admin.blogEditor.metaTitlePlaceholder'
//       ),
//       metaDescription: t('dashboard.admin.blogEditor.metaDescription'),
//       metaDescriptionPlaceholder: t(
//         'dashboard.admin.blogEditor.metaDescriptionPlaceholder'
//       ),
//       urlSlug: t('dashboard.admin.blogEditor.urlSlug'),
//       urlSlugPlaceholder: t('dashboard.admin.blogEditor.urlSlugPlaceholder'),
//       regenerate: t('dashboard.admin.blogEditor.regenerate'),
//       publishSidebar: {
//         publish: t('dashboard.admin.blogEditor.publishSidebar.publish'),
//         status: t('dashboard.admin.blogEditor.publishSidebar.status'),
//         statusDraft: t('dashboard.admin.blogEditor.publishSidebar.statusDraft'),
//         statusPublished: t(
//           'dashboard.admin.blogEditor.publishSidebar.statusPublished'
//         ),
//         statusScheduled: t(
//           'dashboard.admin.blogEditor.publishSidebar.statusScheduled'
//         ),
//         author: t('dashboard.admin.blogEditor.publishSidebar.author'),
//         publicationDate: t(
//           'dashboard.admin.blogEditor.publishSidebar.publicationDate'
//         ),
//         publicationDateAuto: t(
//           'dashboard.admin.blogEditor.publishSidebar.publicationDateAuto'
//         ),
//       },
//       organization: {
//         title: t('dashboard.admin.blogEditor.organization.title'),
//         categories: t('dashboard.admin.blogEditor.organization.categories'),
//         selectCategory: t(
//           'dashboard.admin.blogEditor.organization.selectCategory'
//         ),
//         realEstateNews: t(
//           'dashboard.admin.blogEditor.organization.realEstateNews'
//         ),
//         buyingGuide: t('dashboard.admin.blogEditor.organization.buyingGuide'),
//         sellingTips: t('dashboard.admin.blogEditor.organization.sellingTips'),
//         marketTrends: t('dashboard.admin.blogEditor.organization.marketTrends'),
//         tags: t('dashboard.admin.blogEditor.organization.tags'),
//         tagsPlaceholder: t(
//           'dashboard.admin.blogEditor.organization.tagsPlaceholder'
//         ),
//       },
//       featuredImage: {
//         title: t('dashboard.admin.blogEditor.featuredImage.title'),
//         uploadText: t('dashboard.admin.blogEditor.featuredImage.uploadText'),
//         supportedFormats: t(
//           'dashboard.admin.blogEditor.featuredImage.supportedFormats'
//         ),
//         altText: t('dashboard.admin.blogEditor.featuredImage.altText'),
//         altTextPlaceholder: t(
//           'dashboard.admin.blogEditor.featuredImage.altTextPlaceholder'
//         ),
//       },
//     }),
//     [t]
//   );

//   const generateSlug = useCallback((text) => {
//     return text
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/--+/g, '-')
//       .trim();
//   }, []);

//   const handleTitleChange = useCallback(
//     (newTitle) => {
//       setTitle(newTitle);
//       if (!urlSlug) {
//         setUrlSlug(generateSlug(newTitle));
//       }
//     },
//     [urlSlug, generateSlug]
//   );

//   const handleRegenerateSlug = useCallback(() => {
//     setUrlSlug(generateSlug(title));
//   }, [title, generateSlug]);

//   const handleSaveDraft = useCallback(() => {
//     console.log('Saving draft...', {
//       title,
//       content,
//       metaTitle,
//       metaDescription,
//       urlSlug,
//       status,
//       category,
//       tags,
//       imageUrl,
//       altText,
//     });
//   }, [
//     title,
//     content,
//     metaTitle,
//     metaDescription,
//     urlSlug,
//     status,
//     category,
//     tags,
//     imageUrl,
//     altText,
//   ]);

//   const [showCancelModal, setShowCancelModal] = useState(false);

//   const handleCancel = useCallback(() => {
//     setShowCancelModal(true);
//   }, []);

//   const confirmCancel = useCallback(() => {
//     setShowCancelModal(false);
//     setTitle('');
//     setContent('');
//     setMetaTitle('');
//     setMetaDescription('');
//     setUrlSlug('');
//     setStatus('draft');
//     setCategory('');
//     setTags('');
//     setImageUrl('');
//     setAltText('');
//   }, []);

//   const closeCancelModal = useCallback(() => setShowCancelModal(false), []);

//   const handlePublish = useCallback(async () => {
//     try {
//       setIsPublishing(true);
//       setPublishError(null);

//       // Validate required fields
//       if (!title || !title.trim()) {
//         showToast('Please enter a title for your blog post.', 'error');
//         setIsPublishing(false);
//         return;
//       }

//       if (!content || !content.trim()) {
//         showToast('Please enter content for your blog post.', 'error');
//         setIsPublishing(false);
//         return;
//       }

//       // Create FormData for multipart/form-data upload
//       const formData = new FormData();
//       formData.append('title', title.trim());
//       formData.append('excerpt', metaDescription?.trim() || title.substring(0, 150));
//       formData.append('content', content.trim());
//       formData.append('author', 'Admin User'); // You may want to get this from auth context
//       formData.append('tags', tags?.trim() || '');
//       formData.append('status', 'PUBLISHED');

//       // If there's an image file, append it; otherwise skip
//       if (imageUrl instanceof File) {
//         formData.append('featuredImage', imageUrl);
//       }

//       const response = await post('/blog', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.success) {
//         const successMessage = response.message;
//         showToast(successMessage);
//         // Reset form
//         setTitle('');
//         setContent('');
//         setMetaTitle('');
//         setMetaDescription('');
//         setUrlSlug('');
//         setStatus('draft');
//         setCategory('');
//         setTags('');
//         setImageUrl('');
//         setAltText('');
//       } else {
//         throw new Error(response.message );
//       }
//     } catch (err) {
//       console.error('Error publishing blog post:', err);
//       const errorMsg = err.response?.data?.message || err.message ;
//       setPublishError(errorMsg);
//       showToast(`Failed to publish: ${errorMsg}`, 'error');
//     } finally {
//       setIsPublishing(false);
//     }
//   }, [title, content, metaDescription, tags, imageUrl]);

//   const handlePreview = useCallback(() => {
//     console.log('Opening preview...', { title, content });
//   }, [title, content]);

//   return (
//     <div className='space-y-4 md:space-y-6'>
//       {/* Header */}
//       <div className=''>
//         <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
//           <h1 className='text-4xl font-bold text-gray-900'>
//             {blogEditorTranslations.title}
//           </h1>
//           <div className='flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto'>

//             <button
//               onClick={handlePublish}
//               type='button'
//               disabled={isPublishing}
//               className="inline-flex items-center rounded-md bg-accent px-5 py-2 text-base font-medium text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Send size={16} className='sm:w-[18px] sm:h-[18px]' />
//               <span className='whitespace-nowrap'>
//                 {isPublishing ? 'Publishing...' : blogEditorTranslations.publish}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
//         {/* Left Column - Main Content (2/3) */}
//         <div className='lg:col-span-2 space-y-4 md:space-y-6'>
//           {/* Content Editor */}
//           <div className='bg-white border border-gray-200 rounded-lg p-4 sm:p-6'>
//             <BlogContentEditor
//               title={title}
//               content={content}
//               onTitleChange={handleTitleChange}
//               onContentChange={setContent}
//               translations={blogEditorTranslations}
//             />
//           </div>

//           {/* SEO Metadata */}
//           <SEOMetadata
//             metaTitle={metaTitle}
//             metaDescription={metaDescription}
//             urlSlug={urlSlug}
//             onMetaTitleChange={setMetaTitle}
//             onMetaDescriptionChange={setMetaDescription}
//             onUrlSlugChange={setUrlSlug}
//             onRegenerateSlug={handleRegenerateSlug}
//             translations={blogEditorTranslations}
//           />
//         </div>

//         {/* Right Column - Sidebar (1/3) */}
//         <div className='lg:col-span-1 space-y-4 md:space-y-6'>
//           <BlogPublishSidebar
//             status={status}
//             author='Admin User'
//             category={category}
//             tags={tags}
//             onStatusChange={setStatus}
//             onCategoryChange={setCategory}
//             onTagsChange={setTags}
//             onSaveDraft={handleSaveDraft}
//             onCancel={handleCancel}
//             translations={blogEditorTranslations}
//           />

//           <FeaturedImageUpload
//             imageUrl={imageUrl}
//             altText={altText}
//             onImageChange={setImageUrl}
//             onAltTextChange={setAltText}
//             onRemoveImage={() => setImageUrl('')}
//             translations={blogEditorTranslations}
//           />
//         </div>
//       </div>
//       <Modal
//         isOpen={showCancelModal}
//         onClose={closeCancelModal}
//         title={blogEditorTranslations.cancel}
//         footer={
//           <div className='flex items-center justify-end gap-3'>
//             <button
//               type='button'
//               onClick={closeCancelModal}
//               className='px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700'
//             >
//               {blogEditorTranslations.cancel}
//             </button>

//             <button
//               type='button'
//               onClick={confirmCancel}
//               className='px-4 py-2 bg-accent text-white rounded-md text-sm'
//             >
//               OK
//             </button>
//           </div>
//         }
//       >
//         <div className='text-sm text-gray-700'>
//           Are you sure you want to cancel? All unsaved changes will be lost.
//         </div>
//       </Modal>
//       <Toast />
//     </div>
//   );
// }









'use client';

import { use, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { Eye, Send } from 'lucide-react';
import BlogContentEditor from '@/components/dashboard/admin/BlogContentEditor';
import SEOMetadata from '@/components/dashboard/admin/SEOMetadata';
import BlogPublishSidebar from '@/components/dashboard/admin/BlogPublishSidebar';
import FeaturedImageUpload from '@/components/dashboard/admin/FeaturedImageUpload';
import { uploadFile } from '@/lib/api'; 
import Toast, { showToast } from '@/components/Toast';
import Modal from '@/components/Modal';

export default function BlogEditor({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  // Memoized translations
  const blogEditorTranslations = useMemo(
    () => ({
      title: t('dashboard.admin.blogEditor.title'),
      preview: t('dashboard.admin.blogEditor.preview'),
      publish: t('dashboard.admin.blogEditor.publish'),
      saveDraft: t('dashboard.admin.blogEditor.saveDraft'),
      cancel: t('dashboard.admin.blogEditor.cancel'),
      postTitle: t('dashboard.admin.blogEditor.postTitle'),
      postTitlePlaceholder: t('dashboard.admin.blogEditor.postTitlePlaceholder'),
      articleContent: t('dashboard.admin.blogEditor.articleContent'),
      editorPlaceholder: t('dashboard.admin.blogEditor.editorPlaceholder'),
      seoMetadata: t('dashboard.admin.blogEditor.seoMetadata'),
      metaTitle: t('dashboard.admin.blogEditor.metaTitle'),
      metaTitlePlaceholder: t('dashboard.admin.blogEditor.metaTitlePlaceholder'),
      metaDescription: t('dashboard.admin.blogEditor.metaDescription'),
      metaDescriptionPlaceholder: t('dashboard.admin.blogEditor.metaDescriptionPlaceholder'),
      urlSlug: t('dashboard.admin.blogEditor.urlSlug'),
      urlSlugPlaceholder: t('dashboard.admin.blogEditor.urlSlugPlaceholder'),
      regenerate: t('dashboard.admin.blogEditor.regenerate'),
      publishSidebar: {
        publish: t('dashboard.admin.blogEditor.publishSidebar.publish'),
        status: t('dashboard.admin.blogEditor.publishSidebar.status'),
        statusDraft: t('dashboard.admin.blogEditor.publishSidebar.statusDraft'),
        statusPublished: t('dashboard.admin.blogEditor.publishSidebar.statusPublished'),
        statusScheduled: t('dashboard.admin.blogEditor.publishSidebar.statusScheduled'),
        author: t('dashboard.admin.blogEditor.publishSidebar.author'),
        publicationDate: t('dashboard.admin.blogEditor.publishSidebar.publicationDate'),
        publicationDateAuto: t('dashboard.admin.blogEditor.publishSidebar.publicationDateAuto'),
      },
      organization: {
        title: t('dashboard.admin.blogEditor.organization.title'),
        categories: t('dashboard.admin.blogEditor.organization.categories'),
        selectCategory: t('dashboard.admin.blogEditor.organization.selectCategory'),
        realEstateNews: t('dashboard.admin.blogEditor.organization.realEstateNews'),
        buyingGuide: t('dashboard.admin.blogEditor.organization.buyingGuide'),
        sellingTips: t('dashboard.admin.blogEditor.organization.sellingTips'),
        marketTrends: t('dashboard.admin.blogEditor.organization.marketTrends'),
        tags: t('dashboard.admin.blogEditor.organization.tags'),
        tagsPlaceholder: t('dashboard.admin.blogEditor.organization.tagsPlaceholder'),
      },
      featuredImage: {
        title: t('dashboard.admin.blogEditor.featuredImage.title'),
        uploadText: t('dashboard.admin.blogEditor.featuredImage.uploadText'),
        supportedFormats: t('dashboard.admin.blogEditor.featuredImage.supportedFormats'),
        altText: t('dashboard.admin.blogEditor.featuredImage.altText'),
        altTextPlaceholder: t('dashboard.admin.blogEditor.featuredImage.altTextPlaceholder'),
      },
    }),
    [t]
  );

  const generateSlug = useCallback((text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }, []);

  const handleTitleChange = useCallback(
    (newTitle) => {
      setTitle(newTitle);
      if (!urlSlug) {
        setUrlSlug(generateSlug(newTitle));
      }
    },
    [urlSlug, generateSlug]
  );

  const handleRegenerateSlug = useCallback(() => {
    setUrlSlug(generateSlug(title));
  }, [title, generateSlug]);

  const handleSaveDraft = useCallback(async () => {
    console.log('Saving draft locally...');
  }, []);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = useCallback(() => {
    setShowCancelModal(true);
  }, []);

  const confirmCancel = useCallback(() => {
    setShowCancelModal(false);
    resetForm();
  }, []);

  const closeCancelModal = useCallback(() => setShowCancelModal(false), []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMetaTitle('');
    setMetaDescription('');
    setUrlSlug('');
    setStatus('draft');
    setCategory('');
    setTags('');
    setImageUrl('');
    setAltText('');
  };

 // --- UPDATED PUBLISH HANDLER ---
  const handlePublish = useCallback(async () => {
    try {
      setIsPublishing(true);
      setPublishError(null);

      // 1. Frontend Validation
      if (!title || !title.trim()) {
        showToast('Title is required', 'error');
        setIsPublishing(false);
        return;
      }

      if (!content || !content.trim()) {
        showToast('Content is required', 'error');
        setIsPublishing(false);
        return;
      }

      // 2. FormData Construction
      const formData = new FormData();
      formData.append('title', title.trim());
      
      const plainTextContent = content.replace(/<[^>]*>?/gm, '');
      const excerptText = metaDescription?.trim() || plainTextContent.substring(0, 150);
      formData.append('excerpt', excerptText);
      
      formData.append('content', content.trim());
      formData.append('author', 'Admin User'); 
      formData.append('tags', tags?.trim() || '');
      
      // FIX 1: Ensure status matches Postman (Use 'PUBLISHED' for testing)
      // If the UI state is 'draft', we force 'PUBLISHED' for the button action, 
      // or you can explicitly set it to the state value if you trust the dropdown.
      // For now, let's stick to what worked in Postman:
      const submitStatus = status === 'draft' ? 'PUBLISHED' : status; 
      formData.append('status', submitStatus); 

      // 3. Image Handling
      if (imageUrl instanceof File) {
        formData.append('featuredImage', imageUrl);
      } else {
        // If you are editing and there is an existing image URL, you might not need to send it again.
        // But for creating new, check if backend REQUIRES it.
        console.log("No new file selected for featuredImage");
      }

      // Debug: Log what we are sending
      console.log("--- Sending Payload ---");
      for (var pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]); 
      }

      // 4. API Request
      const response = await uploadFile('/blog', formData);
      // handlePublish ফাংশনের success ব্লকের ভিতরে
if (response && response.success) {
    console.log("✅ SERVER SAVED DATA:", response.data); // এই লাইনটি চেক করুন
    alert(`Saved Successfully! ID: ${response.data?.blog?.id}`); // পপআপে ID দেখাচ্ছে কিনা দেখুন
    showToast(response.message); 
    resetForm();
}

      // // 5. Success Handling
      // if (response && response.success) {
        
      //   showToast(response.message); 
      //   resetForm();
      // } else {
      //   throw new Error(response.message );
      // }

    } catch (err) {
      console.error('Publish Error:', err);

      let errorMsg = err.message || 'An unexpected error occurred';
      
      // FIX 2: Extract Specific Backend Validation Errors
      if (err.response && err.response.data) {
          const data = err.response.data;
          
          // Case A: Top level message
          if (data.message) {
              errorMsg = data.message;
          }

          // Case B: Validation errors object (e.g. { title: "Title is required" })
          if (data.errors) {
              // Create a list of errors to show user
              const validationErrors = Object.values(data.errors).join(', ');
              if (validationErrors) {
                  errorMsg = `${data.message}: ${validationErrors}`;
              }
          }
      }

      setPublishError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [title, content, metaDescription, tags, imageUrl, status]);
  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div className=''>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h1 className='text-4xl font-bold text-gray-900'>
            {blogEditorTranslations.title}
          </h1>
          <div className='flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto'>
            <button
              onClick={handlePublish}
              type='button'
              disabled={isPublishing}
              className="inline-flex items-center rounded-md bg-accent px-5 py-2 text-base font-medium text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
            >
              <Send size={16} className='sm:w-[18px] sm:h-[18px] mr-2' />
              <span className='whitespace-nowrap'>
                {isPublishing ? 'Publishing...' : blogEditorTranslations.publish}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
        {/* Left Column - Main Content (2/3) */}
        <div className='lg:col-span-2 space-y-4 md:space-y-6'>
          {/* Content Editor */}
          <div className='bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm'>
            <BlogContentEditor
              title={title}
              content={content}
              onTitleChange={handleTitleChange}
              onContentChange={setContent}
              translations={blogEditorTranslations}
            />
          </div>

          {/* SEO Metadata */}
          <SEOMetadata
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            urlSlug={urlSlug}
            onMetaTitleChange={setMetaTitle}
            onMetaDescriptionChange={setMetaDescription}
            onUrlSlugChange={setUrlSlug}
            onRegenerateSlug={handleRegenerateSlug}
            translations={blogEditorTranslations}
          />
        </div>

        {/* Right Column - Sidebar (1/3) */}
        <div className='lg:col-span-1 space-y-4 md:space-y-6'>
          <BlogPublishSidebar
            status={status}
            author='Admin User'
            category={category}
            tags={tags}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            onTagsChange={setTags}
            onSaveDraft={handleSaveDraft}
            onCancel={handleCancel}
            translations={blogEditorTranslations}
          />

          <FeaturedImageUpload
            imageUrl={imageUrl}
            altText={altText}
            onImageChange={setImageUrl}
            onAltTextChange={setAltText}
            onRemoveImage={() => setImageUrl('')}
            translations={blogEditorTranslations}
          />
        </div>
      </div>
      
      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        title={blogEditorTranslations.cancel}
        footer={
          <div className='flex items-center justify-end gap-3'>
            <button
              type='button'
              onClick={closeCancelModal}
              className='px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50'
            >
              {blogEditorTranslations.cancel}
            </button>

            <button
              type='button'
              onClick={confirmCancel}
              className='px-4 py-2 bg-accent text-white rounded-md text-sm hover:bg-accent/90'
            >
              OK
            </button>
          </div>
        }
      >
        <div className='text-sm text-gray-700'>
          Are you sure you want to cancel? All unsaved changes will be lost.
        </div>
      </Modal>
      
      <Toast />
    </div>
  );
}