"use client";

import type { IconType } from "react-icons";
import {
  RiApps2AddLine,
  RiBankCardLine,
  RiBankLine,
  RiBarChart2Line,
  RiBookletLine,
  RiBriefcase4Line,
  RiBuilding2Line,
  RiBuilding4Line,
  RiBusLine,
  RiCarLine,
  RiCashLine,
  RiCoinsLine,
  RiCopperCoinLine,
  RiExchangeBoxLine,
  RiExchangeDollarLine,
  RiFileChartLine,
  RiFlashlightLine,
  RiFlightTakeoffLine,
  RiFundsBoxLine,
  RiGift2Line,
  RiGovernmentLine,
  RiHandCoinLine,
  RiHardDrive3Line,
  RiHeadphoneLine,
  RiHeartPulseLine,
  RiHome4Line,
  RiHotelLine,
  RiInboxArchiveLine,
  RiLayoutGridLine,
  RiLineChartLine,
  RiLock2Line,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiMoonClearLine,
  RiNotification3Line,
  RiPaintBrushLine,
  RiPassportLine,
  RiPieChart2Line,
  RiPlaneLine,
  RiPriceTag3Line,
  RiReceiptLine,
  RiCheckLine,
  RiRocket2Line,
  RiSafe2Line,
  RiSafe3Line,
  RiScales3Line,
  RiSecurePaymentLine,
  RiShieldCheckLine,
  RiShieldStarLine,
  RiShoppingBag4Line,
  RiSmartphoneLine,
  RiSparkling2Line,
  RiStackLine,
  RiStore2Line,
  RiSuitcase3Line,
  RiTaxiLine,
  RiTimeLine,
  RiTrainLine,
  RiTrophyLine,
  RiTv2Line,
  RiVipCrown2Line,
  RiWallet3Line,
  RiWalletLine,
  RiWifiLine,
} from "react-icons/ri";

import { cn } from "@/lib/utils";

export type AccountAppearancePreset = {
  token: string;
  label: string;
  border: string;
  glow: string;
  soft: string;
  orb: string;
  text: string;
};

export const ACCOUNT_COLOR_PRESETS: AccountAppearancePreset[] = [
  { token: "emerald", label: "Emerald", border: "#3ecf8e", glow: "rgba(62,207,142,0.2)", soft: "rgba(7,53,36,0.88)", orb: "rgba(110,231,183,0.18)", text: "#d7fff0" },
  { token: "teal", label: "Teal", border: "#36cbb8", glow: "rgba(54,203,184,0.19)", soft: "rgba(7,50,48,0.88)", orb: "rgba(94,234,212,0.17)", text: "#d4fffb" },
  { token: "cyan", label: "Cyan", border: "#57cde8", glow: "rgba(87,205,232,0.18)", soft: "rgba(9,42,54,0.88)", orb: "rgba(125,211,252,0.16)", text: "#dbf8ff" },
  { token: "blue", label: "Blue", border: "#6395f9", glow: "rgba(99,149,249,0.18)", soft: "rgba(11,33,66,0.88)", orb: "rgba(147,197,253,0.16)", text: "#dfeaff" },
  { token: "indigo", label: "Indigo", border: "#7d87f8", glow: "rgba(125,135,248,0.18)", soft: "rgba(24,24,70,0.88)", orb: "rgba(165,180,252,0.16)", text: "#e5e9ff" },
  { token: "violet", label: "Violet", border: "#a383f6", glow: "rgba(163,131,246,0.18)", soft: "rgba(44,22,73,0.88)", orb: "rgba(196,181,253,0.16)", text: "#f0e9ff" },
  { token: "rose", label: "Rose", border: "#f06f97", glow: "rgba(240,111,151,0.18)", soft: "rgba(68,22,46,0.88)", orb: "rgba(251,146,176,0.16)", text: "#ffe3ee" },
  { token: "amber", label: "Amber", border: "#e9b64b", glow: "rgba(233,182,75,0.16)", soft: "rgba(73,43,16,0.9)", orb: "rgba(252,211,77,0.14)", text: "#fff1cc" },
  { token: "orange", label: "Orange", border: "#ea9352", glow: "rgba(234,147,82,0.16)", soft: "rgba(76,35,16,0.9)", orb: "rgba(251,191,116,0.14)", text: "#ffeadc" },
  { token: "slate", label: "Slate", border: "#97a6ba", glow: "rgba(151,166,186,0.15)", soft: "rgba(29,36,49,0.9)", orb: "rgba(203,213,225,0.12)", text: "#ebf2ff" },
];

export function buildAppearanceSwatchStyle(
  preset: AccountAppearancePreset,
  isSelected: boolean,
) {
  return {
    borderColor: isSelected ? preset.border : "rgba(255,255,255,0.08)",
    background: [
      `radial-gradient(circle at 30% 24%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 18%, transparent 42%)`,
      `radial-gradient(circle at 62% 72%, ${preset.orb} 0%, transparent 46%)`,
      `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, ${preset.soft} 38%, rgba(3,7,10,0.96) 100%)`,
    ].join(", "),
    boxShadow: isSelected
      ? `inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -10px 18px rgba(0,0,0,0.28), 0 0 0 1px ${preset.glow}, 0 14px 32px -20px ${preset.glow}`
      : "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -10px 18px rgba(0,0,0,0.22)",
  };
}

export const ACCOUNT_ICON_OPTIONS: Array<{ value: string; icon: IconType; label: string }> = [
  { value: "wallet", icon: RiWallet3Line, label: "Wallet" },
  { value: "bank", icon: RiBankLine, label: "Bank" },
  { value: "bank-card", icon: RiBankCardLine, label: "Card" },
  { value: "safe", icon: RiSafe2Line, label: "Safe" },
  { value: "vault", icon: RiSafe3Line, label: "Vault" },
  { value: "coins", icon: RiCoinsLine, label: "Coins" },
  { value: "coin", icon: RiCopperCoinLine, label: "Coin" },
  { value: "cash", icon: RiCashLine, label: "Cash" },
  { value: "money", icon: RiMoneyDollarCircleLine, label: "Money" },
  { value: "hand-coin", icon: RiHandCoinLine, label: "Income" },
  { value: "exchange", icon: RiExchangeDollarLine, label: "FX" },
  { value: "exchange-box", icon: RiExchangeBoxLine, label: "Transfer" },
  { value: "line-chart", icon: RiLineChartLine, label: "Growth" },
  { value: "bar-chart", icon: RiBarChart2Line, label: "Bar chart" },
  { value: "pie-chart", icon: RiPieChart2Line, label: "Pie chart" },
  { value: "file-chart", icon: RiFileChartLine, label: "Report" },
  { value: "funds", icon: RiFundsBoxLine, label: "Fund" },
  { value: "stack", icon: RiStackLine, label: "Stack" },
  { value: "wallet-simple", icon: RiWalletLine, label: "Wallet alt" },
  { value: "grid", icon: RiLayoutGridLine, label: "Portfolio" },
  { value: "briefcase", icon: RiBriefcase4Line, label: "Business" },
  { value: "suitcase", icon: RiSuitcase3Line, label: "Projects" },
  { value: "building", icon: RiBuilding4Line, label: "Company" },
  { value: "building-2", icon: RiBuilding2Line, label: "Office" },
  { value: "government", icon: RiGovernmentLine, label: "State" },
  { value: "home", icon: RiHome4Line, label: "Home" },
  { value: "store", icon: RiStore2Line, label: "Store" },
  { value: "hotel", icon: RiHotelLine, label: "Property" },
  { value: "shopping", icon: RiShoppingBag4Line, label: "Shopping" },
  { value: "tag", icon: RiPriceTag3Line, label: "Tag" },
  { value: "receipt", icon: RiReceiptLine, label: "Receipt" },
  { value: "gift", icon: RiGift2Line, label: "Gift" },
  { value: "trophy", icon: RiTrophyLine, label: "Bonus" },
  { value: "rocket", icon: RiRocket2Line, label: "Startup" },
  { value: "crown", icon: RiVipCrown2Line, label: "Premium" },
  { value: "sparkles", icon: RiSparkling2Line, label: "Special" },
  { value: "apps", icon: RiApps2AddLine, label: "Apps" },
  { value: "flash", icon: RiFlashlightLine, label: "Fast" },
  { value: "shield", icon: RiShieldCheckLine, label: "Protected" },
  { value: "shield-star", icon: RiShieldStarLine, label: "Reserve" },
  { value: "lock", icon: RiLock2Line, label: "Locked" },
  { value: "secure-payment", icon: RiSecurePaymentLine, label: "Payment" },
  { value: "passport", icon: RiPassportLine, label: "Travel" },
  { value: "plane", icon: RiPlaneLine, label: "Flights" },
  { value: "takeoff", icon: RiFlightTakeoffLine, label: "Trip" },
  { value: "car", icon: RiCarLine, label: "Car" },
  { value: "taxi", icon: RiTaxiLine, label: "Taxi" },
  { value: "train", icon: RiTrainLine, label: "Train" },
  { value: "bus", icon: RiBusLine, label: "Bus" },
  { value: "map-pin", icon: RiMapPin2Line, label: "Location" },
  { value: "phone", icon: RiSmartphoneLine, label: "Mobile" },
  { value: "headphones", icon: RiHeadphoneLine, label: "Media" },
  { value: "tv", icon: RiTv2Line, label: "TV" },
  { value: "wifi", icon: RiWifiLine, label: "Internet" },
  { value: "drive", icon: RiHardDrive3Line, label: "Storage" },
  { value: "archive", icon: RiInboxArchiveLine, label: "Reserve" },
  { value: "booklet", icon: RiBookletLine, label: "Docs" },
  { value: "paint", icon: RiPaintBrushLine, label: "Creative" },
  { value: "scales", icon: RiScales3Line, label: "Legal" },
  { value: "heart", icon: RiHeartPulseLine, label: "Health" },
  { value: "time", icon: RiTimeLine, label: "Time" },
  { value: "bell", icon: RiNotification3Line, label: "Alerts" },
  { value: "moon", icon: RiMoonClearLine, label: "Night" },
];

const DEFAULT_KIND_ICON_MAP: Record<string, string> = {
  cash: "cash",
  bank: "bank",
  savings: "wallet",
  deposit: "safe",
  credit_card: "bank-card",
  e_wallet: "phone",
  investment: "line-chart",
  entrepreneur: "briefcase",
  company: "building",
  loan: "hand-coin",
  other: "coins",
};

const ACCOUNT_ICON_MAP = new Map(ACCOUNT_ICON_OPTIONS.map((item) => [item.value, item]));

export function resolveAccountAppearance(token?: string) {
  return ACCOUNT_COLOR_PRESETS.find((item) => item.token === token) ?? ACCOUNT_COLOR_PRESETS[0];
}

export function resolveAccountIcon(icon?: string, kind?: string) {
  const effectiveIcon = (icon && ACCOUNT_ICON_MAP.has(icon) ? icon : undefined) ?? DEFAULT_KIND_ICON_MAP[kind ?? ""] ?? "wallet";
  return ACCOUNT_ICON_MAP.get(effectiveIcon) ?? ACCOUNT_ICON_OPTIONS[0];
}

type AccountAppearancePickerProps = {
  color: string;
  icon: string;
  kind?: string;
  colorLabel: string;
  iconLabel: string;
  helperText: string;
  clearLabel: string;
  onColorChange: (value: string) => void;
  onIconChange: (value: string) => void;
};

export function AccountAppearancePicker({
  color,
  icon,
  kind,
  colorLabel,
  iconLabel,
  helperText,
  clearLabel,
  onColorChange,
  onIconChange,
}: AccountAppearancePickerProps) {
  const appearance = resolveAccountAppearance(color);
  const selectedIcon = resolveAccountIcon(icon, kind);

  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-black/18 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{iconLabel}</p>
          <p className="mt-1 text-sm text-zinc-400">{helperText}</p>
        </div>
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-black/30"
          style={{
            borderColor: appearance.border,
            boxShadow: `0 0 0 1px ${appearance.glow}, 0 16px 34px -22px ${appearance.glow}`,
          }}
        >
          <selectedIcon.icon className="size-5" style={{ color: appearance.text }} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{colorLabel}</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ACCOUNT_COLOR_PRESETS.map((preset) => {
            const isSelected = preset.token === color;
            return (
              <button
                key={preset.token}
                type="button"
                onClick={() => onColorChange(preset.token)}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition duration-200 hover:-translate-y-0.5",
                  isSelected ? "bg-white/[0.06]" : "bg-white/[0.03]",
                )}
                style={{
                  borderColor: isSelected ? preset.border : "rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? `0 0 0 1px ${preset.glow}, 0 12px 26px -20px ${preset.glow}` : undefined,
                }}
                aria-label={preset.label}
                title={preset.label}
              >
                <span
                  className="relative h-8 min-w-0 flex-1 overflow-hidden rounded-lg"
                  style={{
                    background: [
                      `radial-gradient(circle at 18% 20%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.1) 16%, transparent 38%)`,
                      `radial-gradient(circle at 82% 80%, ${preset.orb} 0%, transparent 42%)`,
                      `linear-gradient(135deg, ${preset.border} 0%, ${preset.soft} 52%, rgba(3,7,10,0.96) 100%)`,
                    ].join(", "),
                    boxShadow: isSelected ? `inset 0 0 0 1px rgba(255,255,255,0.18), 0 12px 24px -18px ${preset.glow}` : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-100">{preset.label}</span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border transition",
                    isSelected ? "text-white" : "text-transparent",
                  )}
                  style={{
                    borderColor: isSelected ? preset.border : "rgba(255,255,255,0.08)",
                    backgroundColor: isSelected ? "rgba(255,255,255,0.08)" : "transparent",
                    boxShadow: isSelected ? `0 0 0 1px ${preset.glow}` : undefined,
                  }}
                >
                  <RiCheckLine className="size-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{iconLabel}</p>
          <button
            type="button"
            className="text-xs text-zinc-400 transition hover:text-zinc-200"
            onClick={() => onIconChange("")}
          >
            {clearLabel}
          </button>
        </div>
        <div className="grid max-h-64 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-7">
          {ACCOUNT_ICON_OPTIONS.map((item) => {
            const isSelected = selectedIcon.value === item.value && (icon === item.value || (!icon && selectedIcon.value === item.value));
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onIconChange(item.value)}
                className={cn(
                  "group flex h-12 items-center justify-center rounded-2xl border bg-white/[0.03] transition hover:-translate-y-0.5",
                  isSelected ? "bg-white/[0.08]" : "border-white/8",
                )}
                style={{
                  borderColor: isSelected ? appearance.border : undefined,
                  boxShadow: isSelected ? `0 0 0 1px ${appearance.glow}, 0 14px 30px -24px ${appearance.glow}` : undefined,
                }}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="size-4.5 text-zinc-200 transition group-hover:text-white" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
