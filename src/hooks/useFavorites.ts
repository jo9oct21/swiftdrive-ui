import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (carId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  return { favorites, toggleFavorite, isFavorite };
};
