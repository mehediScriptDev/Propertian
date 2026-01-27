// "use client";

// import React, { useEffect, useState } from 'react';
// import { CheckCircle, Clock, XCircle, Eye, Trash2 } from 'lucide-react';
// import Pagination from '@/components/dashboard/Pagination';


// function formatDate(v) {
//   if (!v) return '—';
//   const d = new Date(v);
//   if (isNaN(d)) return '—';
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// const getStatusBadge = (status) => {
//   const s = String(status || 'PENDING').toUpperCase();
//   const map = {
//     APPROVED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
//     PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
//     REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
//   };
//   const badge = map[s] || map.PENDING;
//   const Icon = badge.icon;
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
//       <Icon className='h-3.5 w-3.5' />
//       {badge.label}
//     </span>
//   );
// };

// function Avatar({ person, size = 40 }) {
//   const [errored, setErrored] = useState(false);
//   const name = person?.partnerName || person?.fullName || person?.name || `${person?.firstName || ''} ${person?.lastName || ''}`.trim();
//   const imageUrl = person?.partnerImage || person?.avatar || person?.image || person?.profileImage || person?.picture || person?.photo || person?.documentPreview || '';
//   const initials = name ? name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() : '—';
//   const sizeClass = size === 40 ? 'h-10 w-10' : 'h-8 w-8';

//   return (
//     <div className={`relative flex-shrink-0 ${sizeClass} rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600`}>
//       {imageUrl && !errored ? (
//         <img
//           src={imageUrl}
//           alt={name || 'avatar'}
//           className="object-cover h-full w-full"
//           onError={() => setErrored(true)}
//         />
//       ) : (
//         <span>{initials}</span>
//       )}
//     </div>
//   );
// }

// export default function VerificationRequestsPanel({
//   partners,
//   loading,

//   onStatusChange,

//   paginationTranslations,
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
// }) {
//   useEffect(() => {
//     console.log('VerificationRequestsPanel partners:', partners);
//   }, [partners]);
//   const [docModalOpen, setDocModalOpen] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [selectedVerification, setSelectedVerification] = useState(null);

//   const docTypeFieldMap = {
//     OWNERSHIP_PROOF: ['title', 'address', 'city', 'state', 'country'],
//     ID_PROOF: ['firstName', 'lastName', 'email', 'phone'],
//   };


//   const closeDocumentModal = () => {
//     setDocModalOpen(false);
//     setSelectedDoc(null);
//     setSelectedVerification(null);
//   };
//   return (
//     <div className='rounded-lg bg-white shadow-sm overflow-hidden'>


//       {/* Loading Overlay */}
//       {loading && (
//         <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
//           <div className="flex flex-col items-center gap-3">
//             <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
//             <p className="text-sm font-medium text-gray-700">Loading requests...</p>
//           </div>
//         </div>
//       )}

//       {/* Desktop Table */}
//       <div className='hidden lg:block overflow-x-auto'>
//         <table className='w-full min-w-[900px]'>
//           <thead className='bg-gray-100 text-gray-900'>
//             <tr>
//               <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Property Title</th>
//               <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Partner Name</th>
//               <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Date Submitted</th>
//               <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Documents</th>
//               <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Status</th>
//               <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Actions</th>
//             </tr>
//           </thead>
//           <tbody className='divide-y divide-gray-200 bg-white'>
//             {partners.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className='px-6 py-8 text-center text-sm text-gray-500'>
//                   No verification requests found.
//                 </td>
//               </tr>
//             ) : (
//               partners.map((p, idx) => (
//                 <tr key={p.id || idx} className='hover:bg-gray-50 transition-colors'>
//                   <td className='px-6 py-4'>
//                     <div className='flex items-center gap-3'>
//                       <div className='h-12 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0'>
//                         {p.property?.images?.[0] ? (
//                           <img src={p.property.images[0]} alt={p.property?.title || 'property'} className='h-full w-full object-cover' />
//                         ) : (
//                           <div className='h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-500'>No image</div>
//                         )}
//                       </div>
//                       <div>
//                         <div className='text-sm font-medium text-gray-900'>{p.property?.title || '—'}</div>
//                         <div className='text-xs text-gray-500'>{(p.property?.address || '') + (p.property?.city ? ', ' + p.property.city : '')}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className='px-6 py-4'>
//                     <div className='flex items-center gap-3'>
//                       <Avatar person={p.requester} />
//                       <div className='text-sm text-gray-700'>{(p.requester?.firstName || '') + ' ' + (p.requester?.lastName || '')}</div>
//                     </div>
//                   </td>
//                   <td className='px-6 py-4'>
//                     <div className='text-sm text-gray-700'>{formatDate(p.createdAt)}</div>
//                   </td>
//                   <td className='px-6 py-4'>
//                     <button
//                       type="button"

//                       className='text-sm text-primary underline'
//                     >
//                       View Document
//                     </button>
//                   </td>
//                   <td className='px-6 py-4'>
//                     {getStatusBadge(p.status)}
//                   </td>
//                   <td className='pl-2 py-4'>
//                     <select
//                       value={p.status || 'PENDING'}
//                       onChange={(e) => onStatusChange && onStatusChange(p.id, e.target.value)}
//                       className={`px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
//                         ${p.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
//                         ${p.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
//                         ${p.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
//                         ${p.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
//                     >
//                       <option value="PENDING">Pending</option>
//                       <option value="UNDER_REVIEW">Under Review</option>
//                       <option value="APPROVED">Approved</option>
//                       <option value="REJECTED">Rejected</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className='lg:hidden divide-y divide-gray-200'>
//         {partners.length === 0 ? (
//           <div className='p-4 text-center text-sm text-gray-500'>No verification requests found.</div>
//         ) : (
//           partners.map((p, idx) => (
//             <div key={p.id || p._id || p.partnerId || p.documentId || idx} className='p-4 hover:bg-gray-50 transition-colors'>
//               <div className='flex items-start justify-between mb-3'>
//                 <div className='flex items-center gap-3'>
//                   <Avatar partner={p} />
//                   <div>
//                     <h3 className='font-medium text-gray-900'>{p.propertyTitle || p.title || '—'}</h3>
//                     <div className='text-sm text-gray-700'>{p.partnerName || p.fullName || '—'}</div>
//                   </div>
//                 </div>
//                 <div className='text-sm text-gray-500'>{formatDate(p.submittedAt || p.createdAt)}</div>
//               </div>

//               <div className='space-y-3 mb-3'>
//                 <div>
//                   <button
//                     type="button"

//                     className='text-sm text-primary '
//                   >
//                     View Document
//                   </button>
//                 </div>
//                 <div className='flex items-center justify-between'>
//                   <div>{getStatusBadge(p.status)}</div>
//                   <div>
//                     <select
//                       value={p.status || 'PENDING'}
//                       onChange={(e) => onStatusChange && onStatusChange(p.id || p._id, e.target.value)}
//                       className={`px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
//                         ${p.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
//                         ${p.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
//                         ${p.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
//                         ${p.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
//                     >
//                       <option value="PENDING">Pending</option>
//                       <option value="UNDER_REVIEW">Under Review</option>
//                       <option value="APPROVED">Approved</option>
//                       <option value="REJECTED">Rejected</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Safe pagination values to avoid NaN when totalItems is undefined */}
//       {
//         (() => {
//           const safeTotalItems = Number(totalItems) || partners.length || 0;
//           const safeItemsPerPage = Number(itemsPerPage) || 10;
//           const safeTotalPages = Math.max(1, Number(totalPages) || Math.ceil(safeTotalItems / safeItemsPerPage) || 1);

//           return (
//             <Pagination
//               currentPage={Math.max(1, Number(currentPage) || 1)}
//               totalPages={safeTotalPages}
//               totalItems={safeTotalItems}
//               itemsPerPage={safeItemsPerPage}
//               onPageChange={onPageChange}
//               translations={paginationTranslations}
//             />
//           );
//         })()
//       }

//     </div>
//   );
// }






"use client";

import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  X,
  FileText,
  ExternalLink,
  MapPin,
  User,
  Calendar
} from 'lucide-react';
import Pagination from '@/components/dashboard/Pagination';
import { put } from '@/lib/api';
import { showToast } from '@/components/Toast';

// --- Helper Functions ---
function formatDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  if (isNaN(d)) return '—';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const getStatusBadge = (status) => {
  const s = String(status || 'PENDING').toUpperCase();
  const map = {
    APPROVED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
    UNDER_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Eye, label: 'Reviewing' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
  };
  const badge = map[s] || map.PENDING;
  const Icon = badge.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      <Icon className='h-3.5 w-3.5' />
      {badge.label}
    </span>
  );
};

function Avatar({ person, size = 40 }) {
  const [errored, setErrored] = useState(false);
  const name = person?.partnerName || person?.fullName || person?.name || `${person?.firstName || ''} ${person?.lastName || ''}`.trim();
  const imageUrl = person?.partnerImage || person?.avatar || person?.image || person?.profileImage || person?.documentPreview || '';
  const initials = name ? name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() : '—';
  const sizeClass = size === 40 ? 'h-10 w-10' : 'h-8 w-8';

  return (
    <div className={`relative flex-shrink-0 ${sizeClass} rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600`}>
      {imageUrl && !errored ? (
        <img
          src={imageUrl}
          alt={name || 'avatar'}
          className="object-cover h-full w-full"
          onError={() => setErrored(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default function VerificationRequestsPanel({
  partners = [],
  loading,
  onStatusChange,
  paginationTranslations,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);

  // keep a local copy so we can optimistically update UI when status changes
  const [localPartners, setLocalPartners] = useState(partners || []);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  useEffect(() => {
    setLocalPartners(partners || []);
  }, [partners]);

  const handleStatusChange = async (id, value) => {
    // optimistic UI: mark as updating
    setUpdatingIds(prev => new Set(prev).add(id));

    // update local copy immediately for snappy UX
    setLocalPartners(prev => prev.map(p => (p.id === id ? { ...p, status: value } : p)));

    try {
      const res = await put(`/verifications/admin/${id}/status`, { status: value });
      // API may return { success, message, data }
      const updated = res?.data || res;

      // merge returned fields into local partner entry when available
      if (updated) {
        setLocalPartners(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
      }

      // inform parent if needed
      if (onStatusChange) onStatusChange(id, value, updated);

      const successMsg = res?.message || updated?.message || 'Status updated';
      showToast(successMsg, 'success');
    } catch (err) {

      console.error('Failed to update verification status', err);

      setLocalPartners(partners || []);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update status. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setUpdatingIds(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  const openDocumentModal = (verification) => {
    setSelectedVerification(verification);
    setDocModalOpen(true);
  };

  const closeDocumentModal = () => {
    setDocModalOpen(false);
    setSelectedVerification(null);
  };

  return (
    <div className='rounded-lg bg-white shadow-sm overflow-hidden relative'>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium text-gray-700">Loading requests...</p>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Property Title</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Partner Name</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Date Submitted</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Documents</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {localPartners.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-12 text-center text-sm text-gray-500 font-medium'>
                  No verification requests found.
                </td>
              </tr>
            ) : (
              localPartners.map((p, idx) => (
                <tr key={p.id || idx} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-12 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0'>
                        {p.property?.images?.[0] ? (
                          <img src={p.property.images[0]} alt="property" className='h-full w-full object-cover' />
                        ) : (
                          <div className='h-full w-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500'>No image</div>
                        )}
                      </div>
                      <div>
                        <div className='text-sm font-semibold text-gray-900'>{p.property?.title || '—'}</div>
                        <div className='text-xs text-gray-500 truncate max-w-[150px]'>{p.property?.city || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar person={p.requester} />
                      <div className='text-sm text-gray-700'>
                        {p.requester?.firstName} {p.requester?.lastName}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600'>
                    {formatDate(p.createdAt)}
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => openDocumentModal(p)}
                      className='text-sm text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1 transition-all'
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    {getStatusBadge(p.status)}
                  </td>
                  <td className='px-6 py-4'>
                    <select
                      value={p.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
                        ${p.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        ${p.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${p.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${p.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Reviewing</option>
                      <option value="APPROVED">Approve</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className='lg:hidden divide-y divide-gray-200'>
        {localPartners.map((p, idx) => (
          <div key={p.id || idx} className='p-4 hover:bg-gray-50'>
            <div className='flex justify-between items-start mb-3'>
              <div className='flex gap-3'>
                <Avatar person={p.requester} size={40} />
                <div>
                  <h3 className='font-bold text-gray-900'>{p.property?.title || '—'}</h3>
                  <p className='text-sm text-gray-600'>{p.requester?.firstName} {p.requester?.lastName}</p>
                </div>
              </div>
              {getStatusBadge(p.status)}
            </div>
            <div className='flex items-center justify-between mt-4'>
              <button
                onClick={() => openDocumentModal(p)}
                className='text-sm font-bold text-primary flex items-center gap-1'
              >
                <Eye className='w-4 h-4' /> View Documents
              </button>
              <select
                value={p.status || 'PENDING'}
                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Reviewing</option>
                <option value="APPROVED">Approve</option>
                <option value="REJECTED">Reject</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL --- */}
      {docModalOpen && selectedVerification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Request Verification</h2>
                <p className='text-xs text-gray-500'>ID: {selectedVerification.id}</p>
              </div>
              <button onClick={closeDocumentModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Property Information
                  </span>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-bold text-gray-900">{selectedVerification.property?.title}</p>
                    <p className="text-sm text-gray-600">{selectedVerification.property?.address}, {selectedVerification.property?.city}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" /> Applicant
                  </span>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-bold text-gray-900">
                      {selectedVerification.requester?.firstName} {selectedVerification.requester?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedVerification.requester?.email || 'No email'}</p>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                  <FileText className="w-4 h-4 text-primary" /> Submitted Files
                </h3>

                {selectedVerification.documents && selectedVerification.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedVerification.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-xl bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{doc.type || 'Legal Document'}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Submitted on {formatDate(selectedVerification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={doc.url || doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          View File <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No document files available for this request.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeDocumentModal}
                className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div className="mt-auto">
        {(() => {
          const safeTotalItems = Number(totalItems) || localPartners.length || 0;
          const safeItemsPerPage = Number(itemsPerPage) || 10;
          const safeTotalPages = Math.max(1, Number(totalPages) || Math.ceil(safeTotalItems / safeItemsPerPage) || 1);

          return (
            <Pagination
              currentPage={Math.max(1, Number(currentPage) || 1)}
              totalPages={safeTotalPages}
              totalItems={safeTotalItems}
              itemsPerPage={safeItemsPerPage}
              onPageChange={onPageChange}
              translations={paginationTranslations}
            />
          );
        })()}
      </div>
    </div>
  );
}