'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Prepare data for charts
  const dailyApplications = stats?.dailyApplications || [];
  // Pie chart data for status (using available API fields)
  const statusData = [
    { name: 'Take Home', value: stats?.takeHomeAssignments?.count || 0, color: '#3B82F6' },
    { name: 'Interviews', value: stats?.interviews?.count || 0, color: '#F59E0B' },
    // You can add more statuses if your API provides them
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your job search progress and insights</p>
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Loading/Error States */}
            {loading && (
              <div className="text-center py-12 text-gray-500">Loading statistics...</div>
            )}
            {error && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}
            {!loading && !error && stats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Applications</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
                      </div>
                    </div>
                  </div>
                  {/* Take Home Assignments Card - moved before Interviews, with new icon and color */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Take Home Assignments</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.takeHomeAssignments.count}</p>
                        <p className="text-xs text-gray-500">{stats.takeHomeAssignments.percentage}% of applications</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Interviews</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.interviews.count}</p>
                        <p className="text-xs text-gray-500">{stats.interviews.percentage}% of applications</p>
                      </div>
                    </div>
                  </div>
                  {/* Offer Rate Card (replaces Success Rate) */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Offer Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.offers.count}</p>
                        <p className="text-xs text-gray-500">{stats.offers.percentage}% of applications</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Applications Over Time */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dailyApplications}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Application Status Distribution */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Placeholders for additional charts and recent activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                    <div className="text-gray-400 text-center py-12">(Coming soon)</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Performance</h3>
                    <div className="text-gray-400 text-center py-12">(Coming soon)</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="text-gray-400 text-center py-12">(Coming soon)</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 