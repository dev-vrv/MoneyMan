"use client";

import { useState } from "react";
import type { ComponentType, Dispatch, ReactNode, SetStateAction } from "react";
import { RiAddLine, RiArrowRightUpLine, RiPencilLine } from "react-icons/ri";

import {
  resolveAccountAppearance,
  resolveAccountIcon,
} from "@/components/workspace/account-appearance-picker";
import type {
  CurrencyBreakdownEntry,
  UiCopy,
} from "@/components/workspace/finance-workspace.types";
import {
  accountKindLabel,
  formatDate,
  formatMoney,
  getAccountDisplayBalance,
  reportingPeriodLabel,
  statusTone,
  taxEntityLabel,
  transactionStatusLabel,
} from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import {
  FieldError,
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  AccountRecord,
  CategoryRecord,
  CreateTransactionPayload,
} from "@/lib/api/finance";
import { cn } from "@/lib/utils";

export const EMPTY_SELECT_VALUE = "__empty__";

export function WorkspaceSelect({
  value,
  onValueChange,
  placeholder,
  options,
  invalid = false,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: ReactNode }>;
  invalid?: boolean;
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-invalid={invalid}
        className="h-11 min-h-11 w-full rounded-2xl border-white/10 bg-white/5 px-4 text-zinc-100"
      >
        <span className={selectedOption ? "line-clamp-1" : "line-clamp-1 text-zinc-500"}>
          {selectedOption?.label ?? placeholder ?? ""}
        </span>
      </SelectTrigger>
      <SelectContent className="surface-floating rounded-2xl text-zinc-100">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TransactionDialogFields({
  type,
  status,
  onTypeChange,
  onStatusChange,
  accounts,
  categories,
  exchangeRatePlaceholder,
  values,
  setValues,
  fieldErrors,
  clearFieldError,
  ui,
}: {
  type: string;
  status: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  accounts: AccountRecord[];
  categories: CategoryRecord[];
  exchangeRatePlaceholder?: string;
  values: CreateTransactionPayload;
  setValues: Dispatch<SetStateAction<CreateTransactionPayload>>;
  fieldErrors?: Record<string, string>;
  clearFieldError?: (fieldName: string) => void;
  ui: UiCopy;
}) {
  const filteredCategories = categories.filter((item) => item.kind === type);

  return (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>{ui.type}</FieldLabel>
          <WorkspaceSelect
            value={type}
            onValueChange={(value) => {
              clearFieldError?.("type");
              onTypeChange(value);
            }}
            invalid={Boolean(fieldErrors?.type)}
            options={[
              { value: "expense", label: ui.txTypeExpense },
              { value: "income", label: ui.txTypeIncome },
              { value: "transfer", label: ui.txTypeTransfer },
            ]}
          />
          <FieldError>{fieldErrors?.type}</FieldError>
        </Field>
        <Field>
          <FieldLabel>{ui.status}</FieldLabel>
          <WorkspaceSelect
            value={status}
            onValueChange={(value) => {
              clearFieldError?.("status");
              onStatusChange(value);
            }}
            invalid={Boolean(fieldErrors?.status)}
            options={[
              { value: "cleared", label: ui.txStatusCleared },
              { value: "pending", label: ui.txStatusPending },
              { value: "draft", label: ui.txStatusDraft },
              { value: "canceled", label: ui.txStatusCanceled },
            ]}
          />
          <FieldError>{fieldErrors?.status}</FieldError>
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>{ui.accountName}</FieldLabel>
          <WorkspaceSelect
            value={String(values.account)}
            onValueChange={(selectedValue) => {
              clearFieldError?.("account");
              setValues((current) => ({
                ...current,
                account: Number(selectedValue),
              }));
            }}
            invalid={Boolean(fieldErrors?.account)}
            options={accounts.map((account) => ({
              value: String(account.id),
              label: account.name,
            }))}
          />
          <FieldError>{fieldErrors?.account}</FieldError>
        </Field>
        {type === "transfer" ? (
          <Field>
            <FieldLabel>{ui.destinationAccount}</FieldLabel>
            <WorkspaceSelect
              value={values.destination_account ? String(values.destination_account) : EMPTY_SELECT_VALUE}
              onValueChange={(selectedValue) => {
                clearFieldError?.("destination_account");
                setValues((current) => ({
                  ...current,
                  destination_account: selectedValue === EMPTY_SELECT_VALUE ? null : Number(selectedValue),
                }));
              }}
              invalid={Boolean(fieldErrors?.destination_account)}
              options={[
                { value: EMPTY_SELECT_VALUE, label: ui.selectDestination },
                ...accounts.map((account) => ({
                  value: String(account.id),
                  label: account.name,
                })),
              ]}
            />
            <FieldError>{fieldErrors?.destination_account}</FieldError>
          </Field>
        ) : (
          <Field>
            <FieldLabel>{ui.category}</FieldLabel>
            <WorkspaceSelect
              value={values.category ? String(values.category) : EMPTY_SELECT_VALUE}
              onValueChange={(selectedValue) => {
                clearFieldError?.("category");
                setValues((current) => ({
                  ...current,
                  category: selectedValue === EMPTY_SELECT_VALUE ? null : Number(selectedValue),
                }));
              }}
              invalid={Boolean(fieldErrors?.category)}
              options={[
                { value: EMPTY_SELECT_VALUE, label: ui.selectCategory },
                ...filteredCategories.map((category) => ({
                  value: String(category.id),
                  label: category.name,
                })),
              ]}
            />
            <FieldError>{fieldErrors?.category}</FieldError>
          </Field>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>{ui.amount}</FieldLabel>
          <Input
            value={values.amount}
            aria-invalid={Boolean(fieldErrors?.amount)}
            onChange={(event) => {
              clearFieldError?.("amount");
              setValues((current) => ({ ...current, amount: event.target.value }));
            }}
            placeholder="0.00"
          />
          <FieldError>{fieldErrors?.amount}</FieldError>
        </Field>
        <Field>
          <FieldLabel>{ui.date}</FieldLabel>
          <DateInput
            value={values.occurred_on}
            aria-invalid={Boolean(fieldErrors?.occurred_on)}
            onChange={(nextValue) => {
              clearFieldError?.("occurred_on");
              setValues((current) => ({ ...current, occurred_on: nextValue }));
            }}
            placeholder={ui.date}
          />
          <FieldError>{fieldErrors?.occurred_on}</FieldError>
        </Field>
      </div>
      {type === "transfer" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>{ui.destinationAmount}</FieldLabel>
            <Input
              value={values.destination_amount ?? ""}
              aria-invalid={Boolean(fieldErrors?.destination_amount)}
              onChange={(event) =>
                {
                  clearFieldError?.("destination_amount");
                  setValues((current) => ({
                    ...current,
                    destination_amount: event.target.value || null,
                  }));
                }
              }
              placeholder="0.00"
            />
            <FieldError>{fieldErrors?.destination_amount}</FieldError>
          </Field>
          <Field>
            <FieldLabel>{ui.exchangeRate}</FieldLabel>
            <Input
              value={values.exchange_rate ?? ""}
              aria-invalid={Boolean(fieldErrors?.exchange_rate)}
              onChange={(event) =>
                {
                  clearFieldError?.("exchange_rate");
                  setValues((current) => ({
                    ...current,
                    exchange_rate: event.target.value || null,
                  }));
                }
              }
              placeholder={exchangeRatePlaceholder ?? ui.optional}
            />
            <FieldError>{fieldErrors?.exchange_rate}</FieldError>
          </Field>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>{ui.titleLabel}</FieldLabel>
          <Input
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          />
        </Field>
        <Field>
          <FieldLabel>{ui.merchant}</FieldLabel>
          <Input
            value={values.merchant}
            onChange={(event) => setValues((current) => ({ ...current, merchant: event.target.value }))}
          />
        </Field>
      </div>
      <Field>
        <FieldLabel>{ui.notes}</FieldLabel>
        <Textarea
          value={values.description}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
        />
      </Field>
    </FieldGroup>
  );
}

export function AccountCard({
  account,
  ui,
  onEdit,
  onOpen,
  className,
}: {
  account: AccountRecord;
  ui: UiCopy;
  onEdit?: (account: AccountRecord) => void;
  onOpen?: (account: AccountRecord) => void;
  className?: string;
}) {
  const appearance = resolveAccountAppearance(account.color);
  const accountIcon = resolveAccountIcon(account.icon, account.kind);
  const AccountIcon = accountIcon.icon;
  const balance = formatMoney(getAccountDisplayBalance(account), account.currency);
  const accountMeta = account.institution || accountKindLabel(account.kind, ui);
  const hasCreditLimit = Number(account.credit_limit) > 0;
  const accountNote = account.note.trim();
  const taxProfile = account.tax_profile;
  const taxBaseLabel = taxProfile?.calculation_source === "transactions" ? ui.receivedLabel : ui.taxBaseLabel;
  const detailChips = account.deposit_profile
    ? [
        `${ui.annualInterestRate}: ${account.deposit_profile.annual_interest_rate}%`,
        `${ui.accruedInterest}: ${formatMoney(account.deposit_profile.accrued_interest, account.currency)}`,
      ]
    : account.kind === "credit_card" && account.available_credit
      ? [
          `${ui.balanceOverview}: ${formatMoney(account.available_credit, account.currency)}`,
        ]
      : taxProfile
        ? [
            `${taxEntityLabel(taxProfile.entity_type, ui)} · ${reportingPeriodLabel(taxProfile.reporting_period, ui)}`,
            `${formatDate(taxProfile.period_start)} - ${formatDate(taxProfile.period_end)}`,
            `${taxBaseLabel}: ${formatMoney(taxProfile.tax_base, account.currency)}`,
            `${ui.taxLabel}: ${formatMoney(taxProfile.tax_amount, account.currency)} (${Number(taxProfile.tax_rate)}%)`,
            `${
              ui.socialFundLabel
            }: ${formatMoney(taxProfile.social_fund_amount, account.currency)} (${
              taxProfile.manual_social_fund_amount ? ui.socialFundModeFixed : `${Number(taxProfile.social_fund_rate)}%`
            })`,
          ]
        : [`${account.currency} · ${accountMeta}`];
  const metaChips = hasCreditLimit
    ? [...detailChips, `${ui.creditLimit}: ${formatMoney(account.credit_limit, account.currency)}`]
    : detailChips;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.45rem] border bg-[linear-gradient(180deg,rgba(11,17,15,0.98)_0%,rgba(8,13,12,0.96)_100%)] p-4 transition duration-200 hover:-translate-y-0.5",
        onOpen ? "cursor-pointer" : "",
        className,
      )}
      style={{
        borderColor: appearance.glow,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 22px 44px -34px ${appearance.glow}`,
      }}
      onClick={() => onOpen?.(account)}
      onKeyDown={(event) => {
        if (!onOpen) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(account);
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${appearance.border} 50%, transparent 100%)` }}
      />
      <div className="pointer-events-none absolute -right-10 top-4 h-20 w-20 rounded-full blur-3xl" style={{ backgroundColor: appearance.soft }} />
      <div className="pointer-events-none absolute -left-4 bottom-4 h-12 w-12 rounded-full blur-2xl" style={{ backgroundColor: appearance.glow }} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-black/30"
            style={{
              borderColor: appearance.border,
              boxShadow: `0 0 0 1px ${appearance.glow}, 0 14px 28px -22px ${appearance.glow}`,
            }}
          >
            <AccountIcon className="size-5" style={{ color: appearance.text }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{account.name}</p>
            <p className="mt-1 truncate text-xs text-zinc-500">{accountMeta}</p>
          </div>
        </div>
        <Badge variant="outline" className={`shrink-0 rounded-full ${statusTone(account.status)}`}>
          {transactionStatusLabel(account.status, ui)}
        </Badge>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">{ui.balance}</p>
          <p className="mt-1 break-words text-[1.45rem] font-semibold leading-none text-white sm:text-[1.6rem]">{balance}</p>
        </div>
        <div
          className="hidden h-9 min-w-[4.5rem] items-center justify-center rounded-full border px-3 text-xs font-medium md:inline-flex"
          style={{
            borderColor: appearance.glow,
            backgroundColor: appearance.soft,
            color: appearance.text,
          }}
        >
          {account.currency}
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {metaChips.map((item) => (
          <span
            key={`${account.id}-${item}`}
            className="rounded-full border px-3 py-1 text-xs text-zinc-200"
            style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            {item}
          </span>
        ))}
      </div>

      {accountNote ? (
        <p className="relative mt-3 line-clamp-2 break-words text-sm leading-6 text-zinc-400">{accountNote}</p>
      ) : null}

      {onEdit ? (
        <div className="relative mt-auto flex justify-end pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-2xl border-white/10 bg-white/5 px-4 text-zinc-100 transition hover:border-white/16 hover:bg-white/[0.08]"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(account);
            }}
          >
            <RiPencilLine className="size-4" />
            {ui.editLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  actionLabel,
  progressValue,
  className,
  breakdown = [],
  breakdownLabel,
  moreLabel,
  collapseLabel,
  onOpenBreakdown,
  tone = "emerald",
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  actionLabel?: string;
  progressValue?: number;
  className?: string;
  breakdown?: CurrencyBreakdownEntry[];
  breakdownLabel?: string;
  moreLabel?: string;
  collapseLabel?: string;
  onOpenBreakdown?: () => void;
  tone?: "emerald" | "rose" | "sky" | "violet" | "amber";
}) {
  const [breakdownExpanded, setBreakdownExpanded] = useState(false);
  const visibleEntries = breakdownExpanded ? breakdown : breakdown.slice(0, 2);
  const remainingCount = Math.max(breakdown.length - visibleEntries.length, 0);
  const toneStyles = {
    emerald: {
      cardSurface: "bg-[linear-gradient(180deg,rgba(10,26,19,0.92)_0%,rgba(6,18,12,0.98)_100%)]",
      cardHover: "hover:border-emerald-300/18 hover:shadow-[0_24px_60px_rgba(16,185,129,0.16)]",
      iconWrap: "border-emerald-300/16 bg-emerald-300/10 text-emerald-100",
      actionWrap: "border-emerald-300/18 bg-emerald-300/10 text-emerald-100 group-hover:bg-emerald-300/14",
      actionDot: "border-emerald-300/18",
      progressTrack: "rgba(167,243,208,0.9)",
      valueText: "text-emerald-50",
    },
    rose: {
      cardSurface: "bg-[linear-gradient(180deg,rgba(30,12,18,0.92)_0%,rgba(20,8,13,0.98)_100%)]",
      cardHover: "hover:border-rose-300/18 hover:shadow-[0_24px_60px_rgba(244,63,94,0.16)]",
      iconWrap: "border-rose-300/16 bg-rose-300/10 text-rose-100",
      actionWrap: "border-rose-300/18 bg-rose-300/10 text-rose-100 group-hover:bg-rose-300/14",
      actionDot: "border-rose-300/18",
      progressTrack: "rgba(253,164,175,0.9)",
      valueText: "text-rose-50",
    },
    sky: {
      cardSurface: "bg-[linear-gradient(180deg,rgba(8,18,24,0.92)_0%,rgba(7,12,19,0.98)_100%)]",
      cardHover: "hover:border-sky-300/18 hover:shadow-[0_24px_60px_rgba(56,189,248,0.16)]",
      iconWrap: "border-sky-300/16 bg-sky-300/10 text-sky-100",
      actionWrap: "border-sky-300/18 bg-sky-300/10 text-sky-100 group-hover:bg-sky-300/14",
      actionDot: "border-sky-300/18",
      progressTrack: "rgba(125,211,252,0.9)",
      valueText: "text-sky-50",
    },
    violet: {
      cardSurface: "bg-[linear-gradient(180deg,rgba(18,13,30,0.92)_0%,rgba(11,8,20,0.98)_100%)]",
      cardHover: "hover:border-violet-300/18 hover:shadow-[0_24px_60px_rgba(139,92,246,0.16)]",
      iconWrap: "border-violet-300/16 bg-violet-300/10 text-violet-100",
      actionWrap: "border-violet-300/18 bg-violet-300/10 text-violet-100 group-hover:bg-violet-300/14",
      actionDot: "border-violet-300/18",
      progressTrack: "rgba(196,181,253,0.9)",
      valueText: "text-violet-50",
    },
    amber: {
      cardSurface: "bg-[linear-gradient(180deg,rgba(30,22,8,0.92)_0%,rgba(20,15,7,0.98)_100%)]",
      cardHover: "hover:border-amber-300/18 hover:shadow-[0_24px_60px_rgba(251,191,36,0.16)]",
      iconWrap: "border-amber-300/16 bg-amber-300/10 text-amber-100",
      actionWrap: "border-amber-300/18 bg-amber-300/10 text-amber-100 group-hover:bg-amber-300/14",
      actionDot: "border-amber-300/18",
      progressTrack: "rgba(252,211,77,0.9)",
      valueText: "text-amber-50",
    },
  }[tone];

  return (
    <Card
      className={cn(
        "surface-panel-muted h-full rounded-[1.8rem] border-white/8 py-0",
        toneStyles.cardSurface,
        onOpenBreakdown ? `group cursor-pointer transition duration-200 hover:-translate-y-0.5 ${toneStyles.cardHover}` : "",
        className,
      )}
      onClick={onOpenBreakdown}
      onKeyDown={(event) => {
        if (!onOpenBreakdown) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenBreakdown();
        }
      }}
      role={onOpenBreakdown ? "button" : undefined}
      tabIndex={onOpenBreakdown ? 0 : undefined}
    >
      <CardHeader className="flex h-full flex-1 flex-col p-5">
        <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cn("mb-3 inline-flex size-11 items-center justify-center rounded-2xl border", toneStyles.iconWrap)}>
              <Icon className="size-5" />
            </div>
            <CardDescription className="text-zinc-400">{label}</CardDescription>
            <CardTitle className={cn("mt-2 break-words text-[1.05rem] sm:text-[1.25rem]", toneStyles.valueText)}>{value}</CardTitle>
            {visibleEntries.length > 0 ? (
              <div className="mt-3 grid gap-1.5">
                {breakdownLabel ? <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{breakdownLabel}</p> : null}
                {visibleEntries.map((entry) => (
                  <div key={`${label}-${entry.currency}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-zinc-400">{entry.currency}</span>
                    <span className="font-medium text-zinc-100">{formatMoney(String(entry.amount), entry.currency)}</span>
                  </div>
                ))}
                {breakdown.length > 2 && moreLabel && collapseLabel ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setBreakdownExpanded((current) => !current);
                    }}
                    className="mt-2 inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]"
                  >
                    <span>
                      {breakdownExpanded ? collapseLabel : moreLabel.replace("{count}", String(remainingCount))}
                    </span>
                    <RiArrowRightUpLine
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        breakdownExpanded ? "rotate-90 text-zinc-200" : "text-zinc-200",
                      )}
                    />
                  </button>
                ) : null}
              </div>
            ) : null}
            {onOpenBreakdown ? (
              <div className="mt-auto pt-4">
                <div className={cn("inline-flex max-w-full items-center overflow-hidden rounded-full border px-3 py-1.5 text-xs font-medium transition", toneStyles.actionWrap)}>
                  <span className="min-w-0 truncate">{actionLabel}</span>
                  <span className={cn("ml-2 inline-flex size-6 shrink-0 items-center justify-center rounded-full border bg-black/20 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5", toneStyles.actionDot)}>
                    <RiArrowRightUpLine className="size-3.5" />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex min-w-0 flex-col items-start gap-3 sm:items-end">
            {typeof progressValue === "number" ? (
              <div
                className={cn("grid size-16 place-items-center rounded-full border text-sm font-semibold text-white", toneStyles.actionDot)}
                style={{ background: `conic-gradient(${toneStyles.progressTrack} 0 ${progressValue}%, rgba(255,255,255,0.06) ${progressValue}% 100%)` }}
              >
                <div className="grid size-12 place-items-center rounded-full bg-[#07110c] text-xs">{Math.round(progressValue)}%</div>
              </div>
            ) : null}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function PriorityPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
      <p className="break-words text-xs uppercase leading-5 tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-5 font-medium text-zinc-100 sm:text-base">{value}</p>
    </div>
  );
}

export function EmptyState({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("w-full rounded-[1.6rem] border border-dashed border-white/10 bg-black/12 px-5 py-10 text-center text-sm text-zinc-500", className)}>
      {text}
    </div>
  );
}

export function QuickActionRow({
  label,
  icon: Icon,
  onClick,
  compact = false,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        compact
          ? "flex h-11 items-center gap-3 rounded-2xl border border-white/8 bg-black/15 px-4 text-left text-sm text-zinc-200 transition hover:bg-white/[0.04] hover:text-white"
          : "flex w-full items-center justify-between rounded-[1.2rem] border border-white/8 bg-black/15 px-4 py-3 text-left text-sm text-zinc-200 transition hover:bg-white/[0.04] hover:text-white"
      }
    >
      <span className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
          <Icon className="size-4" />
        </span>
        <span>{label}</span>
      </span>
      {!compact ? <RiAddLine className="size-4 text-emerald-200" /> : null}
    </button>
  );
}
