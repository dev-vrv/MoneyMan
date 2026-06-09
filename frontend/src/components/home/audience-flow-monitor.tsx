"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useState } from "react";

type AudienceFlowMonitorCopy = {
  eyebrow: string;
  title: string;
  status: string;
  stats: Array<{
    label: string;
    value: string;
    caption: string;
  }>;
  summaries: Array<{
    label: string;
    value: string;
  }>;
};

type AudienceFlowMonitorProps = {
  copy: AudienceFlowMonitorCopy;
};

type FlowChip = {
  id: string;
  label: string;
  tone: "positive" | "negative";
  left: string;
  top: string;
  driftX: number;
  driftY: number;
  duration: number;
};

type FlowState = {
  points: Array<{ x: number; y: number }>;
  linePath: string;
  areaPath: string;
  chips: FlowChip[];
};

const chartWidth = 420;
const chartHeight = 180;
const baseY = 110;
const topClamp = 34;
const bottomClamp = 146;
const chipAnchors = [2, 4, 7, 10] as const;
const pointCount = 12;
const cycleDurationMs = 3000;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  const [firstPoint, ...rest] = points;
  let path = `M${firstPoint.x} ${firstPoint.y}`;

  for (let index = 0; index < rest.length; index += 1) {
    const previous = points[index];
    const current = rest[index];
    const controlX = (previous.x + current.x) / 2;

    path += ` C${controlX} ${previous.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

function createFlowPoints(phase: number) {
  return Array.from({ length: pointCount }, (_, index) => {
    const x = (chartWidth / (pointCount - 1)) * index;
    const primaryWave = Math.sin(phase + index * 0.64) * 16;
    const secondaryWave = Math.cos(phase * 0.82 + index * 0.4) * 11;
    const noiseWave = Math.sin(phase * 1.57 + index * 1.18) * 7;
    const drift = (index - (pointCount - 1) / 2) * -1.1;
    const y = clamp(
      baseY + primaryWave + secondaryWave + noiseWave + drift,
      topClamp,
      bottomClamp,
    );

    return { x, y };
  });
}

function buildAreaPath(points: Array<{ x: number; y: number }>, linePath: string) {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${linePath} L${lastPoint.x} ${chartHeight} L${firstPoint.x} ${chartHeight} Z`;
}

function buildFlowState(phase: number): FlowState {
  const points = createFlowPoints(phase);
  const linePath = createSmoothPath(points);
  const areaPath = buildAreaPath(points, linePath);

  const chips = chipAnchors.map((anchor, chipIndex) => {
    const point = points[anchor];
    const previous = points[Math.max(anchor - 1, 0)];
    const delta = previous.y - point.y;
    const tone = delta >= 0 ? "positive" : "negative";
    const slopeImpact = Math.abs(delta) * 4.4;
    const driftImpact = Math.abs(baseY - point.y) * 1.75;
    const phaseImpact = Math.abs(Math.sin(phase + anchor * 0.9)) * 42;
    const magnitude = Math.max(
      6,
      Math.round(slopeImpact + driftImpact + phaseImpact),
    );
    const verticalOffset = tone === "positive"
      ? 22 + chipIndex * 2
      : -(22 + chipIndex * 2);
    const displayY = clamp(point.y - verticalOffset, 16, chartHeight - 16);
    const driftX = tone === "positive" ? 2 + chipIndex : -2 - chipIndex;
    const driftY = tone === "positive" ? -3 - chipIndex * 0.4 : 3 + chipIndex * 0.4;

    return {
      id: `${anchor}-${Math.round(point.y)}-${Math.round(phase * 100)}-${chipIndex}`,
      label: `${tone === "positive" ? "+" : "-"} ${magnitude}`,
      tone,
      left: `${(point.x / chartWidth) * 100}%`,
      top: `${(displayY / chartHeight) * 100}%`,
      driftX,
      driftY,
      duration: 2.4 + chipIndex * 0.28,
    };
  });

  return {
    points,
    linePath,
    areaPath,
    chips,
  };
}

export function AudienceFlowMonitor({ copy }: AudienceFlowMonitorProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId();
  const areaId = useId();
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState(0);
  const [flowState, setFlowState] = useState<FlowState>(() => buildFlowState(0));
  const [animatedChips, setAnimatedChips] = useState<FlowChip[]>([]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timeouts = flowState.chips.map((chip, index) =>
      window.setTimeout(() => {
        setAnimatedChips((current) => [...current, chip]);
      }, 520 + index * 360),
    );

    return () => {
      timeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [flowState, reduceMotion]);

  const visibleChips = reduceMotion ? flowState.chips : animatedChips;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextPhase = phase + 0.92;
      setAnimatedChips([]);
      setPhase(nextPhase);
      setFlowState(buildFlowState(nextPhase));
      setCycle((current) => current + 1);
    }, cycleDurationMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [phase, reduceMotion]);

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,16,18,0.96),rgba(7,11,14,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
              {copy.eyebrow}
            </div>
            <div className="mt-1 text-base font-semibold text-white">
              {copy.title}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/14 bg-emerald-300/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-emerald-100/82">
            <span className="audience-status-dot size-2 rounded-full bg-emerald-300" />
            {copy.status}
          </div>
        </div>

        <div className="relative mt-5 h-44 overflow-hidden rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
          <div className="absolute inset-x-0 top-[50%] h-px bg-white/8" />
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(148,163,184,0.2)" />
                <stop offset="42%" stopColor="rgba(167,243,208,0.68)" />
                <stop offset="100%" stopColor="rgba(110,231,183,0.92)" />
              </linearGradient>
              <linearGradient id={areaId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(110,231,183,0.16)" />
                <stop offset="100%" stopColor="rgba(110,231,183,0)" />
              </linearGradient>
            </defs>
            <motion.path
              initial={false}
              animate={{ d: flowState.areaPath, opacity: 1 }}
              fill={`url(#${areaId})`}
              opacity={0.88}
              transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              initial={false}
              animate={{ d: flowState.linePath }}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.86}
              transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              key={`scan-${cycle}`}
              d={flowState.linePath}
              fill="none"
              stroke="rgba(209,250,229,0.95)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.95, 0.18] }}
              transition={{ duration: 1.85, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <AnimatePresence mode="sync">
            {visibleChips.map((chip, index) => (
              <motion.div
                key={chip.id}
                initial={{ opacity: 0, y: chip.tone === "positive" ? 10 : -10, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  y: [0, chip.driftY, 0],
                  x: [0, chip.driftX, 0],
                  scale: [1, 1.02, 1],
                }}
                exit={{ opacity: 0, y: chip.tone === "positive" ? -10 : 10, scale: 0.96 }}
                transition={{
                  opacity: {
                    duration: 0.42,
                    delay: reduceMotion ? 0 : index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  x: {
                    duration: chip.duration,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: chip.duration + 0.35,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: chip.duration + 0.55,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-1 text-[0.78rem] font-semibold tracking-[-0.02em] ${
                  chip.tone === "positive"
                    ? "text-emerald-200 [text-shadow:0_0_18px_rgba(74,222,128,0.34)]"
                    : "text-rose-200 [text-shadow:0_0_18px_rgba(251,113,133,0.34)]"
                }`}
                style={{
                  left: chip.left,
                  top: chip.top,
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`size-1.5 rounded-full ${
                      chip.tone === "positive" ? "bg-emerald-300" : "bg-rose-300"
                    }`}
                  />
                  <span>{chip.label}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {copy.summaries.map((summary) => (
            <div
              key={summary.label}
              className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <div className="text-[0.64rem] uppercase tracking-[0.18em] text-white/40">
                {summary.label}
              </div>
              <div className="mt-1 text-sm font-medium text-white/84">
                {summary.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
