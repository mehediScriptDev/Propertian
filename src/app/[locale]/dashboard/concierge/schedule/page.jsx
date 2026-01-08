"use client";

import { use, useState } from "react";
import { useTranslation } from "@/i18n";
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

export default function ConciergeSchedulePage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);
  
  // Mock schedule data
  const [appointments] = useState([
    {
      id: 1,
      title: "Property Viewing - John Smith",
      clientName: "John Smith",
      clientPhone: "+1-555-0123",
      clientEmail: "john.smith@email.com",
      date: "2024-01-20",
      startTime: "10:00",
      endTime: "12:00",
      location: "Downtown Manhattan",
      address: "123 Main St, New York, NY 10001",
      serviceType: "Property Viewing",
      status: "Confirmed",
      notes: "Client prefers morning appointments",
      priority: "High"
    },
    {
      id: 2,
      title: "Investment Consultation - David Chen",
      clientName: "David Chen",
      clientPhone: "+1-555-0789",
      clientEmail: "david.chen@email.com",
      date: "2024-01-19",
      startTime: "14:00",
      endTime: "15:30",
      location: "Office - Queens",
      address: "Office Meeting Room",
      serviceType: "Investment Consultation",
      status: "Confirmed",
      notes: "First-time investor, needs guidance",
      priority: "High"
    },
    {
      id: 3,
      title: "Follow-up Call - Maria Garcia",
      clientName: "Maria Garcia",
      clientPhone: "+1-555-0456",
      clientEmail: "maria.garcia@email.com",
      date: "2024-01-21",
      startTime: "09:30",
      endTime: "10:00",
      location: "Phone Call",
      address: "Remote",
      serviceType: "Follow-up",
      status: "Scheduled",
      notes: "Discuss property search results",
      priority: "Medium"
    },
    {
      id: 4,
      title: "Property Tour - Emma Thompson",
      clientName: "Emma Thompson",
      clientPhone: "+1-555-0321",
      clientEmail: "emma.thompson@email.com",
      date: "2024-01-22",
      startTime: "15:00",
      endTime: "17:00",
      location: "Manhattan Upper East",
      address: "456 Park Ave, New York, NY 10022",
      serviceType: "Property Viewing",
      status: "Tentative",
      notes: "International client, may reschedule",
      priority: "Medium"
    },
    {
      id: 5,
      title: "Market Analysis Meeting - Lisa Anderson",
      clientName: "Lisa Anderson",
      clientPhone: "+1-555-0987",
      clientEmail: "lisa.anderson@email.com",
      date: "2024-01-23",
      startTime: "11:00",
      endTime: "12:30",
      location: "Office - Williamsburg",
      address: "Office Meeting Room",
      serviceType: "Market Analysis",
      status: "Confirmed",
      notes: "Bring detailed market reports",
      priority: "Low"
    }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState("week"); // week, day, month

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tentative': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-l-red-500';
      case 'Medium': return 'border-l-yellow-500';
      case 'Low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  // Get appointments for current week
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // subtract days to get to Sunday
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = formatDate(date);
    return appointments.filter(apt => apt.date === dateStr);
  };

  const weekDates = getWeekDates();
  const today = new Date();
  const todayStr = formatDate(today);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/${locale}/dashboard/concierge`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-600">Manage your appointments and meetings</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6B325] text-white rounded-lg hover:bg-[#d4a017] transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" />
          New Appointment
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Today
            </button>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
            >
              <option value="week">Week</option>
              <option value="day">Day</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        {/* Week View Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const isToday = dateStr === todayStr;
            const dayAppointments = getAppointmentsForDate(date);
            
            return (
              <div key={index} className="min-h-[200px]">
                <div className={`text-center p-2 rounded-t-lg border-b ${isToday ? 'bg-[#E6B325] text-white' : 'bg-gray-50 text-gray-700'}`}>
                  <div className="text-xs font-medium">{dayNames[date.getDay()]}</div>
                  <div className="text-sm font-semibold">{date.getDate()}</div>
                </div>
                
                <div className="p-2 space-y-1 min-h-[160px] bg-white border-l border-r border-b border-gray-200">
                  {dayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className={`p-2 rounded-md text-xs cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(appointment.priority)} bg-gray-50 hover:bg-gray-100`}
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {appointment.startTime} {appointment.title}
                      </div>
                      <div className="text-gray-600 truncate">
                        {appointment.location}
                      </div>
                      <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          <p className="text-sm text-gray-600">{today.toLocaleDateString()}</p>
        </div>

        <div className="divide-y divide-gray-200">
          {getAppointmentsForDate(today).length > 0 ? (
            getAppointmentsForDate(today).map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {appointment.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        {appointment.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {appointment.clientPhone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-medium text-gray-900">No appointments today</h3>
              <p className="mt-1 text-sm text-gray-500">Your schedule is clear for today.</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{selectedAppointment.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(selectedAppointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedAppointment.location}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Service Type:</strong> {selectedAppointment.serviceType}
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{selectedAppointment.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selectedAppointment.clientEmail}`} className="text-[#E6B325] hover:underline">
                        {selectedAppointment.clientEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedAppointment.clientPhone}`} className="text-[#E6B325] hover:underline">
                        {selectedAppointment.clientPhone}
                      </a>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Priority:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedAppointment.priority === 'High' ? 'bg-red-100 text-red-800' :
                        selectedAppointment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedAppointment.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {selectedAppointment.address && selectedAppointment.address !== 'Remote' && (
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                    <p className="text-sm text-gray-700">{selectedAppointment.address}</p>
                  </div>
                )}

                {/* Notes */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {selectedAppointment.notes || "No notes available."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-[#E6B325] text-white py-2 px-4 rounded-lg hover:bg-[#d4a017] transition-colors">
                    <Edit className="h-4 w-4 inline mr-2" />
                    Edit Appointment
                  </button>
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Call Client
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}