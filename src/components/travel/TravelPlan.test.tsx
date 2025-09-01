import React from 'react';
import { Place } from '@/types/types';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { TravelPlan } from './TravelPlan';

const mockPlaces: Place[] = [
    {
        id: '1',
        name: 'Museum',
        description: 'A great museum.',
        day: 1,
        startTime: '09:00',
        endTime: '11:00',
    },
    {
        id: '2',
        name: 'Park',
        description: 'A beautiful park.',
        day: 1,
        startTime: '11:30',
        endTime: '13:00',
    },
    {
        id: '3',
        name: 'Beach',
        description: 'Sunny beach.',
        day: 2,
        startTime: '10:00',
        endTime: '12:00',
    },
];

describe('TravelPlan', () => {
    it('renders "No plans available." when places is empty', () => {
        render(
            <TravelPlan
                places={[]}
                setSelectedPlace={jest.fn()}
                setHoveredPlaceId={jest.fn()}
            />
        );
        expect(screen.getByText(/No plans available/i)).toBeInTheDocument();
    });

    it('groups and sorts plans by day and startTime', () => {
        render(
            <TravelPlan
                places={mockPlaces}
                setSelectedPlace={jest.fn()}
                setHoveredPlaceId={jest.fn()}
            />
        );
        expect(screen.getByText('Day 1')).toBeInTheDocument();
        expect(screen.getByText('Day 2')).toBeInTheDocument();
        // Check order of plans for day 1
        const museum = screen.getByText(/Museum/);
        const park = screen.getByText(/Park/);
        expect(museum.compareDocumentPosition(park) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('calls setSelectedPlace when a plan is clicked', () => {
        const setSelectedPlace = jest.fn();
        render(
            <TravelPlan
                places={mockPlaces}
                setSelectedPlace={setSelectedPlace}
                setHoveredPlaceId={jest.fn()}
            />
        );
        fireEvent.click(screen.getByText(/Museum/));
        expect(setSelectedPlace).toHaveBeenCalledWith(mockPlaces[0]);
    });

    it('calls setHoveredPlaceId on mouse enter and leave', () => {
        const setHoveredPlaceId = jest.fn();
        render(
            <TravelPlan
                places={mockPlaces}
                setSelectedPlace={jest.fn()}
                setHoveredPlaceId={setHoveredPlaceId}
            />
        );
        const museum = screen.getByText(/Museum/).closest('div');
        if (museum) {
            fireEvent.mouseEnter(museum);
            expect(setHoveredPlaceId).toHaveBeenCalledWith('1');
            fireEvent.mouseLeave(museum);
            expect(setHoveredPlaceId).toHaveBeenCalledWith(null);
        }
    });

    it('renders plan details correctly', () => {
        render(
            <TravelPlan
                places={mockPlaces}
                setSelectedPlace={jest.fn()}
                setHoveredPlaceId={jest.fn()}
            />
        );
        expect(screen.getByText('09:00 - 11:00')).toBeInTheDocument();
        expect(screen.getByText('A great museum.')).toBeInTheDocument();
        expect(screen.getByText('Sunny beach.')).toBeInTheDocument();
    });
});