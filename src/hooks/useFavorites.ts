import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

// Shared state for favorites across all hook instances
let listeners: Array<() => void> = [];
let favoritesSnapshot: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function getSnapshot() {
  return favoritesSnapshot;
}

function setFavorites(newFavorites: string[]) {
  favoritesSnapshot = newFavorites;
  localStorage.setItem('favorites', JSON.stringify(newFavorites));
  listeners.forEach(l => l());
}

export const useFavorites = () => {
  const favorites = useSyncExternalStore(subscribe, getSnapshot);

  const toggleFavorite = useCallback((carId: string) => {
    const current = getSnapshot();
    const newFavorites = current.includes(carId)
      ? current.filter((id) => id !== carId)
      : [...current, carId];
    setFavorites(newFavorites);
  }, []);

  const isFavorite = useCallback((carId: string) => favorites.includes(carId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};
