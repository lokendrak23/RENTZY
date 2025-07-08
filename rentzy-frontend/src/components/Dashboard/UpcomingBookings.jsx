import React from 'react';

const UpcomingBookings = ({ bookings }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="border-l-4 border-blue-500 pl-4 py-2">
          <p className="text-sm font-medium text-gray-900">{booking.property}</p>
          <p className="text-sm text-gray-600">{booking.tenant}</p>
          <p className="text-xs text-gray-500">
            {booking.checkIn} - {booking.checkOut}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingBookings;
