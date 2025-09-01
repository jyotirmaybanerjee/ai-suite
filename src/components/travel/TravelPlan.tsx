import React from 'react';
import { Place, TravelPlanProps } from '@/types/types';
import { useMemo } from 'react';

export const TravelPlan = ({
  places,
  setSelectedPlace,
  setHoveredPlaceId,
}: TravelPlanProps) => {
  // Memoize the grouped and sorted data to prevent re-computation
  const groupedAndSortedPlans = useMemo(() => {
    const groupedMap = new Map<number, Place[]>();

    places.forEach((place) => {
      const day = place.day;
      if (!groupedMap.has(day)) {
        groupedMap.set(day, []);
      }
      groupedMap.get(day)?.push(place);
    });

    const sortedDays = Array.from(groupedMap.keys()).sort((a, b) => a - b);

    return sortedDays.map((day) => {
      const dailyPlans = groupedMap.get(day)!;
      // Sort each day's plans by startTime
      dailyPlans.sort((a, b) => a.startTime.localeCompare(b.startTime));
      return dailyPlans;
    });
  }, [places]);

  if (groupedAndSortedPlans.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-5 p-5 bg-white shadow rounded-lg font-sans">
        No plans available.
      </div>
    );
  }

  return (
    <div className="font-sans max-w-4xl mx-auto my-5 p-5">
      {groupedAndSortedPlans.map((dayPlans, index) => (
        <div
          key={index}
          className="mb-8 p-6 border border-gray-200 rounded-lg shadow-md bg-white"
        >
          <h2 className="text-2xl font-semibold border-b-2 border-gray-400 pb-2 mb-4 text-gray-800">
            Day {dayPlans[0].day}
          </h2>
          <div>
            {dayPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col md:flex-row mb-4 p-4 bg-gray-50 rounded-md items-start"
                onClick={() => setSelectedPlace(plan)}
                onMouseEnter={() => setHoveredPlaceId(plan.id)}
                onMouseLeave={() => setHoveredPlaceId(null)}
              >
                <div className="font-bold text-lg text-blue-600 mb-2 md:mb-0 md:mr-6">
                  {plan.startTime} - {plan.endTime}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-700 m-0">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-gray-500 text-sm">
                    {plan.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
