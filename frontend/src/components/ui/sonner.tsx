"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { RiCheckboxCircleLine, RiInformationLine, RiErrorWarningLine, RiCloseCircleLine, RiLoader4Line } from "react-icons/ri"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      closeButton
      swipeDirections={[]}
      className="toaster group"
      icons={{
        success: (
          <RiCheckboxCircleLine className="size-4" />
        ),
        info: (
          <RiInformationLine className="size-4" />
        ),
        warning: (
          <RiErrorWarningLine className="size-4" />
        ),
        error: (
          <RiCloseCircleLine className="size-4" />
        ),
        loading: (
          <RiLoader4Line className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        closeButton: true,
        classNames: {
          toast: "cn-toast",
          closeButton:
            "text-zinc-400 transition hover:text-white focus-visible:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
