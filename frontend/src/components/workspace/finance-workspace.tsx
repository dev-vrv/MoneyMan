"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  RiAlertLine,
  RiArrowRightUpLine,
  RiBankCardLine,
  RiBarChartBoxLine,
  RiExchangeDollarLine,
  RiLogoutBoxRLine,
  RiNotification3Line,
  RiPieChartLine,
  RiWallet3Line,
} from "react-icons/ri";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWorkspaceOverview } from "@/lib/api/workspace";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type FinanceWorkspaceProps = {
  locale: Locale;
  content: Dictionary["workspace"];
};

function formatMoney(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function FinanceWorkspace({ locale, content }: FinanceWorkspaceProps) {
  const { status, user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(getLocalizedPath(locale, "/auth"));
    }
  }, [locale, router, status]);

  const overviewQuery = useQuery({
    queryKey: ["workspace-overview"],
    queryFn: fetchWorkspaceOverview,
    enabled: status === "authenticated",
  });

  if (status === "loading" || status === "unauthenticated" || overviewQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.18),_transparent_24%),linear-gradient(180deg,_#020504_0%,_#07110c_42%,_#040806_100%)] px-6">
        <div className="surface-panel flex w-full max-w-md items-center gap-4 rounded-[2rem] px-6 py-6">
          <Spinner className="size-5 text-emerald-200" />
          <div>
            <p className="text-sm font-medium text-white">{content.loading.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{content.loading.description}</p>
          </div>
        </div>
      </main>
    );
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="surface-panel max-w-xl rounded-[2rem] px-6 py-8 text-center">
          <p className="text-xl font-semibold text-white">{content.error.title}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{content.error.description}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl" onClick={() => overviewQuery.refetch()}>
              {content.error.retry}
            </Button>
            <Button className="h-11 rounded-2xl" onClick={() => signOut()}>
              {content.actions.signOut}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const { summary, accounts, budgets, transactions, widgets } = overviewQuery.data;
  const quickStats = [
    {
      label: content.summary.netWorth,
      value: formatMoney(summary.net_worth),
      icon: RiWallet3Line,
    },
    {
      label: content.summary.income,
      value: formatMoney(summary.monthly_income),
      icon: RiExchangeDollarLine,
    },
    {
      label: content.summary.expenses,
      value: formatMoney(summary.monthly_expenses),
      icon: RiBankCardLine,
    },
    {
      label: content.summary.savingsRate,
      value: `${summary.savings_rate}%`,
      icon: RiPieChartLine,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.18),_transparent_24%),radial-gradient(circle_at_86%_10%,_rgba(56,189,248,0.12),_transparent_20%),linear-gradient(180deg,_#020504_0%,_#07110c_40%,_#040806_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:68px_68px] opacity-15" />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pb-12 pt-8 sm:px-10 lg:px-12">
        <header className="surface-panel mb-8 rounded-[2rem] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-emerald-100" variant="outline">
                  {content.badge}
                </Badge>
                <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300" variant="outline">
                  {content.attention.replace("{count}", String(summary.attention_count))}
                </Badge>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {content.greeting.replace("{name}", user?.display_name ?? overviewQuery.data.user.display_name)}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {content.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="h-11 rounded-2xl bg-linear-to-r from-emerald-300 via-emerald-200 to-lime-200 text-slate-950">
                <RiExchangeDollarLine className="size-4" />
                {content.actions.addTransaction}
              </Button>
              <Button variant="outline" className="h-11 rounded-2xl border-white/10 bg-white/5 text-zinc-100 hover:bg-white/8">
                <RiBarChartBoxLine className="size-4" />
                {content.actions.planBudget}
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-white/10 bg-white/5 text-zinc-100 hover:bg-white/8"
                onClick={() => signOut()}
              >
                <RiLogoutBoxRLine className="size-4" />
                {content.actions.signOut}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.label} className="surface-panel-muted rounded-[1.8rem] border-white/8 bg-white/[0.04] py-0">
                <CardHeader className="px-5 pt-5">
                  <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl border border-emerald-300/16 bg-emerald-300/10 text-emerald-100">
                    <Icon className="size-5" />
                  </div>
                  <CardDescription className="text-zinc-400">{item.label}</CardDescription>
                  <CardTitle className="text-3xl text-white">{item.value}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,380px)]">
          <div className="space-y-6">
            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-white">{content.sections.widgets}</CardTitle>
                <CardDescription className="text-zinc-400">{content.sections.widgetsDescription}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-6 pb-6 md:grid-cols-3">
                {widgets.map((widget) => (
                  <div key={widget.title} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                    <p className="text-sm text-zinc-400">{widget.title}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{widget.value}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{widget.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-white">{content.sections.budgets}</CardTitle>
                <CardDescription className="text-zinc-400">{content.sections.budgetsDescription}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-6 pb-6">
                {budgets.map((budget) => (
                  <div key={budget.id} className="rounded-[1.5rem] border border-white/8 bg-black/18 px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-medium text-white">{budget.category}</p>
                        <p className="text-sm text-zinc-500">
                          {formatMoney(budget.spent)} / {formatMoney(budget.limit)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/5 text-zinc-200"
                      >
                        {Math.round(budget.utilization_percent)}%
                      </Badge>
                    </div>
                    <Progress value={budget.utilization_percent} className="gap-2">
                      <ProgressLabel className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {content.labels.utilization}
                      </ProgressLabel>
                      <div className="ml-auto text-xs text-zinc-400">
                        {content.remaining.replace("{value}", formatMoney(budget.remaining))}
                      </div>
                    </Progress>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-white">{content.sections.transactions}</CardTitle>
                <CardDescription className="text-zinc-400">{content.sections.transactionsDescription}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Table className="text-zinc-200">
                  <TableHeader>
                    <TableRow className="border-white/8 hover:bg-transparent">
                      <TableHead>{content.table.title}</TableHead>
                      <TableHead>{content.table.account}</TableHead>
                      <TableHead>{content.table.category}</TableHead>
                      <TableHead>{content.table.date}</TableHead>
                      <TableHead className="text-right">{content.table.amount}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-white/8 hover:bg-white/[0.03]">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{transaction.title}</div>
                            <div className="text-xs text-zinc-500">{transaction.merchant || transaction.status}</div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.account}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.transaction_date}</TableCell>
                        <TableCell className={`text-right font-medium ${transaction.amount.startsWith("-") ? "text-rose-300" : "text-emerald-300"}`}>
                          {formatMoney(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-white">{content.sections.accounts}</CardTitle>
                <CardDescription className="text-zinc-400">{content.sections.accountsDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6">
                {accounts.map((account) => (
                  <div key={account.id} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{account.name}</p>
                        <p className="text-sm text-zinc-500">{account.institution || account.kind}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{formatMoney(account.balance)}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{account.kind}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-white">{content.sections.priorities}</CardTitle>
                <CardDescription className="text-zinc-400">{content.sections.prioritiesDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="rounded-[1.4rem] border border-amber-300/12 bg-amber-300/7 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <RiNotification3Line className="size-5 text-amber-200" />
                    <p className="font-medium text-white">{content.priorityCards.obligationsTitle}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {content.priorityCards.obligationsBody.replace(
                      "{value}",
                      formatMoney(summary.scheduled_outflow),
                    )}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-cyan-300/12 bg-cyan-300/7 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <RiAlertLine className="size-5 text-cyan-200" />
                    <p className="font-medium text-white">{content.priorityCards.focusTitle}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {content.priorityCards.focusBody.replace(
                      "{count}",
                      String(summary.attention_count),
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-white">{content.sections.nextSteps}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-3">
                  {content.nextSteps.map((step) => (
                    <div key={step.title} className="rounded-[1.4rem] border border-white/8 bg-black/18 px-4 py-4">
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-5 bg-white/8" />
                <Link
                  href={getLocalizedPath(locale, "/")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  {content.backHome}
                  <RiArrowRightUpLine className="size-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
