"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBarChartBoxLine,
  RiBrainLine,
  RiExchangeFundsLine,
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

type HeroDeckCopy = {
  active: string;
  stacked: string;
  previousCard: string;
  nextCard: string;
  showCard: string;
};

type HeroCardDeckProps = {
  cards: HeroCard[];
  visual: HeroVisual;
  copy: HeroDeckCopy;
};

const cardHighlights = [
  ["Деньги", "Переводы"],
  ["AI", "Чеки"],
  ["Крипта", "Курсы"],
  ["Налоги", "Отчеты"],
  ["Защита", "Доступ"],
] as const;

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
  {
    frame:
      "border-sky-300/25 bg-[linear-gradient(145deg,rgba(10,34,48,0.96),rgba(5,16,26,0.94))] shadow-[0_24px_100px_rgba(56,189,248,0.16)]",
    iconWrap: "border-sky-300/30 bg-sky-300/12 text-sky-50",
    glow: "from-sky-300/26 via-cyan-300/16 to-transparent",
  },
  {
    frame:
      "border-lime-300/25 bg-[linear-gradient(145deg,rgba(26,40,14,0.95),rgba(11,19,8,0.94))] shadow-[0_24px_100px_rgba(163,230,53,0.14)]",
    iconWrap: "border-lime-300/30 bg-lime-300/12 text-lime-50",
    glow: "from-lime-300/24 via-emerald-300/14 to-transparent",
  },
] as const;

const cardIcons = [
  RiWallet3Line,
  RiBrainLine,
  RiExchangeFundsLine,
  RiBarChartBoxLine,
  RiLock2Line,
] as const;

function getSignedOffset(index: number, activeIndex: number, total: number) {
  const rawOffset = (index - activeIndex + total) % total;
  const half = Math.floor(total / 2);

  return rawOffset > half ? rawOffset - total : rawOffset;
}

function getCardPlacement(offset: number) {
  if (offset === 0) {
    return {
      translateX: "0%",
      translateY: "0%",
      translateZ: "72px",
      rotateY: "0deg",
      rotateZ: "0deg",
      scale: 1,
      opacity: 1,
      zIndex: 60,
      pointerEvents: "auto" as const,
    };
  }

  if (offset === -1) {
    return {
      translateX: "-24%",
      translateY: "8%",
      translateZ: "8px",
      rotateY: "34deg",
      rotateZ: "-10deg",
      scale: 0.92,
      opacity: 0.84,
      zIndex: 45,
      pointerEvents: "auto" as const,
    };
  }

  if (offset === 1) {
    return {
      translateX: "24%",
      translateY: "8%",
      translateZ: "8px",
      rotateY: "-34deg",
      rotateZ: "10deg",
      scale: 0.92,
      opacity: 0.84,
      zIndex: 45,
      pointerEvents: "auto" as const,
    };
  }

  if (offset === -2) {
    return {
      translateX: "-39%",
      translateY: "18%",
      translateZ: "-58px",
      rotateY: "42deg",
      rotateZ: "-14deg",
      scale: 0.82,
      opacity: 0.48,
      zIndex: 28,
      pointerEvents: "none" as const,
    };
  }

  if (offset === 2) {
    return {
      translateX: "39%",
      translateY: "18%",
      translateZ: "-58px",
      rotateY: "-42deg",
      rotateZ: "14deg",
      scale: 0.82,
      opacity: 0.48,
      zIndex: 28,
      pointerEvents: "none" as const,
    };
  }

  return {
    translateX: offset < 0 ? "-48%" : "48%",
    translateY: "24%",
    translateZ: "-120px",
    rotateY: offset < 0 ? "48deg" : "-48deg",
    rotateZ: offset < 0 ? "-16deg" : "16deg",
    scale: 0.74,
    opacity: 0.16,
    zIndex: 10,
    pointerEvents: "none" as const,
  };
}

function renderCardPattern(index: number) {
  switch (index % 5) {
    case 0:
      return (
        <>
          <div className="absolute right-3 top-7 h-16 w-16 rounded-full border border-white/16" />
          <div className="absolute right-7 top-11 h-8 w-8 rounded-full border border-cyan-100/18" />
          <div className="absolute right-3 top-5 h-2 w-2 rounded-full bg-cyan-100/50 shadow-[0_0_12px_rgba(125,211,252,0.45)]" />
        </>
      );
    case 1:
      return (
        <>
          <div className="absolute right-4 top-8 h-14 w-14 rounded-full border border-white/16" />
          <div className="absolute right-11 top-15 h-5 w-5 rounded-full border border-fuchsia-100/18 bg-fuchsia-100/10" />
          <div className="absolute right-10 top-14 h-2.5 w-2.5 rounded-full bg-fuchsia-100/40 shadow-[0_0_10px_rgba(244,114,182,0.32)]" />
          <div className="absolute right-9 top-11 h-px w-7 bg-gradient-to-r from-transparent via-fuchsia-100/24 to-transparent" />
          <div className="absolute right-5 top-6 h-2 w-2 rounded-full bg-fuchsia-100/50 shadow-[0_0_12px_rgba(244,114,182,0.38)]" />
        </>
      );
    case 2:
      return (
        <>
          <div className="absolute right-4 top-7 h-14 w-14 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] border border-white/16" />
          <div className="absolute right-[2.25rem] top-[3.05rem] h-3 w-3 rounded-full bg-amber-100/35" />
          <div className="absolute right-[2.7rem] top-[2.55rem] h-5 w-px bg-gradient-to-b from-transparent via-amber-100/22 to-transparent" />
          <div className="absolute right-5 top-6 h-2 w-2 rounded-full bg-amber-100/45 shadow-[0_0_12px_rgba(253,230,138,0.38)]" />
        </>
      );
    case 3:
      return (
        <>
          <div className="absolute right-4 top-8 h-14 w-14 rotate-45 border border-white/16" />
          <div className="absolute right-8 top-12 h-6 w-6 rotate-45 border border-sky-100/18" />
          <div className="absolute right-5 top-6 h-2 w-2 rounded-full bg-sky-100/50 shadow-[0_0_12px_rgba(125,211,252,0.4)]" />
        </>
      );
    default:
      return (
        <>
          <div className="absolute right-4 top-8 h-14 w-14 rotate-45 border border-white/16" />
          <div className="absolute right-9 top-13 h-4 w-4 rotate-45 border border-lime-100/18 bg-lime-100/10" />
          <div className="absolute right-14 top-9 h-2 w-2 rounded-full bg-lime-100/42 shadow-[0_0_10px_rgba(190,242,100,0.34)]" />
          </>
      );
  }
}

export function HeroCardDeck({ cards, visual, copy }: HeroCardDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoSlideEnabled, setIsAutoSlideEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = cards.length;
  const deckRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragTriggeredRef = useRef(false);
  const suppressClickRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    if (total < 2 || !isAutoSlideEnabled) {
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
  }, [isAutoSlideEnabled, total]);

  const disableAutoSlide = useCallback(() => {
    setIsAutoSlideEnabled(false);
  }, []);

  const showCard = useCallback((index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
    disableAutoSlide();
  }, [disableAutoSlide]);

  const stepCard = useCallback((direction: -1 | 1) => {
    startTransition(() => {
      setActiveIndex((current) => (current + direction + total) % total);
    });
    disableAutoSlide();
  }, [disableAutoSlide, total]);

  const handleCardClick = (index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    showCard(index);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) {
      return;
    }

    dragStartXRef.current = event.clientX;
    dragTriggeredRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null || dragTriggeredRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;

    if (Math.abs(deltaX) < 56) {
      return;
    }

    dragTriggeredRef.current = true;
    suppressClickRef.current = true;
    stepCard(deltaX < 0 ? 1 : -1);
  };

  const handlePointerEnd = () => {
    dragStartXRef.current = null;
    dragTriggeredRef.current = false;
    setIsDragging(false);

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  useEffect(() => {
    const element = deckRef.current;

    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (total < 2) {
        return;
      }

      const dominantDelta =
        Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

      event.preventDefault();
      event.stopPropagation();

      if (Math.abs(dominantDelta) < 4) {
        return;
      }

      disableAutoSlide();

      if (wheelLockRef.current) {
        return;
      }

      wheelDeltaRef.current += dominantDelta;

      if (Math.abs(wheelDeltaRef.current) < 44) {
        return;
      }

      wheelLockRef.current = true;
      stepCard(wheelDeltaRef.current > 0 ? 1 : -1);
      wheelDeltaRef.current = 0;

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 260);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [disableAutoSlide, stepCard, total]);

  const highlightedIndex = hoveredIndex ?? activeIndex;

  return (
    <div className="relative mx-auto flex w-full max-w-[560px] min-w-0 items-center justify-center">
      <div className="hero-orbit hero-orbit-delay absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/14" />
      <div className="hero-orbit absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/12" />
      <div className="hero-grid-pulse absolute inset-10 rounded-[2.5rem] border border-white/6 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.12),_transparent_58%)] blur-2xl" />
      <div
        className="pointer-events-none absolute inset-x-10 top-1/2 h-[20rem] -translate-y-1/2 rounded-full opacity-90 blur-[72px] transition-[background,transform,opacity] duration-500 ease-out"
        style={{
          background:
            highlightedIndex % cardThemes.length === 0
              ? "radial-gradient(circle, rgba(34,211,238,0.26) 0%, rgba(14,116,144,0.16) 42%, transparent 76%)"
              : highlightedIndex % cardThemes.length === 1
                ? "radial-gradient(circle, rgba(251,191,36,0.24) 0%, rgba(249,115,22,0.14) 42%, transparent 76%)"
                : highlightedIndex % cardThemes.length === 2
                  ? "radial-gradient(circle, rgba(232,121,249,0.24) 0%, rgba(168,85,247,0.14) 42%, transparent 76%)"
                  : highlightedIndex % cardThemes.length === 3
                    ? "radial-gradient(circle, rgba(56,189,248,0.24) 0%, rgba(34,211,238,0.14) 42%, transparent 76%)"
                    : "radial-gradient(circle, rgba(163,230,53,0.22) 0%, rgba(16,185,129,0.14) 42%, transparent 76%)",
          transform: `translateY(-50%) scale(${hoveredIndex === null ? 1 : 1.06})`,
        }}
      />

      <div className="relative aspect-square w-full max-w-[34rem] min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,20,0.96)_0%,rgba(7,8,17,0.98)_100%)] shadow-[0_40px_140px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:52px_52px] opacity-25" />
        <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[0.62rem] tracking-[0.1em] text-white/54">
          <span>{visual.topLeft}</span>
          <span>{visual.topRight}</span>
        </div>

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/12 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),_rgba(59,130,246,0.04)_58%,_transparent_74%)]" />
        <div className="absolute right-[10%] top-[16%] h-24 w-24 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="absolute left-[12%] top-[24%] h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[18%] right-[18%] h-24 w-24 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute inset-x-5 bottom-5 top-16 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="hero-float rounded-[1rem] border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-cyan-100 backdrop-blur-xl">
              <div className="mb-0.5 text-[0.62rem] tracking-[0.08em] text-cyan-100/70">
                {visual.radar}
              </div>
              <div className="text-[0.98rem] font-semibold sm:text-[1.05rem]">{visual.radarValue}</div>
            </div>

            <div className="hero-float hero-float-delay rounded-[1rem] border border-amber-200/15 bg-amber-200/10 px-3 py-2 text-amber-50 backdrop-blur-xl">
              <div className="mb-0.5 text-[0.62rem] tracking-[0.08em] text-amber-50/70">
                {visual.alert}
              </div>
              <div className="text-[0.98rem] font-semibold sm:text-[1.05rem]">{visual.alertValue}</div>
            </div>
          </div>

          <div
            ref={deckRef}
          className={clsx(
              "relative mx-auto flex h-[18.5rem] w-full max-w-[24.5rem] touch-pan-y overscroll-none items-center justify-center px-2 [perspective:2200px] sm:px-3",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
          >
            {cards.map((card, index) => {
              const Icon = cardIcons[index] ?? RiWallet3Line;
              const theme = cardThemes[index % cardThemes.length];
              const offset = getSignedOffset(index, activeIndex, total);
              const placement = getCardPlacement(offset);
              const floatClass =
                index % 5 === 0
                  ? "hero-deck-card-float"
                  : index % 5 === 1
                    ? "hero-deck-card-float hero-deck-card-float-delay-1"
                    : index % 5 === 2
                      ? "hero-deck-card-float hero-deck-card-float-delay-2"
                      : index % 5 === 3
                        ? "hero-deck-card-float hero-deck-card-float-delay-3"
                        : "hero-deck-card-float hero-deck-card-float-delay-4";

              return (
                <div
                  key={card.title}
                  className={clsx(
                    "absolute inset-x-0 mx-auto w-full max-w-[20.75rem]",
                    floatClass,
                  )}
                  style={{
                    opacity: placement.opacity,
                    zIndex: placement.zIndex,
                    pointerEvents: placement.pointerEvents,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleCardClick(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
                    className={clsx(
                      "relative w-full min-h-[12.75rem] overflow-hidden rounded-[1.65rem] border px-4 py-3.5 text-left backdrop-blur-2xl transition duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 sm:px-5",
                      theme.frame,
                      isDragging
                        ? "cursor-grabbing"
                        : offset === 0
                          ? "cursor-grab"
                          : "cursor-pointer",
                    )}
                    style={{
                      transform: `translate3d(${placement.translateX}, ${placement.translateY}, ${placement.translateZ}) rotateY(${placement.rotateY}) rotateZ(${placement.rotateZ}) scale(${placement.scale})`,
                    }}
                    aria-pressed={offset === 0}
                    >
                    <div
                      className={clsx(
                        "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-300",
                        theme.glow,
                      )}
                    />
                    <div
                      className={clsx(
                        "absolute -inset-6 -z-10 rounded-[2rem] opacity-0 blur-3xl transition duration-500",
                        offset === 0 || hoveredIndex === index ? "opacity-100" : "opacity-0",
                        theme.glow,
                      )}
                    />
                    <div className="absolute inset-[1px] rounded-[1.55rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
                    <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_62%)]" />
                    <div className="absolute inset-y-3 right-3 w-16 opacity-45 sm:w-20">
                      {renderCardPattern(index)}
                    </div>
                    <div className="absolute inset-x-4 top-[3.8rem] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="relative z-10 min-w-0 pr-10 sm:pr-14">
                      <div
                        className={clsx(
                          "mb-3 inline-flex rounded-[1rem] border p-2.5",
                          theme.iconWrap,
                        )}
                      >
                        <Icon className="size-[1.125rem]" />
                      </div>
                      <h2 className="text-[1rem] font-semibold leading-5 tracking-tight text-white text-balance">
                        {card.title}
                      </h2>
                      <p className="mt-2 text-[0.8rem] leading-[1.35rem] text-white/76 text-pretty">
                        {card.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cardHighlights[index % cardHighlights.length].map((highlight) => (
                          <span
                            key={`${card.title}-${highlight}`}
                            className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.14em] text-white/68"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[0.56rem] uppercase tracking-[0.16em] text-white/45">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{Math.abs(offset) <= 1 ? copy.active : copy.stacked}</span>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="hero-float rounded-[1rem] border border-emerald-300/15 bg-emerald-300/10 px-3 py-2 text-emerald-50 backdrop-blur-xl">
              <div className="mb-0.5 text-[0.62rem] tracking-[0.08em] text-emerald-100/70">
                {visual.flow}
              </div>
              <div className="text-[0.98rem] font-semibold sm:text-[1.05rem]">{visual.flowValue}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepCard(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 backdrop-blur-xl transition hover:bg-white/12"
                aria-label={copy.previousCard}
              >
                <RiArrowLeftSLine className="size-[1.125rem]" />
              </button>
              {cards.map((card, index) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => showCard(index)}
                  className={clsx(
                    "h-2 rounded-full transition-all",
                    index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`${copy.showCard} ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => stepCard(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 backdrop-blur-xl transition hover:bg-white/12"
                aria-label={copy.nextCard}
              >
                <RiArrowRightSLine className="size-[1.125rem]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
