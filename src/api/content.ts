import axios from 'axios';
import { USE_MOCK, delay } from './client';
import { MOCK_AGENTS, MOCK_MAPS, MOCK_TIERS } from '@/mock/data';
import type { Agent, ValorantMap, CompetitiveTier } from '@/types';

const ASSET_BASE = 'https://valorant-api.com/v1';

export async function getAgents(): Promise<Agent[]> {
  if (USE_MOCK) return delay(MOCK_AGENTS, 200);
  const { data } = await axios.get(`${ASSET_BASE}/agents?isPlayableCharacter=true`);
  return data.data.map((a: any) => ({
    uuid: a.uuid,
    displayName: a.displayName,
    displayIcon: a.displayIcon,
    role: a.role?.displayName ?? ''
  }));
}

export async function getMaps(): Promise<ValorantMap[]> {
  if (USE_MOCK) return delay(MOCK_MAPS, 200);
  const { data } = await axios.get(`${ASSET_BASE}/maps`);
  return data.data.map((m: any) => ({
    uuid: m.uuid,
    displayName: m.displayName,
    splash: m.splash
  }));
}

export async function getTiers(): Promise<CompetitiveTier[]> {
  if (USE_MOCK) return delay(MOCK_TIERS, 200);
  const { data } = await axios.get(`${ASSET_BASE}/competitivetiers`);
  const latest = data.data[data.data.length - 1];
  return latest.tiers.map((t: any) => ({
    tier: t.tier,
    tierName: t.tierName,
    smallIcon: t.smallIcon,
    largeIcon: t.largeIcon
  }));
}
