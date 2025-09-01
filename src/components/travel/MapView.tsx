import React from 'react';
import { MapViewProps, Place } from '@/types/types';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

export const MapView = ({
  places,
  setSelectedPlace,
  hoveredPlaceId,
}: MapViewProps) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<any>(null);

  const onLoad = (map: any) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (mapRef.current && places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      places.forEach((place) => {
        bounds.extend({ lat: place.lat, lng: place.lng });
      });

      // Fit map to show all markers
      mapRef.current.fitBounds(bounds);
    }
  }, [places]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback to Paris if location not available
          setUserLocation({ lat: 48.8566, lng: 2.3522 });
        }
      );
    } else {
      setUserLocation({ lat: 48.8566, lng: 2.3522 });
    }
  }, []);

  if (!userLocation) return <div>Loading map...</div>;

  return (
    <div className="md:w-1/2 w-full h-80 md:h-auto">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={userLocation}
          zoom={13}
          onLoad={onLoad}
        >
          {places.map((place: Place) => (
            <Marker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => setSelectedPlace(place)}
              // Highlight if hovered
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: hoveredPlaceId === place.id ? 10 : 6,
                fillColor: hoveredPlaceId === place.id ? 'blue' : 'red',
                fillOpacity: 0.9,
                strokeWeight: 1,
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
