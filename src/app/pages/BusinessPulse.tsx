import React, { useState, useId } from "react";
import {
  DollarSign, Briefcase, Users, ShieldAlert,
  Target, HeartHandshake, HardHat, UserCheck, Truck,
  TrendingUp, TrendingDown, Minus, AlertCircle, ChevronRight, Info, ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell, Area, AreaChart
} from "recharts";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

// ─── Data ────────────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Jan', revenue: 17,   type: 'actual',   cumulativeTarget: 18,  cumulativeActual: 17,    cumulativeForecast: null  },
  { month: 'Feb', revenue: 18,   type: 'actual',   cumulativeTarget: 36,  cumulativeActual: 35,    cumulativeForecast: null  },
  { month: 'Mar', revenue: 18.4, type: 'actual',   cumulativeTarget: 54,  cumulativeActual: 53.4,  cumulativeForecast: 53.4  },
  { month: 'Apr', revenue: 23,   type: 'forecast', cumulativeTarget: 76,  cumulativeActual: null,  cumulativeForecast: 76.4  },
  { month: 'May', revenue: 25,   type: 'forecast', cumulativeTarget: 100, cumulativeActual: null,  cumulativeForecast: 101.4 },
  { month: 'Jun', revenue: 27,   type: 'forecast', cumulativeTarget: 126, cumulativeActual: null,  cumulativeForecast: 128.4 },
  { month: 'Jul', revenue: 22,   type: 'forecast', cumulativeTarget: 150, cumulativeActual: null,  cumulativeForecast: 150.4 },
  { month: 'Aug', revenue: 20,   type: 'forecast', cumulativeTarget: 172, cumulativeActual: null,  cumulativeForecast: 170.4 },
  { month: 'Sep', revenue: 26,   type: 'forecast', cumulativeTarget: 198, cumulativeActual: null,  cumulativeForecast: 196.4 },
  { month: 'Oct', revenue: 28,   type: 'forecast', cumulativeTarget: 226, cumulativeActual: null,  cumulativeForecast: 224.4 },
  { month: 'Nov', revenue: 30,   type: 'forecast', cumulativeTarget: 256, cumulativeActual: null,  cumulativeForecast: 254.4 },
  { month: 'Dec', revenue: 32,   type: 'forecast', cumulativeTarget: 288, cumulativeActual: null,  cumulativeForecast: 286.4 },
];

const momData = {
  revenue:    [15.2, 16.1, 17.0, 18.0, 18.4, 18.0],
  spi:        [0.91, 0.90, 0.89, 0.88, 0.87, 0.86],
  utilization:[87, 85, 84, 84, 83, 82],
  csat:       [84, 85, 85, 86, 87, 88],
  saudization:[24.1, 24.5, 25.0, 25.6, 26.2, 27.0],
  deployment: [81, 80, 79, 80, 79, 78],
};

// ─── Smart Tooltip ───────────────────────────────────────────────────────────

const SmartTooltip = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
  <TooltipPrimitive.Provider delayDuration={200}>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={6}
          className="z-50 max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-xl animate-in fade-in-0 zoom-in-95"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

// ─── Sub-components ──────────────────────────────────────────────────────────

const ragConfig = {
  red:   { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", text: "text-red-700", label: "At Risk", glow: "shadow-red-100" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", text: "text-amber-700", label: "Watch", glow: "shadow-amber-100" },
  green: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-700", label: "On Track", glow: "shadow-emerald-100" },
};

let sparkIdCounter = 0;

const Spark = ({ data, color = "#3b82f6", height = 22 }: { data: number[]; color?: string; height?: number }) => {
  const [gradId] = useState(() => `spark-grad-${++sparkIdCounter}`);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 56, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  const areaPath = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ") + ` L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 4) - 2;
        return i === data.length - 1
          ? <circle key={i} cx={x} cy={y} r={2.5} fill="white" stroke={color} strokeWidth={1.5} />
          : null;
      })}
    </svg>
  );
};

const TrendIndicator = ({ value, positive, suffix = "" }: { value: string; positive: boolean; suffix?: string }) => (
  <span className={`inline-flex items-center gap-0.5 text-[10px] ${positive ? "text-emerald-600" : "text-red-500"}`} style={{ fontWeight: 700 }}>
    {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
    {value}{suffix}
  </span>
);

interface PulseCardProps {
  title: string;
  icon: React.ElementType;
  status: "red" | "amber" | "green";
  value: string;
  label: string;
  target?: string;
  mom: string;
  momPositive: boolean;
  yoy: string;
  yoyPositive: boolean;
  sparkData: number[];
  sparkColor?: string;
  metric2Label?: string;
  metric2Value?: string;
  metric2Variance?: string;
  metric2Positive?: boolean;
  insight?: string;
  tooltipDetails?: { label: string; value: string }[];
}

const PulseCard = ({
  title, icon: Icon, status, value, label, target,
  mom, momPositive, yoy, yoyPositive,
  sparkData, sparkColor = "#3b82f6",
  metric2Label, metric2Value, metric2Variance, metric2Positive,
  insight, tooltipDetails
}: PulseCardProps) => {
  const rag = ragConfig[status];
  return (
    <SmartTooltip content={
      <div className="space-y-1.5">
        <div className="text-[11px]" style={{ fontWeight: 700, color: "#1e293b" }}>{title}</div>
        {tooltipDetails?.map((d, i) => (
          <div key={i} className="flex justify-between gap-4 text-[10px]">
            <span className="text-slate-500">{d.label}</span>
            <span className="text-slate-800" style={{ fontWeight: 600 }}>{d.value}</span>
          </div>
        ))}
        {insight && <div className="text-[10px] text-blue-600 pt-1 border-t border-slate-100" style={{ fontWeight: 500 }}>{insight}</div>}
      </div>
    }>
      <div className={`bg-white rounded-lg border shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all cursor-default group ${status === 'red' ? 'border-red-200/60' : status === 'amber' ? 'border-amber-200/60' : 'border-slate-200'}`}>
        <div className="px-3 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${rag.bg}`}>
              <Icon className={`w-3 h-3 ${rag.text}`} />
            </div>
            <span className="text-[11px] text-slate-600 truncate" style={{ fontWeight: 600 }}>{title}</span>
          </div>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] tracking-wide ${rag.bg} ${rag.text}`} style={{ fontWeight: 700 }}>
            <div className={`w-1.5 h-1.5 rounded-full ${rag.dot} ${status === 'red' ? 'animate-pulse' : ''}`} />
            {rag.label}
          </div>
        </div>
        <div className="px-3 pb-2.5 flex flex-col gap-1.5">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[22px] text-slate-900 tracking-tight leading-none" style={{ fontWeight: 800 }}>{value}</div>
              <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-widest" style={{ fontWeight: 600 }}>{label}</div>
              {target && <div className="text-[9px] text-slate-400 mt-px" style={{ fontWeight: 500 }}>Target: {target}</div>}
            </div>
            <Spark data={sparkData} color={sparkColor} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50">
              <span className="text-[8px] text-slate-400 uppercase tracking-wider" style={{ fontWeight: 700 }}>MoM</span>
              <TrendIndicator value={mom} positive={momPositive} />
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50">
              <span className="text-[8px] text-slate-400 uppercase tracking-wider" style={{ fontWeight: 700 }}>YoY</span>
              <TrendIndicator value={yoy} positive={yoyPositive} />
            </div>
          </div>
          {metric2Label && metric2Value && (
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 truncate mr-1" style={{ fontWeight: 500 }}>{metric2Label}</span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] text-slate-700" style={{ fontWeight: 700 }}>{metric2Value}</span>
                {metric2Variance && (
                  <span className={`text-[9px] ${metric2Positive !== false ? "text-emerald-600" : "text-red-500"}`} style={{ fontWeight: 700 }}>
                    {metric2Variance}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SmartTooltip>
  );
};

// HSEQ Card
interface HseqMetric { label: string; value: string; target: string; mom: string; ok: boolean; pct: number; }
const HseqCard = ({ metrics }: { metrics: HseqMetric[] }) => (
  <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all h-full">
    <div className="px-3 py-1.5 flex justify-between items-center">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-emerald-50">
          <HardHat className="w-3 h-3 text-emerald-700" />
        </div>
        <span className="text-[11px] text-slate-600" style={{ fontWeight: 600 }}>HSEQ Performance</span>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] tracking-wide bg-emerald-50 text-emerald-700" style={{ fontWeight: 700 }}>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        On Track
      </div>
    </div>
    <div className="px-2.5 pb-2.5 grid grid-cols-2 gap-1.5 flex-1">
      {metrics.map((m, i) => (
        <SmartTooltip key={i} content={
          <div className="text-[10px] space-y-1">
            <div style={{ fontWeight: 700 }} className="text-slate-800">{m.label}</div>
            <div className="text-slate-500">Current: {m.value} • Target: {m.target}</div>
            <div className={m.ok ? "text-emerald-600" : "text-red-500"} style={{ fontWeight: 600 }}>{m.ok ? "Within acceptable range" : "Requires attention"}</div>
          </div>
        }>
          <div className={`rounded-md border px-2 py-1.5 flex flex-col gap-0.5 cursor-default transition-colors hover:bg-slate-50 ${m.ok ? 'border-slate-100 bg-slate-50/50' : 'border-red-100 bg-red-50/30'}`}>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 leading-tight" style={{ fontWeight: 700 }}>{m.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-base text-slate-800 leading-none" style={{ fontWeight: 800 }}>{m.value}</span>
              <span className={`text-[9px] ${m.ok ? "text-emerald-600" : "text-red-500"}`} style={{ fontWeight: 700 }}>{m.mom}</span>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-100 mt-0.5">
              <div
                className={`h-1 rounded-full transition-all ${m.ok ? "bg-emerald-500" : "bg-red-500"}`}
                style={{ width: `${m.pct}%` }}
              />
            </div>
          </div>
        </SmartTooltip>
      ))}
    </div>
  </div>
);

// Risk item
const RiskItem = ({ title, exposure, severity, impact }: { title: string; exposure: string; severity: string; impact: string }) => (
  <SmartTooltip content={
    <div className="text-[10px] space-y-1">
      <div style={{ fontWeight: 700 }} className="text-slate-800">{title}</div>
      <div className="text-slate-500">Financial Exposure: {exposure}</div>
      <div className="text-slate-500">Impact: {impact}</div>
      <div className={`${severity === "Critical" ? "text-red-600" : "text-amber-600"}`} style={{ fontWeight: 600 }}>
        {severity === "Critical" ? "Immediate action required" : "Monitor closely"}
      </div>
    </div>
  }>
    <div className={`px-2.5 py-2 rounded-md border flex justify-between items-center cursor-default transition-all hover:translate-x-0.5 ${severity === "Critical" ? "border-red-200/80 bg-red-50/40 hover:bg-red-50" : "border-slate-100 bg-slate-50/50 hover:bg-slate-100"}`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-1 h-5 rounded-full flex-shrink-0 ${severity === "Critical" ? "bg-red-500" : "bg-amber-400"}`} />
        <div className="min-w-0">
          <span className="text-[11px] text-slate-800 truncate block" style={{ fontWeight: 600 }}>{title}</span>
          <span className="text-[9px] text-slate-400" style={{ fontWeight: 500 }}>{impact}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-1">
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${severity === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`} style={{ fontWeight: 700 }}>
          {severity}
        </span>
        <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded" style={{ fontWeight: 700 }}>{exposure}</span>
      </div>
    </div>
  </SmartTooltip>
);

// Custom Chart Tooltip with RAG
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const revenueEntry = payload.find((p: any) => p.dataKey === "revenue");
  const isActual = revenueEntry?.payload?.type === "actual";
  const cumTarget = payload.find((p: any) => p.dataKey === "cumulativeTarget")?.value;
  const cumActual = payload.find((p: any) => p.dataKey === "cumulativeActual")?.value;
  const cumForecast = payload.find((p: any) => p.dataKey === "cumulativeForecast")?.value;
  const cumValue = cumActual ?? cumForecast;

  let ragStatus: "green" | "amber" | "red" = "green";
  if (cumTarget && cumValue) {
    const gap = ((cumValue - cumTarget) / cumTarget) * 100;
    if (gap < -5) ragStatus = "red";
    else if (gap < 0) ragStatus = "amber";
  }
  const rag = ragConfig[ragStatus];

  return (
    <div className={`backdrop-blur-sm border rounded-lg shadow-xl p-2.5 text-[10px] ${rag.bg} ${rag.border}`}>
      <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-200/60">
        <span className="text-slate-700" style={{ fontWeight: 700 }}>{label} 2026</span>
        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] ${rag.bg} ${rag.text}`} style={{ fontWeight: 700 }}>
          <span className={`w-1.5 h-1.5 rounded-full ${rag.dot}`} />
          {rag.label}
        </span>
      </div>
      {payload.map((p: any, i: number) => {
        if (p.value === null || p.value === undefined) return null;
        return (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-slate-500">{p.name}:</span>
            <span className="text-slate-800" style={{ fontWeight: 700 }}>${p.value}M</span>
          </div>
        );
      })}
      {cumTarget && cumValue && (
        <div className={`mt-1 pt-1 border-t border-slate-200/60 text-[9px] ${rag.text}`} style={{ fontWeight: 600 }}>
          {cumValue >= cumTarget
            ? `On track: +$${(cumValue - cumTarget).toFixed(1)}M above target`
            : `Gap: -$${(cumTarget - cumValue).toFixed(1)}M behind target (${(((cumValue - cumTarget) / cumTarget) * 100).toFixed(1)}%)`}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BusinessPulse() {
  const hseqMetrics: HseqMetric[] = [
    { label: "LTI (Lost Time Injuries)", value: "0",   target: "0",    mom: "▼ 0 MoM",   ok: true,  pct: 100 },
    { label: "Near Miss Reports",        value: "7",   target: "≤5",   mom: "▲ +2 MoM",  ok: false, pct: 40  },
    { label: "Safety Observation Rate",  value: "94%", target: "≥90%", mom: "▲ +1% MoM", ok: true,  pct: 94  },
    { label: "Quality NCRs Open",        value: "3",   target: "0",    mom: "▼ -1 MoM",  ok: true,  pct: 70  },
  ];

  return (
    <div className="flex flex-col gap-2 max-w-[1600px] mx-auto px-4 py-2.5">

      {/* ── Row 1: Core 4 Pillars ── */}
      <div className="grid grid-cols-4 gap-2">
        <PulseCard
          title="Financial Performance"
          icon={DollarSign} status="amber"
          value="$53.4M" label="YTD Revenue" target="$54M"
          mom="2.2%" momPositive={false}
          yoy="8.1%" yoyPositive={true}
          sparkData={momData.revenue} sparkColor="#3b82f6"
          metric2Label="Gross Margin" metric2Value="26.8%" metric2Variance="+2.1%" metric2Positive={true}
          insight="Revenue gap widening — Q2 pipeline acceleration needed to close $17.6M H1 shortfall."
          tooltipDetails={[
            { label: "YTD Actual", value: "$53.4M" },
            { label: "YTD Target", value: "$54.0M" },
            { label: "Variance", value: "-$0.6M (-1.1%)" },
            { label: "Gross Margin", value: "26.8% (+2.1% vs Forecast)" },
            { label: "Cash Collection", value: "$48.2M (90.3% of revenue)" },
          ]}
        />
        <PulseCard
          title="Project Execution"
          icon={Briefcase} status="red"
          value="0.86" label="Schedule Perf. Index" target="≥ 0.95"
          mom="0.01" momPositive={false}
          yoy="0.04" yoyPositive={false}
          sparkData={momData.spi} sparkColor="#ef4444"
          metric2Label="Projects Delayed" metric2Value="12%" metric2Variance="Critical" metric2Positive={false}
          insight="SPI declining for 6 consecutive months. 3 mega-projects driving 70% of schedule variance."
          tooltipDetails={[
            { label: "Active Projects", value: "47" },
            { label: "On Schedule", value: "36 (77%)" },
            { label: "Delayed", value: "6 (12%)" },
            { label: "CPI", value: "0.94" },
            { label: "At-Risk Revenue", value: "$8.2M" },
          ]}
        />
        <PulseCard
          title="Resource & Operations"
          icon={Users} status="amber"
          value="82%" label="Billable Utilization" target="85%"
          mom="1%" momPositive={false}
          yoy="3%" yoyPositive={false}
          sparkData={momData.utilization} sparkColor="#f59e0b"
          metric2Label="DSO" metric2Value="140 Days" metric2Variance="+12d" metric2Positive={false}
          insight="Bench headcount growing. 142 undeployed staff costing ~$1.8M/month in idle capacity."
          tooltipDetails={[
            { label: "Total Headcount", value: "1,247" },
            { label: "Billable", value: "1,022 (82%)" },
            { label: "Bench", value: "142" },
            { label: "DSO", value: "140 days (+12 vs target)" },
            { label: "Idle Cost/Month", value: "~$1.8M" },
            { label: "Deployment Rate", value: "78% (503 of 645)" },
          ]}
        />
        <PulseCard
          title="Client Experience"
          icon={HeartHandshake} status="green"
          value="88%" label="Client Satisfaction" target="85%"
          mom="1%" momPositive={true}
          yoy="3%" yoyPositive={true}
          sparkData={momData.csat} sparkColor="#22c55e"
          metric2Label="Active Escalations" metric2Value="2" metric2Variance="-1" metric2Positive={true}
          insight="Strong upward trend. NPS improved to 42 (+5 QoQ). Two escalations on track for resolution."
          tooltipDetails={[
            { label: "CSAT Score", value: "88% (+1% MoM)" },
            { label: "NPS", value: "42 (+5 QoQ)" },
            { label: "Active Escalations", value: "2 (down from 3)" },
            { label: "Repeat Business Rate", value: "73%" },
            { label: "Response Time (Avg)", value: "4.2 hours" },
          ]}
        />
      </div>

      {/* ── Row 2: Operational KPIs ── */}
      <div className="grid grid-cols-3 gap-2">
        <PulseCard
          title="Saudization (Nitaqat)"
          icon={UserCheck} status="amber"
          value="27.0%" label="Saudi Nationals" target="30% (Green Band)"
          mom="0.8%" momPositive={true}
          yoy="2.9%" yoyPositive={true}
          sparkData={momData.saudization} sparkColor="#8b5cf6"
          metric2Label="Compliance Band" metric2Value="Yellow" metric2Variance="→ Green" metric2Positive={false}
          insight="3% gap to Green band. Current hiring pipeline adds 2.1% by Q3 — needs acceleration."
          tooltipDetails={[
            { label: "Current Rate", value: "27.0%" },
            { label: "Green Threshold", value: "30.0%" },
            { label: "Gap", value: "-3.0% (42 hires needed)" },
            { label: "Pipeline", value: "28 candidates in process" },
          ]}
        />
        <div className="col-span-2">
          <HseqCard metrics={hseqMetrics} />
        </div>
      </div>

      {/* ── Row 3: Revenue Chart + Critical Risks ── */}
      <div className="grid grid-cols-3 gap-2">

        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="px-3 py-1.5 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-50">
                <Target className="w-3 h-3 text-blue-700" />
              </div>
              <span className="text-[11px] text-slate-600" style={{ fontWeight: 600 }}>Revenue vs. Target Trajectory</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-slate-400" style={{ fontWeight: 600 }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-700 inline-block" /> Actual</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-300 inline-block" /> Forecast</span>
              <span className="flex items-center gap-1"><span className="w-4 border-t-[1.5px] border-dashed border-amber-500 inline-block" /> Cum. Target</span>
              <span className="flex items-center gap-1"><span className="w-4 border-t-[1.5px] border-blue-800 inline-block" /> Cum. Actual</span>
              <span className="flex items-center gap-1"><span className="w-4 border-t-[1.5px] border-dashed border-sky-400 inline-block" /> Cum. Forecast</span>
            </div>
          </div>

          <div className="px-2 min-w-0" style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData} margin={{ top: 6, right: 50, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis
                  yAxisId="left"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${v}M`}
                  domain={[0, 40]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${v}M`}
                  domain={[0, 320]}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Bar yAxisId="left" dataKey="revenue" name="Monthly Revenue" radius={[4, 4, 0, 0]} barSize={24}>
                  {revenueData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.type === "actual" ? "#1d4ed8" : "#93c5fd"} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right" type="monotone" dataKey="cumulativeTarget"
                  name="Cum. Target" stroke="#f59e0b" strokeWidth={2}
                  strokeDasharray="6 4" dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
                />
                <Line
                  yAxisId="right" type="monotone" dataKey="cumulativeActual"
                  name="Cum. Actual" stroke="#1e3a8a" strokeWidth={2.5}
                  dot={{ r: 3, fill: "#1e3a8a", strokeWidth: 0 }} connectNulls={false}
                />
                <Line
                  yAxisId="right" type="monotone" dataKey="cumulativeForecast"
                  name="Cum. Forecast" stroke="#38bdf8" strokeWidth={2}
                  strokeDasharray="4 3" dot={{ r: 3, fill: "#38bdf8", strokeWidth: 0 }} connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Analytics stat row */}
          <div className="px-2.5 py-2 flex gap-1.5">
            {[
              { label: "YTD Actual", value: "$53.4M", sub: "vs $54M Target", highlight: false },
              { label: "MoM Δ", value: "-$0.4M", sub: "Mar vs Feb", highlight: true },
              { label: "YoY Growth", value: "+8.1%", sub: "vs Prior Year", highlight: false },
              { label: "H1 Forecast", value: "$123.4M", sub: "vs $141M Target", highlight: true },
            ].map((s, i) => (
              <div key={i} className={`flex-1 rounded-md px-2 py-1.5 border ${s.highlight ? "border-amber-200 bg-amber-50/60" : "border-slate-100 bg-slate-50/60"}`}>
                <div className={`text-[8px] uppercase tracking-wider ${s.highlight ? "text-amber-600" : "text-slate-400"}`} style={{ fontWeight: 700 }}>{s.label}</div>
                <div className={`text-sm leading-tight ${s.highlight ? "text-amber-800" : "text-slate-800"}`} style={{ fontWeight: 800 }}>{s.value}</div>
                <div className={`text-[9px] ${s.highlight ? "text-amber-500" : "text-slate-400"}`} style={{ fontWeight: 500 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Risks */}
        <div className="bg-white rounded-lg border border-red-200/40 shadow-sm flex flex-col">
          <div className="px-3 py-1.5 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-red-50">
                <ShieldAlert className="w-3 h-3 text-red-600" />
              </div>
              <span className="text-[11px] text-slate-600" style={{ fontWeight: 600 }}>Critical Risks Radar</span>
            </div>
            <span className="text-[8px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ fontWeight: 700 }}>4 Active</span>
          </div>

          <div className="px-2.5 flex-1 flex flex-col gap-1.5">
            <RiskItem title="Resource Bottlenecks Q2"      exposure="$2.4M"    severity="Critical" impact="Delays on 3 mega-projects" />
            <RiskItem title="Client Approval Delays"       exposure="$1.2M"    severity="Major"    impact="4 projects pending sign-off" />
            <RiskItem title="Margin Leakage — Fixed Price" exposure="$0.8M"    severity="Major"    impact="Scope creep on 2 contracts" />
            <RiskItem title="Saudization Compliance Gap"   exposure="Band Risk" severity="Major"   impact="3% gap to Green band" />
          </div>

          <div className="px-2.5 pb-2.5 pt-1.5 flex gap-1.5">
            <div className="flex-1 rounded-md px-2 py-1.5 border border-red-200 bg-red-50/60">
              <div className="text-[8px] uppercase tracking-wider text-red-600" style={{ fontWeight: 700 }}>Total Exposure</div>
              <div className="text-sm text-red-800 leading-tight" style={{ fontWeight: 800 }}>$4.4M</div>
              <div className="text-[9px] text-red-500" style={{ fontWeight: 500 }}>+110% vs last mo.</div>
            </div>
            <div className="flex-1 rounded-md px-2 py-1.5 border border-slate-100 bg-slate-50/60">
              <div className="text-[8px] uppercase tracking-wider text-slate-400" style={{ fontWeight: 700 }}>Risks YoY</div>
              <div className="text-sm text-slate-800 leading-tight" style={{ fontWeight: 800 }}>+2</div>
              <div className="text-[9px] text-slate-400" style={{ fontWeight: 500 }}>vs same period</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}