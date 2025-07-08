import React, { useState } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Import components
import StatCard from '../components/Dashboard/StatCard';
import PropertyCard from '../components/Dashboard/PropertyCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import UpcomingBookings from '../components/Dashboard/UpcomingBookings';
import BookingsTable from '../components/Dashboard/BookingsTable';
import TenantsGrid from '../components/Dashboard/TenantsGrid';
import DashboardTabs from '../components/Dashboard/DashboardTabs';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data - replace with your API calls
  const dashboardStats = {
    totalProperties: 12,
    activeBookings: 8,
    pendingApplications: 3,
    availableProperties: 4
  };

  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Downtown, City Center",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      status: "Occupied",
      tenant: "John Smith",
      leaseEnd: "2025-12-15",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Cozy Studio Near University",
      location: "University District",
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      status: "Available",
      tenant: null,
      leaseEnd: null,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Family House with Garden",
      location: "Suburban Area",
      type: "House",
      bedrooms: 3,
      bathrooms: 2,
      status: "Occupied",
      tenant: "Sarah Johnson",
      leaseEnd: "2025-08-30",
      image: "/api/placeholder/300/200"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "application",
      message: "New application for Modern Downtown Apartment",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "booking",
      message: "Booking confirmed for Cozy Studio",
      time: "1 day ago",
      status: "confirmed"
    },
    {
      id: 3,
      type: "inquiry",
      message: "Inquiry about Family House availability",
      time: "2 days ago",
      status: "responded"
    }
  ];

  const upcomingBookings = [
    {
      id: 1,
      property: "Modern Downtown Apartment",
      tenant: "Mike Wilson",
      checkIn: "2025-07-15",
      checkOut: "2025-07-22",
      status: "confirmed"
    },
    {
      id: 2,
      property: "Cozy Studio Near University",
      tenant: "Emma Davis",
      checkIn: "2025-07-20",
      checkOut: "2025-08-05",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600">Manage your properties and tenants</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Properties" 
            value={dashboardStats.totalProperties} 
            icon={HomeIcon}
            color="#3B82F6"
          />
          <StatCard 
            title="All Bookings" 
            value={dashboardStats.activeBookings} 
            icon={CalendarIcon}
            color="#10B981"
          />
          <StatCard 
            title="Pending Query" 
            value={dashboardStats.pendingApplications} 
            icon={ClockIcon}
            color="#F59E0B"
          />
          
        </div>

        {/* Navigation Tabs */}
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentActivity activities={recentActivity} />
            </div>
            <div>
              <UpcomingBookings bookings={upcomingBookings} />
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <BookingsTable bookings={upcomingBookings} />
        )}

        {activeTab === 'tenants' && (
          <TenantsGrid properties={properties} />
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
