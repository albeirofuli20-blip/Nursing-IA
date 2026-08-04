import { useState, useEffect, useCallback } from "react";

export function useFavorites(key) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`nm_fav_${key}`);
      if (stored) setFavorites(JSON.parse(stored));
    } catch { /* noop */ }
  }, [key]);

  const toggle = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(`nm_fav_${key}`, JSON.stringify(next));
      return next;
    });
  }, [key]);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}