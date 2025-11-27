



// "use client";
// import React from "react";
// import { MessageSquare } from "lucide-react";
// import ActionButtons from "./ActionButtons";
// import Pagination from "@/components/dashboard/Pagination";

// function TicketsTable({
//     tickets,
//     onRowClick,
//     onView,
//     onEdit,
//     onDelete,
//     getStatusIcon,
//     // pagination props
//     currentPage,
//     totalPages,
//     totalItems,
//     itemsPerPage,
//     onPageChange,
//     translations = { showing: "Showing", to: "to", of: "of", results: "results", previous: "Previous", next: "Next" },
// }) {
//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {tickets.length > 0 ? (
//                 <div className="overflow-x-auto">
//                     {/* ✅ Desktop Table */}
//                     <table className="min-w-full border-collapse hidden md:table" role="table" aria-label="Tickets table">
//                         <caption className="sr-only">List of support tickets</caption>
//                         <thead className="bg-gray-100 border-b border-gray-200">
//                             <tr>
//                                 <th scope="col" className="px-4 py-3 text-left text-base font-semibold text-gray-700">ID</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-base font-semibold text-gray-700">Subject</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-base font-semibold text-gray-700">Property</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-base font-semibold text-gray-700">Replies</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-base font-semibold text-gray-700">Created At</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {tickets.map((ticket) => (
//                                 <tr
//                                     key={ticket.id}
//                                     onClick={() => onRowClick && onRowClick(ticket)}
//                                     onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick && onRowClick(ticket); } }}
//                                     tabIndex={0}
//                                     className="hover:bg-gray-50 cursor-pointer transition border-b border-gray-100"
//                                 >
//                                     <td className="px-4 py-3 text-sm text-gray-700 font-medium">
//                                         {ticket.id}
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center gap-2">
//                                             {getStatusIcon && getStatusIcon(ticket.status)}
//                                             <span className="text-gray-900 font-medium">
//                                                 {ticket.subject}
//                                             </span>
//                                         </div>
//                                         <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
//                                             {ticket.description}
//                                         </p>
//                                     </td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">
//                                         {ticket.property_name} <br />
//                                         <span className="text-xs text-gray-400">
//                                             (ID: {ticket.property_id})
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
//                                         <MessageSquare className="w-4 h-4" />
//                                         {ticket.replies_count}
//                                     </td>
//                                     <td className="px-4 py-3 text-xs text-gray-500">
//                                         {ticket.created_at}
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <ActionButtons
//                                             onView={() => onView && onView(ticket)}
//                                             onEdit={() => onEdit && onEdit(ticket)}
//                                             onDelete={() => onDelete && onDelete(ticket.id)}
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* ✅ Mobile Card View */}
//                     <div className="block md:hidden space-y-4 p-4 bg-gray-50">
//                         {tickets.map((ticket) => (
//                             <div
//                                 key={ticket.id}
//                                 onClick={() => onRowClick && onRowClick(ticket)}
//                                 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick && onRowClick(ticket); } }}
//                                 role="button"
//                                 tabIndex={0}
//                                 className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
//                             >
//                                 <div className="flex justify-between items-start mb-2">
//                                     <div className="flex items-center gap-2">
//                                         {getStatusIcon && getStatusIcon(ticket.status)}
//                                         <h3 className="text-sm font-semibold text-gray-900">
//                                             {ticket.subject}
//                                         </h3>
//                                     </div>
//                                     <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                                         #{ticket.id}
//                                     </span>
//                                 </div>

//                                 <p className="text-xs text-gray-600 mb-2">{ticket.description}</p>

//                                 <div className="text-xs text-gray-500 space-y-1">
//                                     <p>
//                                         <span className="font-medium">Property:</span>{" "}
//                                         {ticket.property_name} (ID: {ticket.property_id})
//                                     </p>
//                                     <p className="flex items-center gap-1">
//                                         <MessageSquare className="w-3 h-3" />
//                                         {ticket.replies_count} replies
//                                     </p>
//                                     <p>
//                                         <span className="font-medium">Created:</span>{" "}
//                                         {ticket.created_at}
//                                     </p>
//                                 </div>

//                                 <div className="mt-3">
//                                     <ActionButtons
//                                         onView={() => onView && onView(ticket)}
//                                         onEdit={() => onEdit && onEdit(ticket)}
//                                         onDelete={() => onDelete && onDelete(ticket.id)}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="p-12 text-center">
//                     <p className="text-gray-500 text-lg">No tickets found</p>
//                 </div>
//             )}

//             {/* Pagination bar attached to the card */}
//             {totalItems > 0 && (
//                 <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     totalItems={totalItems}
//                     itemsPerPage={itemsPerPage}
//                     onPageChange={onPageChange}
//                     translations={translations}
//                 />
//             )}
//         </div>
//     );
// }

// export default React.memo(TicketsTable);







"use client";
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import ActionButtons from "./ActionButtons";
import Pagination from "@/components/dashboard/Pagination";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import SupportTicketViewModal from '@/components/dashboard/client/SupportTicketViewModal';

function TicketsTable({
  tickets,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  getStatusIcon,
  // pagination props
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  translations = {
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    previous: "Previous",
    next: "Next",
  },
}) {
     const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showView, setShowView] = useState(false);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setShowView(true);
  };

    const renderStatusBadge = (status) => {
      const key = String(status || '').toLowerCase();
      switch (key) {
        case 'open':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800">Open</span>
          );
        case 'in_progress':
        case 'in-progress':
        case 'inprogress':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">In Progress</span>
          );
        case 'resolved':
        case 'closed':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-800">{key === 'closed' ? 'Closed' : 'Resolved'}</span>
          );
        default:
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700">{String(status)}</span>
          );
      }
    };

    const renderPriorityBadge = (priority) => {
      const key = String(priority || '').toLowerCase();
      switch (key) {
        case 'high':
          return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">High</span>;
        case 'medium':
          return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800">Medium</span>;
        case 'low':
          return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">Low</span>;
        default:
          return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700">{String(priority)}</span>;
      }
    };
  return (
    <>
    <div className="bg-white/50 rounded-lg shadow-md overflow-hidden">
      {tickets.length > 0 ? (
        <div className="overflow-x-auto">
          {/* ✅ Desktop Table */}
          <table
            className="min-w-full border-collapse hidden md:table"
            role="table"
            aria-label="Tickets table"
          >
            <caption className="sr-only">List of support tickets</caption>
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  
                  {t("dashboard.client.supportTicket.id")}
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  {t("dashboard.client.supportTicket.subject")}
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Category
                </th>
                {/* <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  {t("dashboard.client.supportTicket.replies")}
                </th> */}
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  {t("dashboard.client.supportTicket.Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onRowClick && onRowClick(ticket)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick && onRowClick(ticket);
                    }
                  }}
                  tabIndex={0}
                  className="hover:bg-gray-50 bg-white/50 cursor-pointer transition border-b border-gray-100"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 truncate">
                    <div className="flex items-center gap-2">
                      {getStatusIcon && getStatusIcon(ticket.status)}
                      <span className="text-gray-900 font-medium">
                        {ticket.subject}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                      {ticket.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate">
                    {ticket.property_name} <br />
                    <span className="text-xs text-gray-400">
                      (ID: {ticket.property_id})
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {ticket.replies_count}
                  </td> */}
                  
                  <td className="px-6 py-4 text-xs">
                    {renderStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {renderPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {ticket.created_at}
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons
                      onView={() => handleView(ticket)}
                      onEdit={() => onEdit && onEdit(ticket)}
                      onDelete={() => onDelete && onDelete(ticket.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Mobile Card View */}
          <div className="block md:hidden space-y-4 p-4 bg-gray-50">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onRowClick && onRowClick(ticket)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick && onRowClick(ticket);
                  }
                }}
                role="button"
                tabIndex={0}
                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon && getStatusIcon(ticket.status)}
                    <h3 className="text-sm font-semibold text-gray-900">
                      {ticket.subject}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    #{ticket.id}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-2">{ticket.description}</p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium">Property:</span>{" "}
                    {ticket.property_name} (ID: {ticket.property_id})
                  </p>
                  <p className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {ticket.replies_count} replies
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {ticket.created_at}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {renderStatusBadge(ticket.status)}
                    {renderPriorityBadge(ticket.priority)}
                  </div>
                </div>

                <div className="mt-3">
                  <ActionButtons
                    onView={() => handleView(ticket)}
                    onEdit={() => onEdit && onEdit(ticket)}
                    onDelete={() => onDelete && onDelete(ticket.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No tickets found</p>
        </div>
      )}

      {/* ✅ Pagination Bar */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          translations={translations}
        />
      )}
    </div>
    {/* Support Ticket View Modal (controlled) */}
    <SupportTicketViewModal show={showView} ticket={selectedTicket} onClose={() => setShowView(false)} />
    </>
  );
}

export default React.memo(TicketsTable);
