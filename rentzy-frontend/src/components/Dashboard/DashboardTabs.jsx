import React from 'react';

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'properties', label: 'Properties' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'tenants', label: 'Tenants' }
  ];

  return (
    <div className="mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;
