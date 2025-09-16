import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Users, BookOpen, Star, Video } from 'lucide-react';
import { api } from '../api';

interface HomeSnapshot {
  role: 'PARENT' | 'TUTOR' | 'ADMIN';
  today_summary: any;
  payouts?: {
    available_cents: number;
  };
  onboarding_state?: string;
}

interface Booking {
  id: string;
  status: string;
  start_utc: string;
  end_utc: string;
  mode: 'ONLINE' | 'IN_PERSON';
  video_join_url?: string;
}

export default function Dashboard() {
  const [homeData, setHomeData] = useState<HomeSnapshot | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Try to get home snapshot
        try {
          const snapshot = await api<HomeSnapshot>('/me/home');
          setHomeData(snapshot);
        } catch (error) {
          // Fallback for basic user info
          setHomeData({
            role: 'PARENT',
            today_summary: {},
            onboarding_state: 'APPROVED'
          });
        }

        // Load upcoming bookings (mock data for now)
        setUpcomingBookings([
          {
            id: '1',
            status: 'CONFIRMED',
            start_utc: new Date(Date.now() + 86400000).toISOString(),
            end_utc: new Date(Date.now() + 90000000).toISOString(),
            mode: 'ONLINE',
            video_join_url: 'https://zoom.us/j/123456789'
          }
        ]);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isParent = homeData?.role === 'PARENT';
  const isTutor = homeData?.role === 'TUTOR';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{isTutor ? ', Tutor' : ''}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isParent && "Manage your child's learning journey"}
            {isTutor && "Track your teaching progress and earnings"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {upcomingBookings.length} Sessions
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                <p className="text-2xl font-semibold text-gray-900">24.5</p>
              </div>
            </div>
          </div>

          {isTutor && (
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Available Payout</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${((homeData?.payouts?.available_cents || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.9</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Sessions</h2>
              
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-500 mb-4">Book a session to get started</p>
                  <button className="btn-primary">Find Tutors</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            {booking.mode === 'ONLINE' ? (
                              <Video className="h-5 w-5 text-primary-600" />
                            ) : (
                              <Users className="h-5 w-5 text-primary-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Mathematics Session</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.start_utc).toLocaleDateString()} at{' '}
                              {new Date(booking.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          {booking.video_join_url && (
                            <button className="btn-primary text-sm">Join Session</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Find New Tutor</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>View Calendar</span>
                </button>
                {isTutor && (
                  <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Manage Profile</span>
                  </button>
                )}
              </div>
            </div>

            {isTutor && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tutor Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Students Taught</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold">&lt; 2 hours</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
