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
      <div className="flex flex-1 bg-bg-secondary border border-bg-tertiary focus-within:border-accent transition-colors">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Riot Name"
          className="flex-1 px-4 py-3 bg-transparent outline-none text-text-primary placeholder:text-text-secondary"
        />
        <span className="px-2 self-center text-text-secondary font-mono">#</span>
        <input
          value={tag}
          onChange={e => setTag(e.target.value)}
          placeholder="TAG"
          maxLength={5}
          className="w-24 px-3 py-3 bg-transparent outline-none text-text-primary placeholder:text-text-secondary font-mono uppercase"
        />
      </div>
      <select
        value={region}
        onChange={e => setRegion(e.target.value)}
        className="bg-bg-secondary border border-bg-tertiary px-3 py-3 outline-none focus:border-accent transition-colors"
      >
        {REGIONS.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-accent hover:bg-accent-hover transition-colors px-6 py-3 font-bold uppercase tracking-widest text-white clip-angled-sm"
      >
        Search
      </button>
    </form>
  );
}
