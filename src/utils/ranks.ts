import { MOCK_TIERS } from '@/mock/data';

export function rankNameByTier(tier: number): string {
  return MOCK_TIERS.find(t => t.tier === tier)?.tierName ?? 'Unranked';
}

export function rankIconByTier(tier: number, large = false): string {
  const t = MOCK_TIERS.find(x => x.tier === tier);
  return large ? (t?.largeIcon ?? '') : (t?.smallIcon ?? '');
}
