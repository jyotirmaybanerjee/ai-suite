import { Recipe } from '@/types/types';
import React, { memo, useCallback, useMemo } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavorite: (recipe: Recipe) => void;
  onUnfavorite: (firebaseId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onFavorite,
  onUnfavorite,
}) => {
  const handleButtonClick = useCallback(() => {
    // If the card is in the favorites list, remove it.
    if (isFavorite && recipe.firebaseId) {
      onUnfavorite(recipe.firebaseId);
    }
    // Otherwise, add it to favorites.
    else {
      onFavorite(recipe);
    }
  }, [isFavorite, onFavorite, onUnfavorite, recipe]);

  const buttonText = useMemo(
    () => (isFavorite ? 'Remove' : '❤️ Favorite'),
    [isFavorite]
  );
  const buttonClasses = useMemo(
    () =>
      isFavorite
        ? 'bg-red-500 text-white hover:bg-red-600'
        : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500',
    [isFavorite]
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Ingredients:</span>{' '}
          {recipe.ingredients.join(', ')}
        </p>
        <p className="text-sm text-gray-700">{recipe.instructions}</p>
      </div>
      <div className="p-4 border-t border-gray-200 text-right">
        <button
          onClick={handleButtonClick}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${buttonClasses}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default memo(RecipeCard);
