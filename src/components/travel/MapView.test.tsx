import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapView } from './MapView';
import React from 'react';

jest.mock('@react-google-maps/api', () => ({
    LoadScript: ({ children }: any) => <div data-testid="load-script">{children}</div>,
    GoogleMap: ({ children, onLoad }: any) => {
        // Simulate GoogleMap onLoad
        onLoad && onLoad({ fitBounds: jest.fn() });
        return <div data-testid="google-map">{children}</div>;
    },
    Marker: ({ position, onClick, icon, ...props }: any) => (
        <div
            data-testid="marker"
            data-lat={position.lat}
            data-lng={position.lng}
            data-icon-scale={icon?.scale}
            onClick={onClick}
            {...props}s
        />
    ),
}));

// Mock window.google.maps
beforeAll(() => {
    // @ts-ignore
    global.window.google = {
        maps: {
            LatLngBounds: function () {
                return {
                    extend: jest.fn(),
                };
            },
            SymbolPath: {
                CIRCLE: 'CIRCLE',
            },
        },
    };
});

afterAll(() => {
    // @ts-ignore
    delete global.window.google;
});

describe('MapView', () => {
    const places = [
        { id: '1', lat: 10, lng: 20, name: 'Place 1' },
        { id: '2', lat: 30, lng: 40, name: 'Place 2' },
    ];

    const setSelectedPlace = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock geolocation to not call setUserLocation immediately
        const getCurrentPosition = jest.fn();
        // @ts-ignore
        global.navigator.geolocation = { getCurrentPosition };
        render(
            <MapView
                places={places}
                setSelectedPlace={setSelectedPlace}
                hoveredPlaceId={null}
            />
        );
        expect(screen.getByText(/loading map/i)).toBeInTheDocument();
    });

    it('renders map and markers after getting user location', async () => {
        // Mock geolocation
        // @ts-ignore
        global.navigator.geolocation = {
            getCurrentPosition: (success: any) =>
                success({ coords: { latitude: 1, longitude: 2 } }),
        };

        render(
            <MapView
                places={places}
                setSelectedPlace={setSelectedPlace}
                hoveredPlaceId={null}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-map')).toBeInTheDocument();
        });

        // Markers rendered
        const markers = screen.getAllByTestId('marker');
        expect(markers).toHaveLength(2);
        expect(markers[0]).toHaveAttribute('data-lat', '10');
        expect(markers[1]).toHaveAttribute('data-lng', '40');
    });

    it('calls setSelectedPlace when marker is clicked', async () => {
        // @ts-ignore
        global.navigator.geolocation = {
            getCurrentPosition: (success: any) =>
                success({ coords: { latitude: 1, longitude: 2 } }),
        };

        render(
            <MapView
                places={places}
                setSelectedPlace={setSelectedPlace}
                hoveredPlaceId={null}
            />
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('marker').length).toBe(2);
        });

        const markers = screen.getAllByTestId('marker');
        userEvent.click(markers[0]);
        expect(setSelectedPlace).toHaveBeenCalledWith(places[0]);
    });

    it('highlights marker when hoveredPlaceId matches', async () => {
        // @ts-ignore
        global.navigator.geolocation = {
            getCurrentPosition: (success: any) =>
                success({ coords: { latitude: 1, longitude: 2 } }),
        };

        render(
            <MapView
                places={places}
                setSelectedPlace={setSelectedPlace}
                hoveredPlaceId="2"
            />
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('marker').length).toBe(2);
        });

        const markers = screen.getAllByTestId('marker');
        // hoveredPlaceId === "2", so second marker should have scale 10
        expect(markers[1]).toHaveAttribute('data-icon-scale', '10');
        // first marker should have scale 6
        expect(markers[0]).toHaveAttribute('data-icon-scale', '6');
    });

    it('falls back to Paris if geolocation is not available', async () => {
        // @ts-ignore
        global.navigator.geolocation = undefined;

        render(
            <MapView
                places={places}
                setSelectedPlace={setSelectedPlace}
                hoveredPlaceId={null}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('google-map')).toBeInTheDocument();
        });
    });
});