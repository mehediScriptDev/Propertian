"use client";

import { use, useState } from "react";
import { useTranslation } from "@/i18n";
import StatsCard from "@/components/dashboard/admin/StatsCard";
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Star,
  FileText,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  DollarSign
} from "lucide-react";

export default function ConciergeReportsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);
  
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Mock data for reports
  const metrics = {
    totalTickets: 156,
    completedTickets: 142,
    avgCompletionTime: "2.3 days",
    clientSatisfaction: 4.8,
    revenue: "$24,500",
    activeClients: 45,
    newClients: 12,
    repeatClients: 33
  };

  const monthlyData = [
    { month: "Jul", tickets: 120, completed: 115, revenue: 18500 },
    { month: "Aug", tickets: 135, completed: 128, revenue: 21200 },
    { month: "Sep", tickets: 142, completed: 135, revenue: 22800 },
    { month: "Oct", tickets: 158, completed: 151, revenue: 25100 },
    { month: "Nov", tickets: 168, completed: 159, revenue: 26700 },
    { month: "Dec", tickets: 156, completed: 142, revenue: 24500 }
  ];

  const serviceTypes = [
    { type: "Property Viewing", count: 68, percentage: 43.6, revenue: 10800 },
    { type: "Investment Consultation", count: 32, percentage: 20.5, revenue: 6400 },
    { type: "Market Analysis", count: 24, percentage: 15.4, revenue: 4800 },
    { type: "Relocation Services", count: 18, percentage: 11.5, revenue: 1800 },
    { type: "Rental Search", count: 14, percentage: 9.0, revenue: 700 }
  ];

  const clientSatisfactionData = [
    { rating: "5 Stars", count: 98, percentage: 69.0 },
    { rating: "4 Stars", count: 32, percentage: 22.5 },
    { rating: "3 Stars", count: 8, percentage: 5.6 },
    { rating: "2 Stars", count: 3, percentage: 2.1 },
    { rating: "1 Star", count: 1, percentage: 0.7 }
  ];

  const topPerformers = [
    { name: "Sarah Wilson", tickets: 68, completion: 96, satisfaction: 4.9 },
    { name: "Michael Johnson", tickets: 52, completion: 94, satisfaction: 4.8 },
    { name: "Emma Davis", tickets: 36, completion: 92, satisfaction: 4.7 }
  ];

  const getPercentageColor = (value, threshold = 90) => {
    if (value >= threshold) return "text-green-600";
    if (value >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const exportReport = () => {
    // Mock export functionality
    console.log("Exporting report for period:", selectedPeriod);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600">Performance insights and service metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tickets"
          value={metrics.totalTickets}
          trend="+12%"
          variant="primary"
          icon={FileText}
        />
        <StatsCard
          title="Completion Rate"
          value={`${Math.round((metrics.completedTickets / metrics.totalTickets) * 100)}%`}
          trend="+5%"
          variant="success"
          icon={Activity}
        />
        <StatsCard
          title="Avg Completion Time"
          value={metrics.avgCompletionTime}
          trend="-8%"
          variant="info"
          icon={Clock}
        />
        <StatsCard
          title="Client Satisfaction"
          value={metrics.clientSatisfaction}
          trend="+0.2"
          variant="warning"
          icon={Star}
        />
      </div>

      {/* Performance Chart */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            <p className="text-sm text-gray-600">Monthly ticket volume and completion rates</p>
          </div>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
          >
            <option value="all">All Metrics</option>
            <option value="tickets">Tickets Only</option>
            <option value="revenue">Revenue Only</option>
          </select>
        </div>

        {/* Mock Chart - In real app, use a charting library */}
        <div className="space-y-4">
          <div className="flex items-end gap-2 h-64">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="flex flex-col items-center gap-1 mb-2">
                  {/* Tickets Bar */}
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(data.tickets / 200) * 200}px`, minHeight: '20px' }}
                  />
                  {/* Revenue Bar */}
                  <div 
                    className="w-full bg-green-500 rounded-b"
                    style={{ height: `${(data.revenue / 30000) * 100}px`, minHeight: '10px' }}
                  />
                </div>
                <div className="text-xs text-gray-600 font-medium">{data.month}</div>
                <div className="text-xs text-gray-500">{data.tickets}t</div>
                <div className="text-xs text-gray-500">${(data.revenue/1000).toFixed(1)}k</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Revenue</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service Types Breakdown */}
        <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Service Types</h3>
              <p className="text-sm text-gray-600">Breakdown by service category</p>
            </div>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {serviceTypes.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{service.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{service.count}</span>
                    <span className="text-gray-500">({service.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#E6B325] h-2 rounded-full"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">
                  Revenue: ${service.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Client Satisfaction</h3>
              <p className="text-sm text-gray-600">Rating distribution</p>
            </div>
            <Star className="h-5 w-5 text-yellow-400" />
          </div>

          <div className="space-y-4">
            {clientSatisfactionData.map((rating, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium text-gray-700">{rating.rating}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-400 h-3 rounded-full"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">{rating.count}</div>
                <div className="w-12 text-sm text-gray-500 text-right">({rating.percentage}%)</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-800">Average Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-yellow-900">{metrics.clientSatisfaction}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <p className="text-sm text-gray-600">Individual performance metrics</p>
          </div>
          <Users className="h-5 w-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Team Member</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Tickets Handled</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Completion Rate</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Satisfaction</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((performer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{performer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">{performer.tickets}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`font-medium ${getPercentageColor(performer.completion)}`}>
                      {performer.completion}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{performer.satisfaction}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {performer.completion >= 95 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : performer.completion >= 90 ? (
                        <Activity className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Summary</h3>
            <p className="text-sm text-gray-600">Financial performance overview</p>
          </div>
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">{metrics.revenue}</div>
            <div className="text-sm text-green-700">Total Revenue</div>
            <div className="text-xs text-green-600 mt-1">+15% from last month</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">${Math.round(24500 / 156)}</div>
            <div className="text-sm text-blue-700">Avg per Ticket</div>
            <div className="text-xs text-blue-600 mt-1">+8% from last month</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">{metrics.activeClients}</div>
            <div className="text-sm text-purple-700">Active Clients</div>
            <div className="text-xs text-purple-600 mt-1">{metrics.newClients} new this month</div>
          </div>
        </div>
      </div>
    </div>
  );
}