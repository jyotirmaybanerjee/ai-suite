import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import PlaceDetailsModal from './PlaceDetailsModal';

const mockPlace = {
    name: 'Test Place',
    address: '123 Test St',
    phone: '123-456-7890',
    rating: 4.5,
    description: 'A nice place to visit.',
};

describe('PlaceDetailsModal', () => {
    it('renders nothing when place is null', () => {
        const { container } = render(<PlaceDetailsModal place={null} onClose={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders place details when place is provided', () => {
        render(<PlaceDetailsModal place={mockPlace} onClose={jest.fn()} />);
        expect(screen.getByText('Test Place')).toBeInTheDocument();
        expect(screen.getByText('123 Test St')).toBeInTheDocument();
        expect(screen.getByText('📞 123-456-7890')).toBeInTheDocument();
        expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
        expect(screen.getByText('A nice place to visit.')).toBeInTheDocument();
    });

    it('does not render phone or description if not provided', () => {
        const placeWithoutPhoneDesc = {
            ...mockPlace,
            phone: undefined,
            description: undefined,
        };
        render(<PlaceDetailsModal place={placeWithoutPhoneDesc} onClose={jest.fn()} />);
        expect(screen.queryByText(/📞/)).not.toBeInTheDocument();
        expect(screen.queryByText('A nice place to visit.')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = jest.fn();
        render(<PlaceDetailsModal place={mockPlace} onClose={onClose} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});