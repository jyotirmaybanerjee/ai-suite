'use client';
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { MapView } from '@/components/travel/MapView';
import PlaceDetailsModal from '@/components/travel/PlaceDetailsModal';
import { TravelPlan } from '@/components/travel/TravelPlan';
import { Place } from '@/types/types';
import { useCallback, useMemo, useState } from 'react';

export default function TravelPlannerPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<number | null>(null);

  const trimmedPrompt = useMemo(() => prompt.trim(), [prompt]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!trimmedPrompt) {
        return;
      }

      setLoading(true);
      setSubmitted(true);

      try {
        const endpoint = `${process.env.NEXT_PUBLIC_TRAVEL_API}/travel_plan`;

        /**
         * Comment below code in dev to avoid hitting the quota
         */
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmedPrompt }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        // API contract: { result: stringifiedJson }
        const data = (await response.json()) as { result?: string } | any;
        const resultPayload =
          typeof data?.result === 'string' ? data.result : '[]';

        let parsed: unknown = [];
        try {
          parsed = JSON.parse(resultPayload);
        } catch (_err) {
          parsed = [];
        }

        /**
         * Uncomment below code in dev to avoid hitting the quota
         */
        // const parsed = JSON.parse(
        //   '[{"id":1,"day":1,"startTime":"09:00","endTime":"12:00","name":"Arrival in San José & Transfer to Pacuare River Lodge","lat":9.9333,"lng":-84.0833,"address":"Pacuare River Lodge, Turrialba, Costa Rica","rating":4.9,"phone":"+506 2710-0262","description":"Transfer from Juan Santamaría International Airport (SJO) to the lodge. Enjoy the scenic drive."},{"id":2,"day":1,"startTime":"14:00","endTime":"17:00","name":"Pacuare River Lodge Check-in & Relaxation","lat":9.9333,"lng":-84.0833,"address":"Pacuare River Lodge, Turrialba, Costa Rica","rating":4.9,"phone":"+506 2710-0262","description":"Settle into your lodge, relax, and enjoy the stunning rainforest surroundings."},{"id":3,"day":2,"startTime":"09:00","endTime":"12:00","name":"Whitewater Rafting on the Pacuare River","lat":10,"lng":-83.8333,"address":"Pacuare River, Turrialba, Costa Rica","rating":4.8,"phone":"+506 2710-0262","description":"Experience the thrill of whitewater rafting on one of Costa Rica\'s most beautiful rivers."},{"id":4,"day":2,"startTime":"14:00","endTime":"17:00","name":"Jungle Hike & Wildlife Spotting","lat":10,"lng":-83.8333,"address":"Pacuare River Lodge area, Turrialba, Costa Rica","rating":4.7,"phone":"+506 2710-0262","description":"Guided hike through the rainforest, looking for sloths, monkeys, and other wildlife."},{"id":5,"day":3,"startTime":"09:00","endTime":"12:00","name":"Horseback Riding through the Rainforest","lat":10,"lng":-83.8333,"address":"Pacuare River Lodge area, Turrialba, Costa Rica","rating":4.6,"phone":"+506 2710-0262","description":"Explore the rainforest on horseback, enjoying a unique perspective of the landscape."},{"id":6,"day":3,"startTime":"14:00","endTime":"17:00","name":"Transfer to La Fortuna & Arenal Volcano View","lat":10.48,"lng":-84.71,"address":"La Fortuna, Alajuela Province, Costa Rica","rating":4.9,"phone":"N/A","description":"Travel to La Fortuna and enjoy stunning views of Arenal Volcano during the transfer."},{"id":7,"day":4,"startTime":"09:00","endTime":"12:00","name":"Arenal Volcano Hike","lat":10.48,"lng":-84.71,"address":"Arenal Volcano National Park, La Fortuna, Costa Rica","rating":4.8,"phone":"N/A","description":"Hike around Arenal Volcano, enjoying breathtaking views and learning about the area\'s geology and ecology."},{"id":8,"day":4,"startTime":"14:00","endTime":"17:00","name":"Hot Springs Experience","lat":10.48,"lng":-84.71,"address":"Tabacon Hot Springs, La Fortuna, Costa Rica","rating":4.7,"phone":"+506 2479-6666","description":"Relax and rejuvenate in the naturally heated mineral waters of Tabacon Hot Springs."},{"id":9,"day":5,"startTime":"09:00","endTime":"12:00","name":"Ziplining through the Rainforest Canopy","lat":10.48,"lng":-84.71,"address":"Arenal area, La Fortuna, Costa Rica","rating":4.9,"phone":"Varies by provider","description":"Soar through the rainforest canopy on a thrilling zipline adventure."},{"id":10,"day":5,"startTime":"14:00","endTime":"17:00","name":"La Fortuna Waterfall Hike","lat":10.5,"lng":-84.7,"address":"La Fortuna Waterfall, La Fortuna, Costa Rica","rating":4.6,"phone":"N/A","description":"Hike to the beautiful La Fortuna Waterfall and enjoy a refreshing swim in the cool water."},{"id":11,"day":6,"startTime":"09:00","endTime":"12:00","name":"Transfer to Monteverde","lat":10.26,"lng":-84.88,"address":"Monteverde, Puntarenas Province, Costa Rica","rating":4.8,"phone":"N/A","description":"Travel to Monteverde, known for its cloud forests and stunning biodiversity."},{"id":12,"day":6,"startTime":"14:00","endTime":"17:00","name":"Monteverde Cloud Forest Exploration","lat":10.26,"lng":-84.88,"address":"Monteverde Cloud Forest Reserve, Monteverde, Costa Rica","rating":4.7,"phone":"N/A","description":"Explore the famous Monteverde Cloud Forest, renowned for its unique flora and fauna."},{"id":13,"day":7,"startTime":"09:00","endTime":"12:00","name":"Departure from Monteverde to Juan Santamaría International Airport (SJO)","lat":10,"lng":-84.25,"address":"Monteverde, Puntarenas Province, Costa Rica","rating":4.5,"phone":"N/A","description":"Travel from Monteverde to the airport for your departure flight."}]'
        // );

        const cleaned = Array.isArray(parsed)
          ? parsed.map((place: any) => ({
              ...place,
              lat: Number(place.lat),
              lng: Number(place.lng),
            }))
          : [];

        setPlaces(cleaned as Place[]);
      } catch (_err) {
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    },
    [trimmedPrompt]
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row h-[80vh] gap-4">
        {/* Google Map */}
        <MapView
          places={places}
          setSelectedPlace={setSelectedPlace}
          hoveredPlaceId={hoveredPlaceId}
        />

        {/* Travel Plan / Chat */}
        <div className="md:w-1/2 w-full flex flex-col bg-white p-4 rounded-xl shadow-md overflow-y-auto">
          {!submitted && (
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your travel preferences..."
                className="w-full p-2 border rounded-lg"
              />
            </form>
          )}

          {loading && (
            <h1 className="text-2xl font-bold mb-4">Loading travel plan...</h1>
          )}
          {!loading && !!places.length && (
            <h1 className="text-2xl font-bold mb-4">{trimmedPrompt}</h1>
          )}
          <TravelPlan
            places={places}
            setSelectedPlace={setSelectedPlace}
            prompt={prompt}
            loading={loading}
            setHoveredPlaceId={setHoveredPlaceId}
          />

          {/* Move input to bottom after submit */}
          {submitted && (
            <form onSubmit={handleSubmit} className="mt-4 border-t pt-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Add more details..."
                className="w-full p-2 border rounded-lg"
              />
            </form>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPlace && (
        <PlaceDetailsModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </ProtectedRoute>
  );
}
