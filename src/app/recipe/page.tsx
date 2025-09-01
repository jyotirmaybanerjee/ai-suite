'use client';
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatMessage from '@/components/recipe/ChatMessage';
import RecipeCard from '@/components/recipe/RecipeCard';
import { db } from '@/lib/firebase';
import { ChatMessageData, Recipe } from '@/types/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

export default function RecipePage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  // 1. Load favorites from Firestore on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteCollection = collection(db, 'favoriteRecipes');
        const querySnapshot = await getDocs(favoriteCollection);

        const favorites = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          firebaseId: doc.id,
        })) as Recipe[];

        setFavoriteRecipes(favorites);
      } catch (e) {
        console.error('Error fetching favorite recipes:', e);
      }
    };
    fetchFavorites();
  }, []);

  const handleSendMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!userInput.trim()) return;

      setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userInput }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        console.log(response);
        const aiResponse = await response.json();
        console.log('aiResponse- from api', aiResponse);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: aiResponse.message || 'Here are some recipes for you:',
            recipes: aiResponse.recipes,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Sorry, something went wrong. Please try again.',
          },
        ]);
      } finally {
        setIsLoading(false);
        setUserInput('');
      }
    },
    [userInput]
  );

  // 2. Save favorites to Firestore
  const handleFavorite = useCallback(async (recipe: Recipe) => {
    try {
      const favoriteCollection = collection(db, 'favoriteRecipes');

      // Check if the recipe already exists to avoid duplicates
      const q = query(favoriteCollection, where('id', '==', recipe.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add the new recipe to Firestore
        const docRef = await addDoc(favoriteCollection, recipe);

        // Update the local state with the new recipe and its Firestore ID
        setFavoriteRecipes((prev) => [
          ...prev,
          { ...recipe, firebaseId: docRef.id },
        ]);
        alert(`${recipe.name} added to your favorites!`);
      } else {
        alert(`${recipe.name} is already a favorite.`);
      }
    } catch (e) {
      console.error('Error adding document:', e);
      alert('Failed to save recipe. Please check the console.');
    }
  }, []);

  // Function to remove a recipe from favorites
  const handleUnfavorite = useCallback(async (firebaseId: string) => {
    try {
      const docRef = doc(db, 'favoriteRecipes', firebaseId);
      await deleteDoc(docRef);

      // Update the local state to remove the recipe
      setFavoriteRecipes((prev) =>
        prev.filter((recipe) => recipe.firebaseId !== firebaseId)
      );
      alert('Recipe removed from favorites.');
    } catch (e) {
      console.error('Error removing document:', e);
      alert('Failed to remove recipe. Please check the console.');
    }
  }, []);

  const favoriteIdSet = useMemo(
    () => new Set(favoriteRecipes.map((r) => r.id)),
    [favoriteRecipes]
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100 font-sans">
        <header className="p-4 text-center text-2xl font-bold bg-white shadow-md">
          Recipe Chat Assistant
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index}>
              <ChatMessage sender={msg.sender} text={msg.text} />
              {msg.recipes && msg.recipes.length > 0 && (
                <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                  {msg.recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favoriteIdSet.has(recipe.id)}
                      onFavorite={handleFavorite}
                      onUnfavorite={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Displaying favorite recipes fetched from Firestore */}
          {favoriteRecipes.length > 0 && (
            <div className="p-4 bg-yellow-100 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold mb-4 text-yellow-800">
                Favorite Recipes
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.firebaseId}
                    recipe={recipe}
                    isFavorite={true}
                    onFavorite={() => {}}
                    onUnfavorite={handleUnfavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-4 text-gray-500">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mb-4 mx-auto animate-spin"></div>
              Thinking...
            </div>
          )}
        </main>

        <footer className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              placeholder="Enter ingredients (e.g., chicken, basil, tomatoes)"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? '...' : 'Suggest'}
            </button>
          </form>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
