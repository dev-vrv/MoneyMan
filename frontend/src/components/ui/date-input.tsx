"use client"

import * as React from "react"
import { RiCalendarLine } from "react-icons/ri"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function parseIsoDate(value?: string | null) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function formatIsoDate(value: Date) {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, "0")
  const day = `${value.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatDisplayDate(value?: string | null) {
  const parsed = parseIsoDate(value)
  if (!parsed) {
    return ""
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed)
}

type DateInputProps = {
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  allowClear?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}

function DateInput({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  allowClear = true,
  ...props
}: DateInputProps) {
  const selectedDate = React.useMemo(() => parseIsoDate(value), [value])

  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-11 min-h-11 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 text-left text-sm text-zinc-100 transition hover:border-emerald-300/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 user-invalid:border-destructive user-invalid:ring-3 user-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:user-invalid:border-destructive/50 dark:user-invalid:ring-destructive/40",
          className
        )}
        {...props}
      >
        <span className={cn("truncate", !value && "text-zinc-500")}>
          {formatDisplayDate(value) || placeholder || ""}
        </span>
        <RiCalendarLine className="size-4 shrink-0 text-emerald-200" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        className="surface-floating w-auto rounded-3xl p-3"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(nextValue) => onChange(nextValue ? formatIsoDate(nextValue) : "")}
          className="rounded-2xl bg-transparent"
        />
        {allowClear ? (
          <div className="flex justify-end px-1 pb-1 pt-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange("")}
              className="text-zinc-300 hover:text-white"
            >
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export { DateInput }
