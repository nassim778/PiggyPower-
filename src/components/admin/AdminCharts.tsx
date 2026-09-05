"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BLUE = "#1e63b6";
const BLUE_SOFT = "#6aa3de";
const ASH = "#8a8a8a";
const STATUS_COLORS: Record<string, string> = {
  paid: "#2f7d4a",
  pending: "#b45309",
  other: "#6b7280",
  stripe: "#1e63b6",
  paypal: "#0070ba",
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function ChartTooltip({
  active,
  payload,
  label,
  moneyMode,
}: {
  active?: boolean;
  payload?: { value?: number; name?: string }[];
  label?: string;
  moneyMode?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded border border-rule bg-bloom px-3 py-2 text-xs shadow-sm">
      {label && <p className="mb-1 text-ash">{label}</p>}
      <p className="font-semibold text-ink">
        {moneyMode ? money(Number(value)) : value}
      </p>
    </div>
  );
}

export function RevenueAreaChart({
  data,
}: {
  data: { label: string; revenueCents: number; orders: number }[];
}) {
  const empty = data.every((d) => d.revenueCents === 0);
  return (
    <div className="h-64 w-full">
      {empty ? (
        <EmptyChart label="No paid revenue in the last 14 days" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity={0.28} />
                <stop offset="100%" stopColor={BLUE} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: ASH, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: ASH, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
            />
            <Tooltip content={<ChartTooltip moneyMode />} />
            <Area
              type="monotone"
              dataKey="revenueCents"
              stroke={BLUE}
              strokeWidth={2}
              fill="url(#revFill)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function StatusDonut({
  data,
}: {
  data: { name: string; value: number; key: string }[];
}) {
  if (!data.length) return <EmptyChart label="No orders yet" />;
  const total = data.reduce((n, d) => n + d.value, 0);
  return (
    <div className="flex h-64 flex-col items-center sm:flex-row sm:items-stretch">
      <div className="relative h-48 w-full sm:h-full sm:flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={STATUS_COLORS[entry.key] || BLUE_SOFT}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-ink">{total}</p>
          <p className="text-[11px] uppercase tracking-wide text-ash">Orders</p>
        </div>
      </div>
      <ul className="mt-2 w-full space-y-2 px-2 sm:mt-0 sm:w-36 sm:self-center">
        {data.map((d) => (
          <li key={d.key} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-ash">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: STATUS_COLORS[d.key] || BLUE_SOFT }}
              />
              {d.name}
            </span>
            <span className="font-semibold text-ink">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProviderBars({
  data,
}: {
  data: { name: string; value: number; key: string }[];
}) {
  if (!data.length) return <EmptyChart label="No paid payments yet" />;
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: ASH, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: ASH, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || BLUE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopProductsBars({
  data,
}: {
  data: { name: string; qty: number; revenueCents: number }[];
}) {
  if (!data.length) return <EmptyChart label="No product sales yet" />;
  const rows = data.map((d) => ({
    ...d,
    short: d.name.length > 22 ? `${d.name.slice(0, 20)}…` : d.name,
  }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={rows}
          margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: ASH, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={120}
            tick={{ fill: ASH, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const row = payload[0].payload as {
                name: string;
                qty: number;
                revenueCents: number;
              };
              return (
                <div className="max-w-xs rounded border border-rule bg-bloom px-3 py-2 text-xs shadow-sm">
                  <p className="font-semibold text-ink">{row.name}</p>
                  <p className="mt-1 text-ash">
                    {row.qty} sold · {money(row.revenueCents)}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="revenueCents" fill={BLUE} radius={[0, 6, 6, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded border border-dashed border-rule bg-mist/40 px-4 text-center text-sm text-ash">
      {label}
    </div>
  );
}
