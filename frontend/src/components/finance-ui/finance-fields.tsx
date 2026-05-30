"use client";

import { format } from "date-fns";
import { RiCalendarLine, RiCoinsLine, RiSearchLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

type MoneyInputProps = {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
};

type DatePickerFieldProps = {
  value?: Date;
  onChange: (value?: Date) => void;
};

type TimePickerFieldProps = {
  hour: string;
  minute: string;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
};

type MetricCardProps = {
  title: string;
  value: string;
  caption: string;
  icon: React.ReactNode;
};

const hourOptions = Array.from({ length: 24 }, (_, index) =>
  index.toString().padStart(2, "0"),
);

const minuteOptions = ["00", "15", "30", "45"];

export function FieldShell({ label, description, children }: FieldShellProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium text-zinc-100">{label}</Label>
        {description ? <p className="text-xs text-zinc-400">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  const messages = useTranslations().uiCatalog.fields.search;

  return (
    <FieldShell label={messages.label} description={messages.description}>
      <InputGroup className="surface-field h-11 rounded-2xl">
        <InputGroupAddon>
          <InputGroupText>
            <RiSearchLine className="size-4 text-emerald-200" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={messages.placeholder}
          className="h-11 text-sm"
        />
      </InputGroup>
    </FieldShell>
  );
}

export function MoneyInput({
  value,
  onChange,
  currency,
  onCurrencyChange,
}: MoneyInputProps) {
  const messages = useTranslations().uiCatalog.fields.amount;

  return (
    <FieldShell label={messages.label} description={messages.description}>
      <InputGroup className="surface-field h-11 rounded-2xl">
        <InputGroupAddon>
          <InputGroupText>
            <RiCoinsLine className="size-4 text-emerald-200" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={messages.placeholder}
          className="h-11 text-sm"
        />
        <InputGroupAddon align="inline-end" className="pr-2">
          <Select
            value={currency}
            onValueChange={(value) => {
              if (value !== null) {
                onCurrencyChange(value);
              }
            }}
          >
            <SelectTrigger className="h-8 rounded-xl border-white/10 bg-emerald-950/20 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="surface-floating rounded-2xl text-zinc-100">
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="KZT">KZT</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </InputGroupAddon>
      </InputGroup>
    </FieldShell>
  );
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const messages = useTranslations().uiCatalog.fields.settlementDate;

  return (
    <FieldShell label={messages.label} description={messages.description}>
      <Popover>
        <PopoverTrigger className="surface-field flex h-11 w-full items-center justify-between rounded-2xl px-4 text-left text-sm text-zinc-100 transition hover:border-emerald-300/20">
          <span className={cn("truncate", !value && "text-zinc-500")}>
            {value ? format(value, "dd.MM.yyyy") : messages.placeholder}
          </span>
          <RiCalendarLine className="size-4 text-emerald-200" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={10}
          className="surface-floating w-auto rounded-3xl p-3"
        >
          <PopoverHeader className="px-1 pt-1">
            <PopoverTitle className="text-zinc-100">
              {messages.popoverTitle}
            </PopoverTitle>
            <PopoverDescription className="text-zinc-400">
              {messages.popoverDescription}
            </PopoverDescription>
          </PopoverHeader>
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            className="rounded-2xl bg-transparent"
          />
          <div className="flex justify-end px-1 pb-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange(undefined)}
              className="text-zinc-300 hover:text-white"
            >
              {messages.clear}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </FieldShell>
  );
}

export function TimePickerField({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: TimePickerFieldProps) {
  const messages = useTranslations().uiCatalog.fields.reminderTime;

  return (
    <FieldShell label={messages.label} description={messages.description}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <Select
          value={hour}
          onValueChange={(value) => {
            if (value !== null) {
              onHourChange(value);
            }
          }}
        >
          <SelectTrigger className="surface-field h-11 min-h-11 w-full rounded-2xl px-4 text-zinc-100">
            <SelectValue placeholder={messages.hourPlaceholder} />
          </SelectTrigger>
          <SelectContent className="surface-floating rounded-2xl text-zinc-100">
            {hourOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex h-11 w-9 shrink-0 items-center justify-center self-center rounded-2xl border border-white/10 bg-emerald-950/20 text-base font-semibold text-emerald-200">
          :
        </div>

        <Select
          value={minute}
          onValueChange={(value) => {
            if (value !== null) {
              onMinuteChange(value);
            }
          }}
        >
          <SelectTrigger className="surface-field h-11 min-h-11 w-full rounded-2xl px-4 text-zinc-100">
            <SelectValue placeholder={messages.minutePlaceholder} />
          </SelectTrigger>
          <SelectContent className="surface-floating rounded-2xl text-zinc-100">
            {minuteOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FieldShell>
  );
}

export function MetricCard({ title, value, caption, icon }: MetricCardProps) {
  const common = useTranslations().uiCatalog.common;

  return (
    <article className="surface-panel rounded-[1.6rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
          {icon}
        </div>
        <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          {common.live}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        <p className="text-xs text-zinc-500">{caption}</p>
      </div>
    </article>
  );
}
