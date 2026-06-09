import { cn } from "@/lib/utils";

type HeaderGeometryOrnamentProps = {
  className?: string;
  align?: "left" | "center" | "right";
  tone?: "cyan" | "emerald" | "mixed";
  scale?: "sm" | "md" | "lg";
};

const toneMap = {
  cyan: {
    frame: "border-cyan-300/20",
    glow: "bg-cyan-300/14",
    line: "from-cyan-300/0 via-cyan-300/40 to-cyan-300/0",
    dot: "bg-cyan-200",
    panel: "bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_28%),linear-gradient(135deg,rgba(34,211,238,0.08),transparent_58%)]",
  },
  emerald: {
    frame: "border-emerald-300/20",
    glow: "bg-emerald-300/14",
    line: "from-emerald-300/0 via-emerald-300/40 to-emerald-300/0",
    dot: "bg-emerald-200",
    panel: "bg-[radial-gradient(circle_at_18%_18%,rgba(74,222,128,0.18),transparent_28%),linear-gradient(135deg,rgba(74,222,128,0.08),transparent_58%)]",
  },
  mixed: {
    frame: "border-white/12",
    glow: "bg-cyan-300/12",
    line: "from-cyan-300/0 via-white/30 to-emerald-300/0",
    dot: "bg-white",
    panel: "bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(74,222,128,0.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_58%)]",
  },
} as const;

const scaleMap = {
  sm: "w-[11rem] h-[5.75rem]",
  md: "w-[13rem] h-[6.75rem]",
  lg: "w-[15rem] h-[7.5rem]",
} as const;

const alignMap = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
} as const;

export function HeaderGeometryOrnament({
  className,
  align = "right",
  tone = "mixed",
  scale = "md",
}: HeaderGeometryOrnamentProps) {
  const palette = toneMap[tone];

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-full mt-4 hidden opacity-90 lg:block",
        alignMap[align],
        className,
      )}
      aria-hidden="true"
    >
      <div className={cn("relative overflow-hidden rounded-[1.8rem] border bg-black/18 backdrop-blur-xl", scaleMap[scale], palette.frame)}>
        <div className={cn("absolute inset-0 opacity-90", palette.panel)} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30" />
        <div className={cn("absolute inset-x-5 top-0 h-px bg-gradient-to-r", palette.line)} />
        <div className={cn("absolute -right-6 top-4 h-16 w-16 rounded-full blur-2xl", palette.glow)} />

        <div className="relative h-full w-full">
          <div className={cn("absolute left-5 top-5 h-10 w-10 rotate-45 rounded-[1rem] border", palette.frame)} />
          <div className={cn("absolute left-10 top-7 h-5 w-5 rotate-45 rounded-[0.45rem] border", palette.frame)} />
          <div className={cn("absolute right-6 top-5 h-12 w-12 rounded-full border", palette.frame)} />
          <div className={cn("absolute right-10 top-9 h-4 w-4 rounded-full", palette.dot, "shadow-[0_0_14px_rgba(255,255,255,0.32)]")} />
          <div className={cn("absolute left-[4.75rem] top-[2.25rem] h-px w-[3.5rem] bg-gradient-to-r", palette.line)} />
          <div className={cn("absolute left-[6.5rem] top-[3.4rem] h-px w-[4.75rem] -rotate-[24deg] bg-gradient-to-r", palette.line)} />
          <div className={cn("absolute bottom-5 left-6 h-px w-[4rem] bg-gradient-to-r", palette.line)} />
          <div className={cn("absolute bottom-[1.05rem] left-[6.6rem] h-2.5 w-2.5 rounded-full", palette.dot, "shadow-[0_0_12px_rgba(255,255,255,0.28)]")} />
          <div className={cn("absolute bottom-4 right-6 h-7 w-7 rounded-[0.8rem] border", palette.frame)} />
        </div>
      </div>
    </div>
  );
}
