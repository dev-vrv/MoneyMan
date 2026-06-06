"use client";

import type { IconType } from "react-icons";
import {
  RiBarChart2Line,
  RiBookletLine,
  RiBriefcase4Line,
  RiBusLine,
  RiCarLine,
  RiExchangeBoxLine,
  RiFlashlightLine,
  RiFundsBoxLine,
  RiGift2Line,
  RiGovernmentLine,
  RiHandCoinLine,
  RiHeartPulseLine,
  RiHome4Line,
  RiHotelLine,
  RiLineChartLine,
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
  RiRestaurant2Line,
  RiScales3Line,
  RiSecurePaymentLine,
  RiShieldCheckLine,
  RiShoppingBag4Line,
  RiSmartphoneLine,
  RiSparkling2Line,
  RiStore2Line,
  RiTaxiLine,
  RiTimeLine,
  RiTrainLine,
  RiWallet3Line,
} from "react-icons/ri";

import {
  ACCOUNT_COLOR_PRESETS,
  buildAppearanceSwatchStyle,
  resolveAccountAppearance,
} from "@/components/workspace/account-appearance-picker";
import { cn } from "@/lib/utils";

const CATEGORY_ICON_OPTIONS: Array<{ value: string; icon: IconType; label: string }> = [
  { value: "wallet", icon: RiWallet3Line, label: "Wallet" },
  { value: "income", icon: RiHandCoinLine, label: "Income" },
  { value: "expense", icon: RiMoneyDollarCircleLine, label: "Expense" },
  { value: "transfer", icon: RiExchangeBoxLine, label: "Transfer" },
  { value: "shopping", icon: RiShoppingBag4Line, label: "Shopping" },
  { value: "food", icon: RiRestaurant2Line, label: "Food" },
  { value: "transport", icon: RiCarLine, label: "Transport" },
  { value: "taxi", icon: RiTaxiLine, label: "Taxi" },
  { value: "train", icon: RiTrainLine, label: "Train" },
  { value: "bus", icon: RiBusLine, label: "Bus" },
  { value: "home", icon: RiHome4Line, label: "Home" },
  { value: "store", icon: RiStore2Line, label: "Store" },
  { value: "health", icon: RiHeartPulseLine, label: "Health" },
  { value: "education", icon: RiBookletLine, label: "Education" },
  { value: "salary", icon: RiBriefcase4Line, label: "Salary" },
  { value: "business", icon: RiGovernmentLine, label: "Business" },
  { value: "travel", icon: RiHotelLine, label: "Travel" },
  { value: "tax", icon: RiScales3Line, label: "Tax" },
  { value: "payments", icon: RiSecurePaymentLine, label: "Payments" },
  { value: "utility", icon: RiFlashlightLine, label: "Utility" },
  { value: "fund", icon: RiFundsBoxLine, label: "Fund" },
  { value: "growth", icon: RiLineChartLine, label: "Growth" },
  { value: "tag", icon: RiPriceTag3Line, label: "Tag" },
  { value: "gift", icon: RiGift2Line, label: "Gift" },
  { value: "shield", icon: RiShieldCheckLine, label: "Protection" },
  { value: "phone", icon: RiSmartphoneLine, label: "Phone" },
  { value: "time", icon: RiTimeLine, label: "Time" },
  { value: "sparkles", icon: RiSparkling2Line, label: "Entertainment" },
  { value: "bars", icon: RiBarChart2Line, label: "Analytics" },
];

const CATEGORY_ICON_MAP = new Map(CATEGORY_ICON_OPTIONS.map((item) => [item.value, item]));

const DEFAULT_CATEGORY_KIND_ICON: Record<string, string> = {
  income: "income",
  expense: "expense",
  transfer: "transfer",
};

const DEFAULT_CATEGORY_KIND_COLOR: Record<string, string> = {
  income: "emerald",
  expense: "rose",
  transfer: "blue",
};

const DEFAULT_SYSTEM_CATEGORY_ICON_BY_SLUG: Record<string, string> = {
  salary: "salary",
  "employment-income": "salary",
  "freelance-income": "business",
  "business-income": "business",
  "rental-income": "home",
  "investment-income": "growth",
  "interest-income": "fund",
  "gift-income": "gift",
  food: "food",
  groceries: "food",
  dining: "food",
  transport: "transport",
  taxi: "taxi",
  travel: "travel",
  housing: "home",
  rent: "home",
  utilities: "utility",
  healthcare: "health",
  education: "education",
  shopping: "shopping",
  entertainment: "sparkles",
  tax: "tax",
  taxes: "tax",
  fees: "payments",
  subscriptions: "phone",
};

const DEFAULT_SYSTEM_CATEGORY_COLOR_BY_SLUG: Record<string, string> = {
  salary: "emerald",
  "employment-income": "emerald",
  "freelance-income": "cyan",
  "business-income": "amber",
  "rental-income": "blue",
  "investment-income": "violet",
  food: "orange",
  groceries: "orange",
  dining: "amber",
  transport: "blue",
  travel: "cyan",
  housing: "slate",
  healthcare: "rose",
  education: "indigo",
  shopping: "violet",
  entertainment: "teal",
  tax: "amber",
  taxes: "amber",
  fees: "slate",
};

export function resolveCategoryIcon(icon?: string, kind?: string, slug?: string) {
  const effectiveIcon =
    (icon && CATEGORY_ICON_MAP.has(icon) ? icon : undefined)
    ?? (slug ? DEFAULT_SYSTEM_CATEGORY_ICON_BY_SLUG[slug] : undefined)
    ?? DEFAULT_CATEGORY_KIND_ICON[kind ?? ""]
    ?? "tag";

  return CATEGORY_ICON_MAP.get(effectiveIcon) ?? CATEGORY_ICON_OPTIONS[0];
}

export function resolveCategoryAppearance(color?: string, kind?: string, slug?: string) {
  const effectiveColor = color || (slug ? DEFAULT_SYSTEM_CATEGORY_COLOR_BY_SLUG[slug] : undefined) || DEFAULT_CATEGORY_KIND_COLOR[kind ?? ""] || "slate";
  return resolveAccountAppearance(effectiveColor);
}

type CategoryAppearancePickerProps = {
  color: string;
  icon: string;
  kind?: string;
  slug?: string;
  colorLabel: string;
  iconLabel: string;
  helperText: string;
  clearLabel: string;
  onColorChange: (value: string) => void;
  onIconChange: (value: string) => void;
};

export function CategoryAppearancePicker({
  color,
  icon,
  kind,
  slug,
  colorLabel,
  iconLabel,
  helperText,
  clearLabel,
  onColorChange,
  onIconChange,
}: CategoryAppearancePickerProps) {
  const appearance = resolveCategoryAppearance(color, kind, slug);
  const selectedIcon = resolveCategoryIcon(icon, kind, slug);

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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ACCOUNT_COLOR_PRESETS.map((preset) => {
            const isSelected = preset.token === color;
            return (
              <button
                key={preset.token}
                type="button"
                onClick={() => onColorChange(preset.token)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition duration-200 hover:-translate-y-0.5",
                  isSelected ? "bg-white/[0.06]" : "bg-white/[0.03]",
                )}
                style={{
                  borderColor: isSelected ? preset.border : "rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? `0 0 0 1px ${preset.glow}, 0 12px 26px -20px ${preset.glow}` : undefined,
                }}
                aria-label={preset.label}
              >
                <span
                  className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
                  style={buildAppearanceSwatchStyle(preset, isSelected)}
                >
                  {isSelected ? <span className="size-2 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.35)]" /> : null}
                </span>
                <span className="min-w-0 text-sm font-medium text-zinc-100">{preset.label}</span>
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
          {CATEGORY_ICON_OPTIONS.map((item) => {
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
