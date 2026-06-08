"use client";

import { startTransition, useEffect, useState } from "react";
import clsx from "clsx";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBarChartBoxLine,
  RiLock2Line,
  RiWallet3Line,
} from "react-icons/ri";

type HeroCard = {
  title: string;
  description: string;
};

type HeroVisual = {
  topLeft: string;
  topRight: string;
  radar: string;
  radarValue: string;
  alert: string;
  alertValue: string;
  flow: string;
  flowValue: string;
};

type HeroCardDeckProps = {
  cards: HeroCard[];
  visual: HeroVisual;
};

const cardThemes = [
  {
    frame:
      "border-cyan-300/25 bg-[linear-gradient(145deg,rgba(20,30,50,0.95),rgba(4,12,22,0.92))] shadow-[0_24px_100px_rgba(34,211,238,0.18)]",
    iconWrap: "border-cyan-300/30 bg-cyan-300/12 text-cyan-100",
    glow: "from-cyan-300/30 via-sky-300/18 to-transparent",
  },
  {
    frame:
      "border-amber-300/25 bg-[linear-gradient(145deg,rgba(56,33,11,0.94),rgba(19,12,5,0.94))] shadow-[0_24px_100px_rgba(251,191,36,0.16)]",
    iconWrap: "border-amber-300/30 bg-amber-300/12 text-amber-50",
    glow: "from-amber-300/28 via-orange-300/16 to-transparent",
  },
  {
    frame:
      "border-fuchsia-300/25 bg-[linear-gradient(145deg,rgba(44,14,42,0.94),rgba(15,7,25,0.95))] shadow-[0_24px_100px_rgba(232,121,249,0.16)]",
    iconWrap: "border-fuchsia-300/30 bg-fuchsia-300/12 text-fuchsia-50",
    glow: "from-fuchsia-300/26 via-violet-300/16 to-transparent",
  },
] as const;

const cardIcons = [RiWallet3Line, RiBarChartBoxLine, RiLock2Line] as const;

export function HeroCardDeck({ cards, visual }: HeroCardDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = cards.length;

  useEffect(() => {
    if (total < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % total);
      });
    }, 4800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [total]);

  const showCard = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const stepCard = (direction: -1 | 1) => {
    startTransition(() => {
      setActiveIndex((current) => (current + direction + total) % total);
    });
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[560px] items-center justify-center">
      <div className="hero-orbit hero-orbit-delay absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/14" />
      <div className="hero-orbit absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/12" />
      <div className="hero-grid-pulse absolute inset-10 rounded-[2.5rem] border border-white/6 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.12),_transparent_58%)] blur-2xl" />

      <div className="relative aspect-square w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,20,0.96)_0%,rgba(7,8,17,0.98)_100%)] shadow-[0_40px_140px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:52px_52px] opacity-25" />
        <div className="absolute inset-x-10 top-10 flex items-center justify-between text-xs uppercase tracking-[0.34em] text-white/55">
          <span>{visual.topLeft}</span>
          <span>{visual.topRight}</span>
        </div>

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/12 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),_rgba(59,130,246,0.04)_58%,_transparent_74%)]" />
        <div className="absolute right-[10%] top-[16%] h-24 w-24 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="absolute left-[12%] top-[24%] h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[18%] right-[18%] h-24 w-24 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="absolute inset-x-6 bottom-6 top-20 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="hero-float rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-cyan-100 backdrop-blur-xl">
              <div className="mb-1 text-xs uppercase tracking-[0.28em] text-cyan-100/70">
                {visual.radar}
              </div>
              <div className="text-2xl font-semibold">{visual.radarValue}</div>
            </div>

            <div className="hero-float hero-float-delay rounded-2xl border border-amber-200/15 bg-amber-200/10 px-4 py-3 text-amber-50 backdrop-blur-xl">
              <div className="mb-1 text-xs uppercase tracking-[0.28em] text-amber-50/70">
                {visual.alert}
              </div>
              <div className="text-2xl font-semibold">{visual.alertValue}</div>
            </div>
          </div>

          <div className="relative mx-auto flex h-[20rem] w-full max-w-[24rem] items-center justify-center [perspective:2200px]">
            {cards.map((card, index) => {
              const Icon = cardIcons[index] ?? RiWallet3Line;
              const theme = cardThemes[index % cardThemes.length];
              const offset = (index - activeIndex + total) % total;
              const placement =
                offset === 0
                  ? {
                      translateX: "0%",
                      translateY: "0%",
                      rotate: "0deg",
                      scale: 1,
                      opacity: 1,
                      zIndex: 40,
                    }
                  : offset === 1
                    ? {
                        translateX: "17%",
                        translateY: "7%",
                        rotate: "11deg",
                        scale: 0.93,
                        opacity: 0.72,
                        zIndex: 30,
                      }
                    : {
                        translateX: "-17%",
                        translateY: "9%",
                        rotate: "-11deg",
                        scale: 0.88,
                        opacity: 0.56,
                        zIndex: 20,
                      };

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => showCard(index)}
                  className={clsx(
                    "absolute inset-x-0 mx-auto w-full max-w-[20rem] overflow-hidden rounded-[1.8rem] border p-5 text-left backdrop-blur-2xl transition duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                    theme.frame,
                    offset === 0 ? "cursor-default" : "cursor-pointer",
                  )}
                  style={{
                    transform: `translate3d(${placement.translateX}, ${placement.translateY}, 0) rotate(${placement.rotate}) scale(${placement.scale})`,
                    opacity: placement.opacity,
                    zIndex: placement.zIndex,
                  }}
                  aria-pressed={offset === 0}
                >
                  <div
                    className={clsx(
                      "absolute inset-0 bg-gradient-to-br opacity-90",
                      theme.glow,
                    )}
                  />
                  <div className="absolute inset-[1px] rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
                  <div className="relative z-10">
                    <div
                      className={clsx(
                        "mb-5 inline-flex rounded-2xl border p-3",
                        theme.iconWrap,
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <h2 className="max-w-[12rem] text-lg font-semibold tracking-tight text-white">
                      {card.title}
                    </h2>
                    <p className="mt-3 max-w-[14rem] text-sm leading-6 text-white/74">
                      {card.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/45">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{offset === 0 ? "active" : "stacked"}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="hero-float rounded-2xl border border-emerald-300/15 bg-emerald-300/10 px-4 py-3 text-emerald-50 backdrop-blur-xl">
              <div className="mb-1 text-xs uppercase tracking-[0.28em] text-emerald-100/70">
                {visual.flow}
              </div>
              <div className="text-2xl font-semibold">{visual.flowValue}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepCard(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 backdrop-blur-xl transition hover:bg-white/12"
                aria-label="Previous card"
              >
                <RiArrowLeftSLine className="size-5" />
              </button>
              {cards.map((card, index) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => showCard(index)}
                  className={clsx(
                    "h-2.5 rounded-full transition-all",
                    index === activeIndex ? "w-10 bg-white" : "w-2.5 bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`Show card ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => stepCard(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 backdrop-blur-xl transition hover:bg-white/12"
                aria-label="Next card"
              >
                <RiArrowRightSLine className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
