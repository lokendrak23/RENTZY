import React from 'react';

const BookingsTable = ({ bookings }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.property}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.tenant}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkIn}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOut}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default BookingsTable;
