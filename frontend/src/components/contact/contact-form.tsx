"use client";

import { type FormEvent, useMemo, useState } from "react";
import { RiArrowRightUpLine, RiCheckboxCircleFill } from "react-icons/ri";

import { submitContactMessage } from "@/lib/api/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ContactFormCopy = {
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  footnote: string;
  success: string;
  sending: string;
  error: string;
  topicLabel: string;
  topics: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  tipsTitle: string;
  tips: string[];
};

type ContactFormProps = {
  copy: ContactFormCopy;
  variant?: "compact" | "expanded";
};

export function ContactForm({
  copy,
  variant = "expanded",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    topic: copy.topics[0]?.value ?? "",
  });

  const activeTopic = useMemo(
    () => copy.topics.find((topic) => topic.value === form.topic) ?? copy.topics[0],
    [copy.topics, form.topic],
  );
  const isCompact = variant === "compact";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    setError("");
    setIsSubmitting(true);

    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: activeTopic
          ? `[${activeTopic.label}] ${form.message}`
          : form.message,
      });
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        topic: copy.topics[0]?.value ?? "",
      });
    } catch {
      setError(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={isCompact ? "space-y-6" : "grid gap-6 2xl:grid-cols-[minmax(0,1fr)_18rem]"}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-[1.8rem] border border-white/10 bg-black/18 p-4 sm:p-5">
          <Label className="text-sm text-white/80">{copy.topicLabel}</Label>
          <div
            className={`mt-4 grid gap-3 ${
              isCompact ? "sm:grid-cols-3" : "lg:grid-cols-2 2xl:grid-cols-3"
            }`}
          >
            {copy.topics.map((topic) => {
              const isActive = form.topic === topic.value;

              return (
                <button
                  key={topic.value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, topic: topic.value }))}
                  className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                    isActive
                      ? "border-emerald-300/30 bg-emerald-300/12 shadow-[0_20px_50px_rgba(74,222,128,0.12)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white">{topic.label}</div>
                    {isActive ? (
                      <RiCheckboxCircleFill className="size-4 text-emerald-300" />
                    ) : (
                      <RiArrowRightUpLine className="size-4 text-white/32" />
                    )}
                  </div>
                  {!isCompact ? (
                    <p className="mt-2 text-xs leading-6 text-white/56">
                      {topic.description}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-sm text-white/78">
              {copy.nameLabel}
            </Label>
            <Input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder={copy.namePlaceholder}
              className="h-12 border-white/10 bg-white/6 text-white placeholder:text-white/34"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-sm text-white/78">
              {copy.emailLabel}
            </Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder={copy.emailPlaceholder}
              className="h-12 border-white/10 bg-white/6 text-white placeholder:text-white/34"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-sm text-white/78">
            {copy.phoneLabel}
          </Label>
          <Input
            id="contact-phone"
            name="phone"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder={copy.phonePlaceholder}
            className="h-12 border-white/10 bg-white/6 text-white placeholder:text-white/34"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-sm text-white/78">
            {copy.messageLabel}
          </Label>
          <Textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            placeholder={copy.messagePlaceholder}
            className="min-h-40 resize-none border-white/10 bg-white/6 text-white placeholder:text-white/34"
            required
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`text-sm leading-6 ${
              error ? "text-rose-200" : submitted ? "text-emerald-200" : "text-white/48"
            }`}
          >
            {error || (submitted ? copy.success : copy.footnote)}
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full bg-emerald-300 px-6 text-sm font-semibold text-slate-950 hover:bg-emerald-200"
          >
            {isSubmitting ? copy.sending : copy.submit}
          </Button>
        </div>
      </form>

      {!isCompact ? (
        <aside className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,18,0.8),rgba(8,12,16,0.95))] p-5">
          <div className="text-[0.68rem] uppercase tracking-[0.18em] text-white/46">
            {copy.tipsTitle}
          </div>
          <div className="mt-4 space-y-3">
            {copy.tips.map((tip) => (
              <div
                key={tip}
                className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/72"
              >
                {tip}
              </div>
            ))}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
