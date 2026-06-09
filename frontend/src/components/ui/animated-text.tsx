"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type Config = {
  duration?: number;
  delayStep?: number;
  distance?: number;
  fromOpacity?: number;
  toOpacity?: number;
  easing?: string;
};

type AnimatedTextProps = {
  text: string | undefined | null;
  as?: "h1" | "h2" | "p" | "span";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  letterClassName?: string;
  config?: Config;
  delay?: number;
};

const defaultConfig: Required<Config> = {
  duration: 0.2,
  delayStep: 30,
  distance: 40,
  fromOpacity: 0,
  toOpacity: 1,
  easing: "ease-out",
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-3xl sm:text-4xl",
  "2xl": "text-4xl sm:text-5xl",
} as const;

export function AnimatedText({
  text,
  as: Tag = "h1",
  size = "md",
  className,
  letterClassName,
  config = {},
  delay = 0,
}: AnimatedTextProps) {
  const mergedConfig: Required<Config> = {
    ...defaultConfig,
    ...config,
  };
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const segments = useMemo(() => (text || "").split(/(\s+)/), [text]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const beginObserve = () => {
      if (observer || !ref.current) {
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer?.disconnect();
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(ref.current);
    };

    const loading =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-app-loading") === "1";

    if (loading) {
      const onReady = () => {
        beginObserve();
        window.removeEventListener("app:ready", onReady);
      };

      window.addEventListener("app:ready", onReady);

      return () => {
        window.removeEventListener("app:ready", onReady);
        observer?.disconnect();
      };
    }

    beginObserve();

    return () => {
      observer?.disconnect();
    };
  }, []);

  let charCounter = 0;

  return (
    <Tag
      ref={ref as never}
      aria-label={text || ""}
      className={clsx(
        "inline-block align-middle whitespace-pre-wrap [word-break:keep-all]",
        sizeClasses[size],
        className,
      )}
      style={{ overflow: "visible" }}
    >
      <span aria-hidden="true">
        {segments.map((segment, wordIndex) => {
          if (/^\s+$/.test(segment)) {
            return <span key={`ws-${wordIndex}`}>{segment}</span>;
          }

          return (
            <span key={`w-${wordIndex}`} className="inline-block">
              {segment.split("").map((character, charIndex) => {
                const index = charCounter++;

                return (
                  <span
                    key={`c-${wordIndex}-${charIndex}`}
                    className={clsx(
                      "inline-block align-baseline will-change-transform",
                      letterClassName,
                    )}
                    style={{
                      lineHeight: "inherit",
                      opacity: isVisible
                        ? mergedConfig.toOpacity
                        : mergedConfig.fromOpacity,
                      transform: isVisible
                        ? "translate(0, 0) rotate(0deg) translateZ(0)"
                        : `translate(-${mergedConfig.distance / 1.5}px, ${mergedConfig.distance / 1.5}px) rotate(-15deg) translateZ(0)`,
                      transition: `transform ${mergedConfig.duration / 2}s ${mergedConfig.easing} ${(delay + index * mergedConfig.delayStep) / 1000}s, opacity ${mergedConfig.duration / 2}s ${mergedConfig.easing} ${(delay + index * mergedConfig.delayStep) / 1000}s`,
                    }}
                  >
                    {character}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
