'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Users, DollarSign, Star, Calendar, Clock, User, X, BookOpen, Eye } from 'lucide-react';
import axios from 'axios';

// 🧩 Beautiful Booking Modal Component
function BookingModal({ venue, onClose, onBook }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate total days and cost
  const calculateTotal = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const totalDays = calculateTotal();
  const totalCost = totalDays * venue.pricePerDay;

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`,
        {
          venueId: venue._id,
          startDate,
          endDate
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onBook(response.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 transform transition-all duration-300 scale-100">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Book Venue</h2>
              <p className="text-gray-600">{venue.name}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Venue Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-gray-900">{venue.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Capacity</p>
                <p className="text-gray-900">{venue.capacity} guests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-gray-900"
              />
            </div>
          </div>

          {/* Cost Breakdown */}
          {totalDays > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price per day:</span>
                <span className="font-medium text-gray-900">₹{venue.pricePerDay.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total Cost:</span>
                <span className="font-bold text-2xl text-gray-900">₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading || !startDate || !endDate}
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 My Bookings Modal Component
function MyBookingsModal({ onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/my-bookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-100 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                <p className="text-gray-600">View all your venue reservations</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600">You haven't made any venue bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <div key={booking._id || index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.venue?.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {booking.venue?.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Dates */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Booking Period</p>
                        <p className="text-gray-900">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-gray-900">
                          {booking.venue?.location}
                        </p>
                      </div>
                    </div>

                    {/* Total Cost */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total Cost</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{booking.totalPrice?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Booking ID: {booking._id?.slice(-8)}</span>
                        <span>•</span>
                        <span>Booked on: {formatDate(booking.createdAt)}</span>
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎯 Main Venues Page
export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  const handleBookClick = (venue) => {
    setSelectedVenue(venue);
    setShowModal(true);
  };

  const handleBookingSuccess = (bookingData) => {
    alert("Booking successful!");
    console.log("Booking:", bookingData);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL
        const response = await axios.get(`${url}/api/venues`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // replace with real token
          }
        });
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Venues</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover perfect venues for your events. From intimate gatherings to grand celebrations.
          </p>
          
          {/* My Bookings Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowBookingsModal(true)}
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5" />
              <span>My Bookings</span>
            </button>
          </div>
        </div>

        {/* Venue Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {venues.map(venue => (
            <div key={venue._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-yellow-700">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-900">{venue.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Capacity</p>
                    <p className="text-gray-900">{venue.capacity} guests</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Price per Day</p>
                    <p className="text-2xl font-bold text-gray-900">₹{venue.pricePerDay.toLocaleString()}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">{amenity}</span>
                    ))}
                  </div>
                </div>

                {/* Owner Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{venue.owner.name}</p>
                      <p className="text-sm text-gray-500">{venue.owner.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleBookClick(venue)}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now
                  <Clock className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {venues.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues available</h3>
            <p className="text-gray-600">Check back later for new venue listings.</p>
          </div>
        )}

        {/* Booking Modal */}
        {showModal && selectedVenue && (
          <BookingModal 
            venue={selectedVenue} 
            onClose={() => setShowModal(false)} 
            onBook={handleBookingSuccess} 
          />
        )}

        {/* My Bookings Modal */}
        {showBookingsModal && (
          <MyBookingsModal 
            onClose={() => setShowBookingsModal(false)} 
          />
        )}
      </div>
    </div>
  );
}
