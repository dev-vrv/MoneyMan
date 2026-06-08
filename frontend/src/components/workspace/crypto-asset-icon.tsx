"use client";

import type { IconType } from "react-icons";
import { RiCoinsLine } from "react-icons/ri";
import {
  SiBinance,
  SiBitcoin,
  SiCardano,
  SiChainlink,
  SiDogecoin,
  SiEthereum,
  SiPolkadot,
  SiSolana,
  SiTether,
  SiTon,
  SiXrp,
} from "react-icons/si";

import { cn } from "@/lib/utils";

const COLOR_BY_TOKEN: Record<string, { bg: string; fg: string; border: string; shadow: string }> = {
  amber: { bg: "linear-gradient(135deg, rgba(251,191,36,0.28), rgba(120,53,15,0.92))", fg: "#fef3c7", border: "rgba(251,191,36,0.24)", shadow: "rgba(251,191,36,0.55)" },
  yellow: { bg: "linear-gradient(135deg, rgba(250,204,21,0.3), rgba(113,63,18,0.92))", fg: "#fef9c3", border: "rgba(250,204,21,0.24)", shadow: "rgba(250,204,21,0.55)" },
  blue: { bg: "linear-gradient(135deg, rgba(59,130,246,0.26), rgba(30,58,138,0.92))", fg: "#dbeafe", border: "rgba(96,165,250,0.24)", shadow: "rgba(59,130,246,0.5)" },
  sky: { bg: "linear-gradient(135deg, rgba(56,189,248,0.26), rgba(12,74,110,0.92))", fg: "#e0f2fe", border: "rgba(56,189,248,0.22)", shadow: "rgba(56,189,248,0.5)" },
  cyan: { bg: "linear-gradient(135deg, rgba(34,211,238,0.26), rgba(22,78,99,0.92))", fg: "#cffafe", border: "rgba(34,211,238,0.22)", shadow: "rgba(34,211,238,0.48)" },
  emerald: { bg: "linear-gradient(135deg, rgba(16,185,129,0.24), rgba(6,78,59,0.92))", fg: "#d1fae5", border: "rgba(52,211,153,0.2)", shadow: "rgba(16,185,129,0.5)" },
  violet: { bg: "linear-gradient(135deg, rgba(139,92,246,0.26), rgba(76,29,149,0.92))", fg: "#ede9fe", border: "rgba(167,139,250,0.22)", shadow: "rgba(139,92,246,0.5)" },
  indigo: { bg: "linear-gradient(135deg, rgba(99,102,241,0.26), rgba(49,46,129,0.92))", fg: "#e0e7ff", border: "rgba(129,140,248,0.22)", shadow: "rgba(99,102,241,0.48)" },
  fuchsia: { bg: "linear-gradient(135deg, rgba(217,70,239,0.26), rgba(112,26,117,0.92))", fg: "#fae8ff", border: "rgba(232,121,249,0.22)", shadow: "rgba(217,70,239,0.48)" },
  pink: { bg: "linear-gradient(135deg, rgba(236,72,153,0.26), rgba(131,24,67,0.92))", fg: "#fce7f3", border: "rgba(244,114,182,0.22)", shadow: "rgba(236,72,153,0.48)" },
  lime: { bg: "linear-gradient(135deg, rgba(132,204,22,0.26), rgba(54,83,20,0.92))", fg: "#ecfccb", border: "rgba(163,230,53,0.22)", shadow: "rgba(132,204,22,0.48)" },
  orange: { bg: "linear-gradient(135deg, rgba(249,115,22,0.26), rgba(124,45,18,0.92))", fg: "#ffedd5", border: "rgba(251,146,60,0.22)", shadow: "rgba(249,115,22,0.48)" },
  red: { bg: "linear-gradient(135deg, rgba(239,68,68,0.26), rgba(127,29,29,0.92))", fg: "#fee2e2", border: "rgba(248,113,113,0.22)", shadow: "rgba(239,68,68,0.48)" },
  rose: { bg: "linear-gradient(135deg, rgba(244,63,94,0.26), rgba(136,19,55,0.92))", fg: "#ffe4e6", border: "rgba(251,113,133,0.22)", shadow: "rgba(244,63,94,0.48)" },
  slate: { bg: "linear-gradient(135deg, rgba(148,163,184,0.22), rgba(30,41,59,0.94))", fg: "#e2e8f0", border: "rgba(148,163,184,0.2)", shadow: "rgba(148,163,184,0.38)" },
};

const CRYPTO_ICON_BY_KEY: Record<string, { icon: IconType; brandColor: string; tokenColor: string }> = {
  bitcoin: { icon: SiBitcoin, brandColor: "#f7931a", tokenColor: "amber" },
  bnb: { icon: SiBinance, brandColor: "#f3ba2f", tokenColor: "yellow" },
  cardano: { icon: SiCardano, brandColor: "#2a6df5", tokenColor: "blue" },
  chainlink: { icon: SiChainlink, brandColor: "#375bd2", tokenColor: "blue" },
  dogecoin: { icon: SiDogecoin, brandColor: "#c2a633", tokenColor: "amber" },
  ethereum: { icon: SiEthereum, brandColor: "#627eea", tokenColor: "indigo" },
  polkadot: { icon: SiPolkadot, brandColor: "#e6007a", tokenColor: "fuchsia" },
  solana: { icon: SiSolana, brandColor: "#14f195", tokenColor: "violet" },
  tether: { icon: SiTether, brandColor: "#26a17b", tokenColor: "emerald" },
  ton: { icon: SiTon, brandColor: "#0098ea", tokenColor: "sky" },
  tron: { icon: RiCoinsLine, brandColor: "#ef0027", tokenColor: "red" },
  "usd-coin": { icon: RiCoinsLine, brandColor: "#2775ca", tokenColor: "blue" },
  xrp: { icon: SiXrp, brandColor: "#f5f5f5", tokenColor: "slate" },
};

function FallbackCryptoAssetIcon({
  symbol,
  color,
  className,
}: {
  symbol: string;
  color?: string;
  className?: string;
}) {
  const palette = COLOR_BY_TOKEN[color ?? "emerald"] ?? COLOR_BY_TOKEN.emerald;

  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-2xl border text-[0.7rem] font-semibold tracking-[0.08em]",
        className,
      )}
      style={{
        background: palette.bg,
        color: palette.fg,
        borderColor: palette.border,
        boxShadow: `0 12px 30px -20px ${palette.shadow}`,
      }}
      aria-hidden="true"
    >
      {symbol.slice(0, 2)}
    </span>
  );
}

export function CryptoAssetIcon({
  icon,
  symbol,
  color,
  className,
}: {
  icon: string;
  symbol: string;
  color?: string;
  className?: string;
}) {
  const iconConfig = CRYPTO_ICON_BY_KEY[icon];

  if (!iconConfig) {
    return <FallbackCryptoAssetIcon symbol={symbol} color={color} className={className} />;
  }

  const Icon = iconConfig.icon;
  const palette = COLOR_BY_TOKEN[iconConfig.tokenColor] ?? COLOR_BY_TOKEN.emerald;

  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-2xl border backdrop-blur-[2px]",
        className,
      )}
      style={{
        background: `radial-gradient(circle at top, rgba(255,255,255,0.16), transparent 55%), ${palette.bg}`,
        borderColor: palette.border,
        boxShadow: `0 12px 30px -20px ${palette.shadow}`,
      }}
      aria-hidden="true"
    >
      <Icon className="size-4.5" style={{ color: iconConfig.brandColor }} />
    </span>
  );
}
