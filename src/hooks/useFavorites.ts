import { useEffect, useState, useCallback } from 'react';

export interface Favorite {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  rankTier: number;
  rankName: string;
  rr: number;
  lastActivity: string;
}

const STORAGE_KEY = 'valtrq.favorites';

function read(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

function write(list: Favorite[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('valtrq:favorites-changed'));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(read);

  useEffect(() => {
    const sync = () => setFavorites(read());
    window.addEventListener('valtrq:favorites-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('valtrq:favorites-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isFavorite = useCallback((puuid: string) => favorites.some(f => f.puuid === puuid), [favorites]);

  const add = useCallback((fav: Favorite) => {
    const list = read().filter(f => f.puuid !== fav.puuid);
    write([fav, ...list].slice(0, 20));
  }, []);

  const remove = useCallback((puuid: string) => {
    write(read().filter(f => f.puuid !== puuid));
  }, []);

  const toggle = useCallback((fav: Favorite) => {
    const list = read();
    if (list.some(f => f.puuid === fav.puuid)) {
      write(list.filter(f => f.puuid !== fav.puuid));
    } else {
      write([fav, ...list].slice(0, 20));
    }
  }, []);

  return { favorites, isFavorite, add, remove, toggle };
}
