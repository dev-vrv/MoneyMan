"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const inputClasses =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, type, disabled, ...props }, ref) {
    const isPassword = type === "password"
    const [isVisible, setIsVisible] = React.useState(false)

    if (!isPassword) {
      return (
        <InputPrimitive
          ref={ref}
          type={type}
          data-slot="input"
          disabled={disabled}
          className={cn(inputClasses, className)}
          {...props}
        />
      )
    }

    return (
      <div className="relative">
        <InputPrimitive
          ref={ref}
          type={isVisible ? "text" : "password"}
          data-slot="input"
          disabled={disabled}
          className={cn(inputClasses, "pr-11", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? <RiEyeOffLine className="size-4" /> : <RiEyeLine className="size-4" />}
        </Button>
      </div>
    )
  }
)

export { Input }
