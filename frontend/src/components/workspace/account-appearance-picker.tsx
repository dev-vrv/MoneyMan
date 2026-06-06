"use client";

import type { IconType } from "react-icons";
import {
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
  RiHeartPulseLine,
  RiHome4Line,
  RiHotelLine,
  RiInboxArchiveLine,
  RiLineChartLine,
  RiLock2Line,
  RiMoneyDollarCircleLine,
  RiNotification3Line,
  RiPassportLine,
  RiPieChart2Line,
  RiPlaneLine,
  RiPriceTag3Line,
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
  RiTaxiLine,
  RiTimeLine,
  RiTrainLine,
  RiTrophyLine,
  RiVipCrown2Line,
  RiWallet3Line,
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
  { token: "emerald", label: "Emerald", border: "#34d399", glow: "rgba(52,211,153,0.24)", soft: "rgba(6,95,70,0.18)", orb: "rgba(110,231,183,0.34)", text: "#d1fae5" },
  { token: "teal", label: "Teal", border: "#2dd4bf", glow: "rgba(45,212,191,0.22)", soft: "rgba(15,118,110,0.18)", orb: "rgba(153,246,228,0.34)", text: "#ccfbf1" },
  { token: "cyan", label: "Cyan", border: "#67e8f9", glow: "rgba(103,232,249,0.22)", soft: "rgba(8,145,178,0.16)", orb: "rgba(165,243,252,0.32)", text: "#cffafe" },
  { token: "blue", label: "Blue", border: "#60a5fa", glow: "rgba(96,165,250,0.22)", soft: "rgba(29,78,216,0.16)", orb: "rgba(147,197,253,0.34)", text: "#dbeafe" },
  { token: "indigo", label: "Indigo", border: "#818cf8", glow: "rgba(129,140,248,0.22)", soft: "rgba(67,56,202,0.16)", orb: "rgba(165,180,252,0.34)", text: "#e0e7ff" },
  { token: "violet", label: "Violet", border: "#a78bfa", glow: "rgba(167,139,250,0.22)", soft: "rgba(109,40,217,0.16)", orb: "rgba(196,181,253,0.34)", text: "#ede9fe" },
  { token: "rose", label: "Rose", border: "#fb7185", glow: "rgba(251,113,133,0.22)", soft: "rgba(190,24,93,0.16)", orb: "rgba(253,164,175,0.34)", text: "#ffe4e6" },
  { token: "amber", label: "Amber", border: "#fbbf24", glow: "rgba(251,191,36,0.2)", soft: "rgba(180,83,9,0.16)", orb: "rgba(252,211,77,0.32)", text: "#fef3c7" },
  { token: "orange", label: "Orange", border: "#fb923c", glow: "rgba(251,146,60,0.2)", soft: "rgba(194,65,12,0.16)", orb: "rgba(253,186,116,0.32)", text: "#ffedd5" },
  { token: "slate", label: "Slate", border: "#94a3b8", glow: "rgba(148,163,184,0.18)", soft: "rgba(51,65,85,0.18)", orb: "rgba(203,213,225,0.22)", text: "#e2e8f0" },
];

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
  { value: "briefcase", icon: RiBriefcase4Line, label: "Business" },
  { value: "building", icon: RiBuilding4Line, label: "Company" },
  { value: "building-2", icon: RiBuilding2Line, label: "Office" },
  { value: "government", icon: RiGovernmentLine, label: "State" },
  { value: "home", icon: RiHome4Line, label: "Home" },
  { value: "store", icon: RiStore2Line, label: "Store" },
  { value: "hotel", icon: RiHotelLine, label: "Property" },
  { value: "shopping", icon: RiShoppingBag4Line, label: "Shopping" },
  { value: "tag", icon: RiPriceTag3Line, label: "Tag" },
  { value: "gift", icon: RiGift2Line, label: "Gift" },
  { value: "trophy", icon: RiTrophyLine, label: "Bonus" },
  { value: "rocket", icon: RiRocket2Line, label: "Startup" },
  { value: "crown", icon: RiVipCrown2Line, label: "Premium" },
  { value: "sparkles", icon: RiSparkling2Line, label: "Special" },
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
  { value: "phone", icon: RiSmartphoneLine, label: "Mobile" },
  { value: "drive", icon: RiHardDrive3Line, label: "Storage" },
  { value: "archive", icon: RiInboxArchiveLine, label: "Reserve" },
  { value: "booklet", icon: RiBookletLine, label: "Docs" },
  { value: "scales", icon: RiScales3Line, label: "Legal" },
  { value: "heart", icon: RiHeartPulseLine, label: "Health" },
  { value: "time", icon: RiTimeLine, label: "Time" },
  { value: "bell", icon: RiNotification3Line, label: "Alerts" },
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
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{colorLabel}</p>
        <div className="flex flex-wrap gap-2">
          {ACCOUNT_COLOR_PRESETS.map((preset) => {
            const isSelected = preset.token === color;
            return (
              <button
                key={preset.token}
                type="button"
                onClick={() => onColorChange(preset.token)}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-2xl border transition hover:-translate-y-0.5",
                  isSelected ? "scale-[1.03]" : "",
                )}
                style={{
                  borderColor: isSelected ? preset.border : "rgba(255,255,255,0.08)",
                  background: `radial-gradient(circle at 30% 30%, ${preset.orb} 0%, ${preset.soft} 58%, rgba(5,8,7,0.76) 100%)`,
                  boxShadow: isSelected ? `0 0 0 1px ${preset.glow}, 0 12px 28px -18px ${preset.glow}` : undefined,
                }}
                aria-label={preset.label}
              >
                {isSelected ? <span className="size-2.5 rounded-full bg-white/90" /> : null}
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
