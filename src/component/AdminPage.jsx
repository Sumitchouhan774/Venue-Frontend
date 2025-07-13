"use client";
import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Users, 
  DollarSign, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  X, 
  BookOpen, 
  Eye,
  Building2,
  Plus,
  Shield,
  CalendarX,
  FileText,
  Settings,
  AlertTriangle
} from "lucide-react";
import axios from "axios";

// 🏢 Create Venue Modal Component
function CreateVenueModal({ onClose, onVenueCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    pricePerDay: "",
    amenities: [],
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const commonAmenities = [
    "WiFi", "Parking", "Air Conditioning", "Sound System", "Projector", 
    "Stage", "Kitchen", "Bar", "Dance Floor", "Photography", "Catering",
    "Security", "Restrooms", "Lighting", "Tables & Chairs"
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Venue name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = "Valid capacity is required";
    if (!formData.pricePerDay || formData.pricePerDay <= 0) newErrors.pricePerDay = "Valid price is required";
    if (formData.amenities.length === 0) newErrors.amenities = "At least one amenity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/venues`,
        {
          ...formData,
          capacity: parseInt(formData.capacity),
          pricePerDay: parseFloat(formData.pricePerDay),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onVenueCreated(response.data);
      onClose();
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || "Failed to create venue. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const addAmenity = (amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
      setNewAmenity("");
      if (errors.amenities) {
        setErrors((prev) => ({ ...prev, amenities: undefined }));
      }
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 bg-stone-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Venue</h2>
                <p className="text-gray-600">Add a new venue to the platform</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Venue Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Venue Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg transition-all text-gray-900 ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
              placeholder="Grand Ballroom"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg transition-all text-gray-900 resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
              placeholder="Describe the venue..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Location & Capacity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all text-gray-900 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
                placeholder="Downtown, Mumbai"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-lg transition-all text-gray-900 ${
                  errors.capacity ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
                placeholder="200"
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price per Day (₹)
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 border rounded-lg transition-all text-gray-900 ${
                errors.pricePerDay ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
              placeholder="10000"
            />
            {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>}
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Plus className="w-4 h-4 inline mr-1" />
              Amenities
            </label>
            
            {/* Add Custom Amenity */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                placeholder="Add custom amenity..."
              />
              <button
                type="button"
                onClick={() => addAmenity(newAmenity.trim())}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Common Amenities */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {commonAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => addAmenity(amenity)}
                    disabled={formData.amenities.includes(amenity)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.amenities.includes(amenity)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Selected amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {errors.amenities && <p className="mt-1 text-sm text-red-600">{errors.amenities}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Building2 className="w-5 h-5 mr-2" />
                  Create Venue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// �️ View Venue Details Modal Component
function VenueDetailsModal({ venue, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenueBookings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/venues/${venue._id}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch venue bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueBookings();
  }, [venue._id]);

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

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  return (
    <div className="fixed inset-0 bg-stone-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-100 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
                <p className="text-gray-600">Venue details and bookings</p>
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

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Venue Info Sidebar */}
          <div className="lg:w-1/3 border-r border-gray-100 p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Venue Information</h3>
            
            <div className="space-y-4">
              {/* Description */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                <p className="text-gray-900 text-sm">{venue.description}</p>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-900">{venue.location}</p>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Capacity</p>
                  <p className="text-gray-900">{venue.capacity} guests</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Price per Day</p>
                  <p className="text-xl font-bold text-gray-900">₹{venue.pricePerDay.toLocaleString()}</p>
                </div>
              </div>

              {/* Owner */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Owner</p>
                    <p className="text-gray-900">{venue.owner.name}</p>
                    <p className="text-sm text-gray-500">{venue.owner.email}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1">
                  {venue.amenities.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Content */}
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Venue Bookings</h3>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h4>
                <p className="text-red-600">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h4>
                <p className="text-gray-600">This venue hasn't received any bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div key={booking._id || index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {booking.customer?.name || booking.user?.name || 'Customer'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {booking.customer?.email || booking.user?.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Pending'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Booking Dates */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Booking Period</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {calculateDays(booking.startDate, booking.endDate)} day{calculateDays(booking.startDate, booking.endDate) > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{booking.totalAmount?.toLocaleString() || booking.amount?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Booking Date */}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">Booked On</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.createdAt || booking.bookingDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking ID */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Booking ID: <span className="font-mono">{booking._id?.slice(-8) || booking.id || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// �🚫 Block Venue Modal Component
function BlockVenueModal({ venue, onClose, onVenueBlocked }) {
  const [blockDates, setBlockDates] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlockDates((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!blockDates.startDate || !blockDates.endDate) {
      setErrors({ submit: "Please select both start and end dates" });
      return;
    }

    if (new Date(blockDates.startDate) >= new Date(blockDates.endDate)) {
      setErrors({ submit: "End date must be after start date" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/venues/${venue._id}/block`,
        {
          startDate: blockDates.startDate,
          endDate: blockDates.endDate,
          reason: blockDates.reason || "Blocked by admin"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onVenueBlocked(venue._id, response.data);
      onClose();
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.error || "Failed to block venue dates" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <CalendarX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Block Venue Dates</h2>
                <p className="text-gray-600">{venue.name}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={blockDates.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={blockDates.endDate}
                onChange={handleInputChange}
                min={blockDates.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Reason for Blocking
            </label>
            <textarea
              name="reason"
              value={blockDates.reason}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 resize-none"
              placeholder="Maintenance, inspection, or other reason..."
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CalendarX className="w-5 h-5 mr-2" />
                  Block Dates
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🎯 Main Admin Page
export default function AdminPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/venues`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      setVenues(response.data);
    } catch (err) {
      setError('Failed to fetch venues');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueCreated = (newVenue) => {
    setVenues(prev => [newVenue, ...prev]);
  };

  const handleVenueBlocked = (venueId, blockData) => {
    // Optionally update venue data or show success message
    console.log(`Venue ${venueId} blocked:`, blockData);
  };

  const handleBlockVenue = (venue) => {
    setSelectedVenue(venue);
    setShowBlockModal(true);
  };

  const handleViewDetails = (venue) => {
    setSelectedVenue(venue);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gray-900 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage all venues on the platform. Create new venues and block existing ones.
          </p>
          
          {/* Create Venue Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Venue</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <p className="text-gray-600">Loading venues...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Venues</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchVenues}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Venues Grid */}
        {!loading && !error && (
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

                {/* Admin Actions */}
                <div className="p-6 pt-0 space-y-3">
                  <button
                    onClick={() => handleBlockVenue(venue)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
                  >
                    <CalendarX className="w-5 h-5 mr-2" />
                    Block Venue Dates
                  </button>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(venue)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && venues.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Venues Found</h3>
            <p className="text-gray-600 mb-4">Get started by creating the first venue on the platform.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create First Venue
            </button>
          </div>
        )}

        {/* Create Venue Modal */}
        {showCreateModal && (
          <CreateVenueModal 
            onClose={() => setShowCreateModal(false)} 
            onVenueCreated={handleVenueCreated}
          />
        )}

        {/* Block Venue Modal */}
        {showBlockModal && selectedVenue && (
          <BlockVenueModal 
            venue={selectedVenue}
            onClose={() => setShowBlockModal(false)} 
            onVenueBlocked={handleVenueBlocked}
          />
        )}

        {/* Venue Details Modal */}
        {showDetailsModal && selectedVenue && (
          <VenueDetailsModal 
            venue={selectedVenue}
            onClose={() => setShowDetailsModal(false)} 
          />
        )}
      </div>
    </div>
  );
}
