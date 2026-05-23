import { rankIconByTier, rankNameByTier } from '@/utils/ranks';

interface Props {
  tier: number;
  large?: boolean;
  className?: string;
}

export default function RankIcon({ tier, large, className = '' }: Props) {
  const src = rankIconByTier(tier, large);
  const alt = rankNameByTier(tier);
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={e => ((e.target as HTMLImageElement).style.opacity = '0.3')}
    />
  );
}
