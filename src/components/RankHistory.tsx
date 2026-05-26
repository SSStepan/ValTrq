import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot, ReferenceLine } from 'recharts';
import type { PlayerMMR, RankHistoryEntry } from '@/types';
import { formatDate } from '@/utils/format';

interface Props { mmr: PlayerMMR }

export default function RankHistory({ mmr }: Props) {
  const data = mmr.rankHistory.map((e, i) => ({ ...e, idx: i + 1 }));
  const totalRR = data.reduce((acc, e) => acc + e.rrChange, 0);
  const wins = data.filter(d => d.won).length;
  const losses = data.length - wins;

  return (
    <section className="bg-bg-secondary border border-border">
      <div className="flex flex-wrap items-end justify-between gap-4 p-5 pb-2">
        <div>
          <div className="text-[10px] uppercase tracking-brutal text-text-muted">Trend</div>
          <h2 className="font-display text-3xl uppercase tracking-brutal leading-none mt-1">
            RR History
          </h2>
        </div>
        <div className="flex items-stretch gap-px bg-border">
          <Pill label="Net" value={`${totalRR > 0 ? '+' : ''}${totalRR}`} tone={totalRR >= 0 ? 'win' : 'loss'} />
          <Pill label="Wins" value={String(wins)} tone="win" />
          <Pill label="Losses" value={String(losses)} tone="loss" />
          <Pill label="Window" value={`${data.length}`} />
        </div>
      </div>

      <div className="h-64 px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#1c2733" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="idx" stroke="#5a6670" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#1c2733' }} />
            <YAxis stroke="#5a6670" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#1c2733' }} width={40} />
            <ReferenceLine y={mmr.currentRR - totalRR} stroke="#2a3845" strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ff4655', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Line
              type="monotone"
              dataKey="rr"
              stroke="#ff4655"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 7, fill: '#ff4655', stroke: '#ece8e1', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Pill({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'win' | 'loss' }) {
  const color = tone === 'win' ? 'text-win' : tone === 'loss' ? 'text-loss' : 'text-text-primary';
  return (
    <div className="bg-bg-secondary px-4 py-2 text-center min-w-[78px]">
      <div className="text-[10px] uppercase tracking-brutal text-text-muted">{label}</div>
      <div className={`font-mono text-lg font-bold leading-tight ${color}`}>{value}</div>
    </div>
  );
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  const fill = payload.won ? '#1fc879' : '#ff4655';
  return <Dot cx={cx} cy={cy} r={4} fill={fill} stroke="#0b0f14" strokeWidth={1.5} />;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const e: RankHistoryEntry = payload[0].payload;
  return (
    <div className="bg-bg-primary border border-border p-3 text-sm shadow-xl">
      <div className="font-bold uppercase tracking-brutal text-[10px] text-text-muted">
        {formatDate(e.date)}
      </div>
      <div className="mt-1 font-display uppercase tracking-brutal text-base">{e.map}</div>
      <div className="font-mono text-text-secondary text-xs">{e.kda}</div>
      <div className={`font-mono font-bold mt-1 ${e.won ? 'text-win' : 'text-loss'}`}>
        {e.rrChange > 0 ? '+' : ''}{e.rrChange} RR
      </div>
    </div>
  );
}
