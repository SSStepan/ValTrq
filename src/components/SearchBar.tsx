import { useState, type FormEvent } from 'react';

interface Props {
  onSearch: (name: string, tag: string, region: string) => void;
  initialName?: string;
  initialTag?: string;
}

const REGIONS = [
  { value: 'eu', label: 'EU' },
  { value: 'na', label: 'NA' },
  { value: 'ap', label: 'AP' },
  { value: 'kr', label: 'KR' }
];

export default function SearchBar({ onSearch, initialName = '', initialTag = '' }: Props) {
  const [name, setName] = useState(initialName);
  const [tag, setTag] = useState(initialTag);
  const [region, setRegion] = useState('eu');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !tag.trim()) return;
    onSearch(name.trim(), tag.trim(), region);
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="flex flex-1 bg-bg-secondary border border-border focus-within:border-accent transition-colors group">
        <div className="flex items-center pl-4 text-text-muted group-focus-within:text-accent transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="square" />
          </svg>
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Riot Name"
          className="flex-1 px-3 py-4 bg-transparent outline-none text-text-primary placeholder:text-text-muted text-lg"
        />
        <span className="px-1 self-center text-text-muted font-mono text-xl">#</span>
        <input
          value={tag}
          onChange={e => setTag(e.target.value)}
          placeholder="TAG"
          maxLength={5}
          className="w-24 px-3 py-4 bg-transparent outline-none text-text-primary placeholder:text-text-muted font-mono uppercase text-lg"
        />
      </div>
      <div className="flex bg-bg-secondary border border-border">
        {REGIONS.map(r => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRegion(r.value)}
            className={`px-4 text-xs font-bold uppercase tracking-brutal transition-colors ${
              region === r.value
                ? 'bg-bg-elevated text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="group relative bg-accent hover:bg-accent-hi transition-colors px-8 py-4 font-display text-xl tracking-brutal text-white clip-tag overflow-hidden"
      >
        <span className="relative z-10">Search</span>
        <span className="absolute inset-y-0 right-0 w-1 bg-white/30" />
      </button>
    </form>
  );
}
