'use client';
import React from 'react';
import type { Place as TravelPlace } from '@/types/types';

export default function PlaceDetailsModal({
  place,
  onClose,
}: {
  place: TravelPlace | null;
  onClose: () => void;
}) {
  if (!place) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">{place.name}</h2>
        <p className="text-gray-700 mb-1">{place.address}</p>
        {place.phone && <p className="text-gray-700 mb-1">📞 {place.phone}</p>}
        <p className="text-gray-700 mb-1">⭐ {place.rating}</p>
        {place.description && (
          <p className="text-gray-600 mt-2">{place.description}</p>
        )}
      </div>
    </div>
  );
}
