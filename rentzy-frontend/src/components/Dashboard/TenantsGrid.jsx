import React from 'react';

const TenantsGrid = ({ properties }) => {
  const occupiedProperties = properties.filter(p => p.tenant);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Current Tenants</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {occupiedProperties.map((property) => (
            <div key={property.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{property.tenant}</h3>
                <span className="text-sm text-gray-500">Active</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{property.title}</p>
              <p className="text-sm text-gray-500">Lease ends: {property.leaseEnd}</p>
              <div className="mt-4 flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Contact</button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantsGrid;
