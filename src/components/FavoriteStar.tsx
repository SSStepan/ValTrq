import { useFavorites, type Favorite } from '@/hooks/useFavorites';

export default function FavoriteStar({ fav }: { fav: Favorite }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(fav.puuid);
  return (
    <button
      type="button"
      onClick={() => toggle(fav)}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`group p-2 transition-colors ${active ? 'text-draw' : 'text-text-secondary hover:text-draw'}`}
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 transition-transform group-hover:scale-110" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />
      </svg>
    </button>
  );
}
