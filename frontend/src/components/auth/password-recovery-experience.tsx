"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiArrowRightUpLine,
  RiMailLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { toast } from "sonner";

import { FinancialLoaderVisual } from "@/components/feedback/financial-loader";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type PasswordRecoveryExperienceProps = {
  locale: Locale;
  header: Dictionary["header"];
  content: Dictionary["passwordRecovery"];
};

export function PasswordRecoveryExperience({
  locale,
  content,
}: PasswordRecoveryExperienceProps) {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.message(content.messages.stub);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_24%),linear-gradient(180deg,_#040806_0%,_#08110d_44%,_#040705_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden border-b border-white/8 lg:min-h-screen lg:border-r lg:border-b-0 lg:border-white/8">
          <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full max-w-md flex-col items-center gap-8 px-8 text-center"
          >
            <FinancialLoaderVisual icon={<RiShieldCheckLine className="size-5" />} />

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                {content.title}
              </p>
              <AnimatedText
                text={content.form.title}
                as="h1"
                size="xl"
                className="font-semibold leading-[1.08] tracking-tight text-white"
                delay={0.08}
                duration={0.44}
                stagger={0.024}
              />
            </div>
          </motion.div>
        </section>

        <section className="flex min-h-[50vh] items-center justify-center lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl px-6 py-10 sm:px-10 lg:px-14"
          >
            <div className="mb-6 flex w-full flex-col gap-4">
              <Link
                href={getLocalizedPath(locale, "/")}
                className="inline-flex w-full items-center gap-3 px-1 py-2"
              >
                <span className="inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-emerald-300/20 bg-white/95 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                  <Image
                    src="/images/logo/fin.png"
                    alt={content.title}
                    width={44}
                    height={44}
                    className="size-9 object-contain"
                    priority
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {content.title}
                  </span>
                  <span className="block text-xs text-zinc-400">
                    {content.form.title}
                  </span>
                </span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">{content.form.title}</h2>
                <p className="text-sm leading-6 text-zinc-400">{content.form.description}</p>
              </div>

              <Field className="gap-3">
                <FieldLabel className="text-sm font-medium text-zinc-200">
                  {content.form.emailLabel}
                </FieldLabel>
                <div className="relative">
                  <RiMailLine className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={content.form.emailPlaceholder}
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-sm text-white placeholder:text-zinc-500 transition duration-300 focus-visible:border-emerald-300/30 focus-visible:ring-4 focus-visible:ring-emerald-300/10"
                  />
                </div>
                <FieldDescription className="text-zinc-500">
                  {content.form.footnote}
                </FieldDescription>
              </Field>

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-linear-to-r from-emerald-300 via-emerald-200 to-lime-200 text-slate-950"
              >
                {content.form.submit}
              </Button>

              <Link
                href={getLocalizedPath(locale, "/auth")}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {content.actions.backToAuth}
                <RiArrowRightUpLine className="size-4" />
              </Link>
            </form>
          </motion.div>
        </section>
      </section>
    </main>
  );
}
