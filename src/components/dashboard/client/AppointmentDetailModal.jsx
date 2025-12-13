"use client";

import React from 'react';
import { X, Calendar, Clock, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

export default function AppointmentDetailModal({ appointment, show, onClose, getStatusColor, getStatusLabel }) {
    if (!show || !appointment) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">Booking Details</h2>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Property Info */}
                        {appointment.property && (
                            <div className="rounded-lg border border-gray-200 p-3 sm:p-4 bg-gray-50">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Property Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-sm sm:text-base font-medium text-gray-900">{appointment.property.title}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">{appointment.property.address}, {appointment.property.city}, {appointment.property.state}</p>
                                        </div>
                                    </div>
                                    {appointment.property.price && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} className="text-gray-400" />
                                            <p className="text-sm sm:text-base font-semibold text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(appointment.property.price)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                                    <Calendar size={14} /> Check-in Date
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    {appointment.startDate ? new Date(appointment.startDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                                    <Calendar size={14} /> Check-out Date
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    {appointment.endDate ? new Date(appointment.endDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                                    <Clock size={14} /> Time
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">{appointment.preferred_time || '06:00:00'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-gray-600">Booking Type</p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">{appointment.appointment_type}</p>
                            </div>

                            {appointment.totalAmount && (
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(appointment.totalAmount)}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-xs sm:text-sm text-gray-600">Status</p>
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                    <span className="h-2 w-2 rounded-full bg-current" />
                                    {getStatusLabel(appointment.status)}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {appointment.notes && (
                            <div className="space-y-2">
                                <p className="text-xs sm:text-sm text-gray-600">Notes</p>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <p className="text-xs sm:text-sm text-gray-900">{appointment.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Sticky - Hidden on Mobile & Tablet */}
                <div className="hidden lg:flex shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex-row justify-end gap-2 sm:gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                    >
                        Close
                    </button>
                    {/* <button className="px-4 py-2 bg-[#E6B325] text-white rounded-lg hover:bg-[#d4a520] transition-colors font-medium">
                        Modify Booking
                    </button> */}
                </div>
            </div>
        </div>
    );
}



