import axios from 'axios';

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';
const API_KEY = import.meta.env.VITE_RIOT_API_KEY ?? '';

export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export const riotClient = axios.create({
  headers: { 'X-Riot-Token': API_KEY }
});

export function regionToAccountHost(region: string): string {
  if (['na', 'br', 'latam'].includes(region)) return 'https://americas.api.riotgames.com';
  if (['kr', 'ap'].includes(region)) return 'https://asia.api.riotgames.com';
  return 'https://europe.api.riotgames.com';
}

export function regionToValHost(region: string): string {
  const map: Record<string, string> = {
    eu: 'https://eu.api.riotgames.com',
    na: 'https://na.api.riotgames.com',
    ap: 'https://ap.api.riotgames.com',
    kr: 'https://kr.api.riotgames.com',
    br: 'https://br.api.riotgames.com',
    latam: 'https://latam.api.riotgames.com'
  };
  return map[region] ?? map.eu;
}
