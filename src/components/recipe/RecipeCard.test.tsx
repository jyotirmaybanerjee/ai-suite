import { Recipe } from '@/types/types';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import RecipeCard from './RecipeCard';
import React from 'react';

const mockRecipe: Recipe = {
    id: '1',
    firebaseId: 'abc123',
    name: 'Test Recipe',
    image: 'https://example.com/image.jpg',
    ingredients: ['Eggs', 'Milk', 'Flour'],
    instructions: 'Mix ingredients and cook.',
};

describe('RecipeCard', () => {
    it('renders recipe details', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onFavorite={jest.fn()}
                onUnfavorite={jest.fn()}
            />
        );
        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText(/Eggs, Milk, Flour/)).toBeInTheDocument();
        expect(screen.getByText('Mix ingredients and cook.')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', mockRecipe.image);
    });

    it('shows "❤️ Favorite" button when not favorite', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onFavorite={jest.fn()}
                onUnfavorite={jest.fn()}
            />
        );
        expect(screen.getByRole('button')).toHaveTextContent('❤️ Favorite');
    });

    it('shows "Remove" button when favorite', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={true}
                onFavorite={jest.fn()}
                onUnfavorite={jest.fn()}
            />
        );
        expect(screen.getByRole('button')).toHaveTextContent('Remove');
    });

    it('calls onFavorite when button is clicked and not favorite', () => {
        const onFavorite = jest.fn();
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onFavorite={onFavorite}
                onUnfavorite={jest.fn()}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onFavorite).toHaveBeenCalledWith(mockRecipe);
    });

    it('calls onUnfavorite when button is clicked and is favorite', () => {
        const onUnfavorite = jest.fn();
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={true}
                onFavorite={jest.fn()}
                onUnfavorite={onUnfavorite}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onUnfavorite).toHaveBeenCalledWith('abc123');
    });

    it('does not call onUnfavorite if recipe.firebaseId is missing', () => {
        const onUnfavorite = jest.fn();
        const recipeWithoutId = { ...mockRecipe, firebaseId: undefined as any };
        render(
            <RecipeCard
                recipe={recipeWithoutId}
                isFavorite={true}
                onFavorite={jest.fn()}
                onUnfavorite={onUnfavorite}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onUnfavorite).not.toHaveBeenCalled();
    });
});