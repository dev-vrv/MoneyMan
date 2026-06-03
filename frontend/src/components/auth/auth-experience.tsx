"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, startTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiArrowRightUpLine,
  RiFacebookCircleFill,
  RiGoogleFill,
  RiLock2Line,
  RiMailLine,
  RiTelegram2Fill,
  RiUser3Line,
} from "react-icons/ri";
import { toast } from "sonner";

import { FinancialLoaderVisual } from "@/components/feedback/financial-loader";
import { useAuth } from "@/components/providers/auth-provider";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type AuthExperienceProps = {
  locale: Locale;
  header: Dictionary["header"];
  content: Dictionary["auth"];
};

type AuthMode = "sign-in" | "sign-up";

const smoothEase = [0.22, 1, 0.36, 1] as const;
const exitEase = [0.4, 0, 1, 1] as const;

const panelVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: smoothEase },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.14, ease: exitEase },
  },
};

export function AuthExperience({ locale, content }: AuthExperienceProps) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const { signIn, signUp, status } = useAuth();
  const router = useRouter();

  const isSignIn = mode === "sign-in";
  const activeTheme = isSignIn ? content.showcase.signIn : content.showcase.signUp;
  const activeBadge = isSignIn ? content.badge : content.tabs.signUp;

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getLocalizedPath(locale, "/workspace"));
    }
  }, [locale, router, status]);

  async function handleSignInSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn({
        email: signInForm.email,
        password: signInForm.password,
      });
      toast.success(content.messages.signInSuccess);
      router.push(getLocalizedPath(locale, "/workspace"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : content.messages.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignUpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!consentChecked) {
      toast.error(content.messages.consentRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        password_confirmation: signUpForm.passwordConfirmation,
      });
      toast.success(content.messages.signUpSuccess);
      router.push(getLocalizedPath(locale, "/workspace"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : content.messages.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const formClasses =
    "h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 transition duration-300 focus-visible:border-emerald-300/30 focus-visible:ring-4 focus-visible:ring-emerald-300/10";
  const socialProviders = [
    { key: "facebook", label: content.social.facebook, icon: RiFacebookCircleFill },
    { key: "google", label: content.social.google, icon: RiGoogleFill },
    { key: "telegram", label: content.social.telegram, icon: RiTelegram2Fill },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_24%),linear-gradient(180deg,_#040806_0%,_#08110d_44%,_#040705_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden border-b border-white/8 lg:min-h-screen lg:border-r lg:border-b-0 lg:border-white/8">
          <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`content-${mode}`}
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative flex w-full max-w-md flex-col items-center gap-8 px-8 text-center"
            >
              <FinancialLoaderVisual icon={<RiUser3Line className="size-5" />} />

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                  {activeBadge}
                </p>
                <AnimatedText
                  key={activeTheme.title}
                  text={activeTheme.title}
                  as="h1"
                  size="xl"
                  className="text-2xl font-semibold leading-[1.28] tracking-tight text-white sm:text-3xl"
                  delay={0.08}
                  duration={0.44}
                  stagger={0.024}
                />
                <AnimatedText
                  key={activeTheme.description}
                  text={activeTheme.description}
                  as="p"
                  size="sm"
                  className="mx-auto max-w-md leading-7 text-slate-300"
                  delay={0.24}
                  duration={0.32}
                  stagger={0.01}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="flex min-h-[50vh] items-center justify-center lg:min-h-screen">
          <div className="w-full max-w-xl px-6 py-10 sm:px-10 lg:px-14">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex w-full flex-col gap-4">
                <Link
                  href={getLocalizedPath(locale, "/")}
                  className="inline-flex w-full items-center gap-3 px-1 py-2"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-linear-to-br from-emerald-200 via-emerald-300 to-lime-200 text-sm font-semibold text-slate-950">
                    FM
                  </span>
                    <span>
                    <span className="block text-sm font-semibold text-white">
                      {activeBadge}
                    </span>
                    <span className="block text-xs text-zinc-400">
                      {isSignIn ? content.signIn.title : content.signUp.title}
                    </span>
                  </span>
                </Link>

                <div className="w-full rounded-full border border-white/10 bg-white/5 p-1">
                  <div className="relative grid grid-cols-2 gap-1">
                    <motion.div
                      className="absolute inset-y-0 w-[calc(50%-2px)] rounded-full bg-linear-to-r from-emerald-300 via-emerald-200 to-lime-200"
                      animate={{ x: isSignIn ? "0%" : "100%" }}
                      transition={{ duration: 0.18, ease: smoothEase }}
                    />
                    <button
                      type="button"
                      onClick={() => startTransition(() => setMode("sign-in"))}
                      className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold ${isSignIn ? "text-slate-950" : "text-zinc-300"}`}
                    >
                      {content.tabs.signIn}
                    </button>
                    <button
                      type="button"
                      onClick={() => startTransition(() => setMode("sign-up"))}
                      className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold ${isSignIn ? "text-zinc-300" : "text-slate-950"}`}
                    >
                      {content.tabs.signUp}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {isSignIn ? (
                <motion.form
                  key="sign-in"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSignInSubmit}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {content.signIn.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {content.signIn.description}
                    </p>
                  </div>

                  <Field>
                    <FieldLabel className="text-sm font-medium text-zinc-200">
                      {content.signIn.fields.email}
                    </FieldLabel>
                    <div className="relative">
                      <RiMailLine className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        type="email"
                        required
                        value={signInForm.email}
                        onChange={(event) =>
                          setSignInForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder={content.placeholders.email}
                        className={`${formClasses} pl-11`}
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel className="text-sm font-medium text-zinc-200">
                      {content.signIn.fields.password}
                    </FieldLabel>
                    <div className="relative">
                      <RiLock2Line className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        type="password"
                        required
                        value={signInForm.password}
                        onChange={(event) =>
                          setSignInForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        placeholder={content.placeholders.password}
                        className={`${formClasses} pl-11`}
                      />
                    </div>
                  </Field>

                  <div className="grid grid-cols-3 gap-3">
                    {socialProviders.map((provider) => {
                      const Icon = provider.icon;

                      return (
                        <button
                          key={provider.key}
                          type="button"
                          aria-label={provider.label}
                          className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:bg-white/[0.06]"
                          onClick={() => toast.message(content.messages.socialStub)}
                        >
                          <Icon className="size-5" />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex items-center gap-3 text-zinc-300">
                      <Checkbox
                        checked={rememberDevice}
                        onCheckedChange={(nextValue) =>
                          setRememberDevice(Boolean(nextValue))
                        }
                        className="size-4.5 rounded-md border-white/16 bg-white/5"
                      />
                      <span>{content.signIn.remember}</span>
                    </label>
                    <Link
                      href={getLocalizedPath(locale, "/forgot-password")}
                      className="text-emerald-200 transition hover:text-white"
                    >
                      {content.signIn.forgotPassword}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-2xl bg-linear-to-r from-emerald-300 via-emerald-200 to-lime-200 text-slate-950"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="size-4 text-slate-950" />
                        {content.messages.pending}
                      </>
                    ) : (
                      content.signIn.submit
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="sign-up"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSignUpSubmit}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {content.signUp.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {content.signUp.description}
                    </p>
                  </div>

                  <Field>
                    <FieldLabel className="text-sm font-medium text-zinc-200">
                      {content.signUp.fields.email}
                    </FieldLabel>
                    <div className="relative">
                      <RiMailLine className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        type="email"
                        required
                        value={signUpForm.email}
                        onChange={(event) =>
                          setSignUpForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder={content.placeholders.email}
                        className={`${formClasses} pl-11`}
                      />
                    </div>
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel className="text-sm font-medium text-zinc-200">
                        {content.signUp.fields.password}
                      </FieldLabel>
                      <div className="relative">
                        <RiLock2Line className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          type="password"
                          required
                          value={signUpForm.password}
                          onChange={(event) =>
                            setSignUpForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          placeholder={content.placeholders.password}
                          className={`${formClasses} pl-11`}
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel className="text-sm font-medium text-zinc-200">
                        {content.signUp.fields.confirmPassword}
                      </FieldLabel>
                      <div className="relative">
                        <RiLock2Line className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          type="password"
                          required
                          value={signUpForm.passwordConfirmation}
                          onChange={(event) =>
                            setSignUpForm((current) => ({
                              ...current,
                              passwordConfirmation: event.target.value,
                            }))
                          }
                          placeholder={content.placeholders.confirmPassword}
                          className={`${formClasses} pl-11`}
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {socialProviders.map((provider) => {
                      const Icon = provider.icon;

                      return (
                        <button
                          key={provider.key}
                          type="button"
                          aria-label={provider.label}
                          className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:bg-white/[0.06]"
                          onClick={() => toast.message(content.messages.socialStub)}
                        >
                          <Icon className="size-5" />
                        </button>
                      );
                    })}
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300">
                    <Checkbox
                      checked={consentChecked}
                      onCheckedChange={(nextValue) =>
                        setConsentChecked(Boolean(nextValue))
                      }
                      className="mt-1 size-4.5 rounded-md border-white/16 bg-white/5"
                    />
                    <span>
                      {content.signUp.consent.prefix}{" "}
                      <Link
                        href={getLocalizedPath(locale, "/terms")}
                        className="text-emerald-200 transition hover:text-white"
                      >
                        {content.signUp.consent.terms}
                      </Link>{" "}
                      {content.signUp.consent.and}{" "}
                      <Link
                        href={getLocalizedPath(locale, "/security")}
                        className="text-emerald-200 transition hover:text-white"
                      >
                        {content.signUp.consent.privacy}
                      </Link>
                      .
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-2xl bg-linear-to-r from-emerald-300 via-emerald-200 to-lime-200 text-slate-950"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="size-4 text-slate-950" />
                        {content.messages.pending}
                      </>
                    ) : (
                      content.signUp.submit
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6">
              <Link
                href={getLocalizedPath(locale, "/")}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {content.footer.backHome}
                <RiArrowRightUpLine className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
