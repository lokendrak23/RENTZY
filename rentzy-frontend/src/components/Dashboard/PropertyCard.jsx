import React from 'react';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

const PropertyCard = ({ property }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img 
      src={property.image} 
      alt={property.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          property.status === 'Occupied' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {property.status}
        </span>
      </div>
      <p className="text-gray-600 mb-2">{property.location}</p>
      <p className="text-sm text-gray-500 mb-4">
        {property.bedrooms} bed • {property.bathrooms} bath • {property.type}
      </p>
      
      {property.tenant && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Current Tenant: {property.tenant}</p>
          <p className="text-sm text-gray-500">Lease ends: {property.leaseEnd}</p>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
          <EyeIcon className="h-4 w-4 mr-2" />
          View
        </button>
        <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </button>
      </div>
    </div>
  </div>
);

export default PropertyCard;
