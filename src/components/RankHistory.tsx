import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts';
import type { PlayerMMR, RankHistoryEntry } from '@/types';
import { formatDate } from '@/utils/format';

interface Props { mmr: PlayerMMR }

export default function RankHistory({ mmr }: Props) {
  const data = mmr.rankHistory.map((e, i) => ({ ...e, idx: i + 1 }));
  return (
    <div className="bg-bg-secondary border border-bg-tertiary p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="uppercase tracking-widest text-sm font-bold text-text-secondary">RR History</h2>
        <div className="text-xs text-text-secondary">Last 15 matches</div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#243040" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="idx" stroke="#8b978f" tick={{ fontSize: 11 }} />
            <YAxis stroke="#8b978f" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rr"
              stroke="#ff4655"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 7, fill: '#ff4655', stroke: '#ece8e1', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  const fill = payload.won ? '#17b36a' : '#e5484d';
  return <Dot cx={cx} cy={cy} r={4} fill={fill} stroke="none" />;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const e: RankHistoryEntry = payload[0].payload;
  return (
    <div className="bg-bg-primary border border-bg-tertiary p-3 text-sm">
      <div className="font-bold uppercase tracking-wide text-xs text-text-secondary">{formatDate(e.date)}</div>
      <div className="mt-1">{e.map}</div>
      <div className="font-mono text-text-secondary">{e.kda}</div>
      <div className={`font-bold ${e.won ? 'text-win' : 'text-loss'}`}>
        {e.rrChange > 0 ? '+' : ''}{e.rrChange} RR
      </div>
    </div>
  );
}
