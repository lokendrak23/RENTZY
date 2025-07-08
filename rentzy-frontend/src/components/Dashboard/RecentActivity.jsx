import React from 'react';

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            activity.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {activity.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivity;
