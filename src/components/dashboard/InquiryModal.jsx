"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { Calendar, Send, Building2, X } from "lucide-react";

export default function InquiryModal({ isOpen, onClose, inquiry, onRespond }) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  if (!isOpen || !inquiry) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: "bg-blue-50", text: "text-blue-700", label: "New" },
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Pending",
      },
      resolved: {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Resolved",
      },
      closed: { bg: "bg-gray-50", text: "text-gray-700", label: "Closed" },
    };
    const cfg =
      statusConfig[(status || "").toString().toLowerCase()] || statusConfig.new;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const cfg = {
      high: { bg: "bg-red-50", text: "text-red-700", label: "High" },
      medium: { bg: "bg-orange-50", text: "text-orange-700", label: "Medium" },
      low: { bg: "bg-gray-50", text: "text-gray-700", label: "Low" },
    }[(priority || "").toString().toLowerCase()] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      label: "Medium",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    
    setSending(true);
    try {
      if (onRespond) {
        await onRespond(replyText, inquiry);
      }
      setReplyText("");
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Property inquiry"
      maxWidth="max-w-2xl"
      showCloseButton={false}
    >
      {/* Close Icon - Top Right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* Compact Header Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                Property: {inquiry.property || "—"}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(inquiry.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(inquiry.priority)}
                {getStatusBadge(inquiry.status)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Thread Area */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto space-y-4">
        {/* User's Initial Message (Right Side - Blue) */}
        <div className="flex justify-end">
          <div className="max-w-[80%]">
            <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 mt-1 px-2">
              <span className="text-xs text-gray-500">You</span>
              <span className="text-xs text-gray-400">{formatTime(inquiry.date)}</span>
            </div>
          </div>
        </div>

        {/* Admin/Partner Response (Left Side - Gray) */}
        {inquiry.response && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {inquiry.response}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1 px-2">
                <span className="text-xs text-gray-500">Support Team</span>
                {inquiry.responded_at && (
                  <span className="text-xs text-gray-400">{formatTime(inquiry.responded_at)}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state when waiting for response */}
        {!inquiry.response && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              Waiting for response...
            </div>
          </div>
        )}
      </div>

      {/* Reply Input Area (Sticky Footer) */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              placeholder="Write your reply here..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1 px-1">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim() || sending}
            className={`px-5 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              replyText.trim() && !sending
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Send reply"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
