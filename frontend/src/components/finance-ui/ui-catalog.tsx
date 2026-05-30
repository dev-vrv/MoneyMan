"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiAlarmWarningLine,
  RiArrowRightUpLine,
  RiBankCardLine,
  RiCheckDoubleLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiDatabase2Line,
  RiDownload2Line,
  RiExchangeDollarLine,
  RiFileChartLine,
  RiFilter3Line,
  RiFlashlightLine,
  RiFolderOpenLine,
  RiFundsBoxLine,
  RiLayoutGridLine,
  RiMailLine,
  RiMore2Fill,
  RiNotification3Line,
  RiRepeat2Line,
  RiSafe2Line,
  RiSearchLine,
  RiShieldCheckLine,
  RiSideBarLine,
  RiSlideshowLine,
  RiStackLine,
  RiTimeLine,
  RiWallet3Line,
} from "react-icons/ri";

import {
  DatePickerField,
  FieldShell,
  MetricCard,
  MoneyInput,
  SearchField,
  TimePickerField,
} from "@/components/finance-ui/finance-fields";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useTranslations } from "@/lib/i18n/client";
import { getLocalizedPath } from "@/lib/i18n/config";

export function UiCatalog() {
  const locale = useLocale();
  const messages = useTranslations().uiCatalog;
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [riskMode, setRiskMode] = useState("balanced");
  const [reviewScore, setReviewScore] = useState([72]);
  const [syncRealtime, setSyncRealtime] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [includeTransfers, setIncludeTransfers] = useState(false);
  const [compactMode, setCompactMode] = useState(true);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(163,230,53,0.08),_transparent_22%),linear-gradient(180deg,_#040806_0%,_#07100b_100%)] px-6 py-16 text-white sm:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-sm font-medium text-emerald-100 hover:bg-emerald-300/10">
                {messages.badges.debug}
              </Badge>
              <Badge className="rounded-full border border-white/10 bg-emerald-950/20 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-emerald-950/20">
                {messages.badges.hidden}
              </Badge>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {messages.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-zinc-300">
                {messages.description}
              </p>
            </div>
          </div>

          <Link
            href={getLocalizedPath(locale, "/")}
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-emerald-950/20 px-6 text-sm font-medium text-zinc-100 transition hover:border-emerald-300/20 hover:bg-emerald-900/30"
          >
            {messages.backHome}
            <RiArrowRightUpLine className="size-4 shrink-0" />
          </Link>
        </header>

        <section className="grid gap-4 lg:grid-cols-4">
          <MetricCard
            title={messages.metrics.unifiedBalance.title}
            value={messages.metrics.unifiedBalance.value}
            caption={messages.metrics.unifiedBalance.caption}
            icon={<RiWallet3Line className="size-5" />}
          />
          <MetricCard
            title={messages.metrics.runway.title}
            value={messages.metrics.runway.value}
            caption={messages.metrics.runway.caption}
            icon={<RiFundsBoxLine className="size-5" />}
          />
          <MetricCard
            title={messages.metrics.subscriptions.title}
            value={messages.metrics.subscriptions.value}
            caption={messages.metrics.subscriptions.caption}
            icon={<RiRepeat2Line className="size-5" />}
          />
          <MetricCard
            title={messages.metrics.securityScore.title}
            value={messages.metrics.securityScore.value}
            caption={messages.metrics.securityScore.caption}
            icon={<RiShieldCheckLine className="size-5" />}
          />
        </section>

        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-2 md:grid-cols-4">
            <TabsTrigger value="inputs">{messages.tabs.inputs}</TabsTrigger>
            <TabsTrigger value="actions">{messages.tabs.actions}</TabsTrigger>
            <TabsTrigger value="feedback">{messages.tabs.feedback}</TabsTrigger>
            <TabsTrigger value="data">{messages.tabs.data}</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="mt-6 space-y-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,380px)]">
              <div className="surface-panel rounded-[2rem] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{messages.inputs.title}</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {messages.inputs.description}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
                    <RiLayoutGridLine className="size-5" />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <SearchField value={search} onChange={setSearch} />

                  <FieldShell
                    label={messages.fields.email.label}
                    description={messages.fields.email.description}
                  >
                    <div className="relative">
                      <RiMailLine className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-emerald-200" />
                      <Input
                        type="email"
                        placeholder={messages.fields.email.placeholder}
                        className="surface-field h-11 rounded-2xl pl-11"
                      />
                    </div>
                  </FieldShell>

                  <MoneyInput
                    value={amount}
                    onChange={setAmount}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                  />

                  <FieldShell
                    label={messages.fields.password.label}
                    description={messages.fields.password.description}
                  >
                    <Input
                      type="password"
                      placeholder={messages.fields.password.placeholder}
                      className="surface-field h-11 rounded-2xl"
                    />
                  </FieldShell>

                  <DatePickerField value={selectedDate} onChange={setSelectedDate} />

                  <TimePickerField
                    hour={selectedHour}
                    minute={selectedMinute}
                    onHourChange={setSelectedHour}
                    onMinuteChange={setSelectedMinute}
                  />

                  <FieldShell
                    label={messages.fields.accountType.label}
                    description={messages.fields.accountType.description}
                  >
                    <Select defaultValue="shared">
                      <SelectTrigger className="surface-field h-11 rounded-2xl text-zinc-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="surface-floating rounded-2xl text-zinc-100">
                        <SelectItem value="personal">
                          {messages.inputs.accountTypes.personal}
                        </SelectItem>
                        <SelectItem value="shared">
                          {messages.inputs.accountTypes.shared}
                        </SelectItem>
                        <SelectItem value="treasury">
                          {messages.inputs.accountTypes.treasury}
                        </SelectItem>
                        <SelectItem value="business">
                          {messages.inputs.accountTypes.business}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>

                  <FieldShell
                    label={messages.fields.phone.label}
                    description={messages.fields.phone.description}
                  >
                    <Input
                      type="tel"
                      placeholder={messages.fields.phone.placeholder}
                      className="surface-field h-11 rounded-2xl"
                    />
                  </FieldShell>

                  <div className="md:col-span-2">
                    <FieldShell
                      label={messages.fields.notes.label}
                      description={messages.fields.notes.description}
                    >
                      <Textarea
                        placeholder={messages.fields.notes.placeholder}
                        className="surface-field min-h-28 rounded-3xl"
                      />
                    </FieldShell>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-panel rounded-[2rem] p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold">
                      {messages.inputs.controlGroupsTitle}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {messages.inputs.controlGroupsDescription}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <FieldShell
                      label={messages.inputs.riskMode.label}
                      description={messages.inputs.riskMode.description}
                    >
                      <RadioGroup
                        value={riskMode}
                        onValueChange={(value) => {
                          if (value !== null) {
                            setRiskMode(value);
                          }
                        }}
                        className="grid gap-3"
                      >
                        {[
                          {
                            value: "conservative",
                            label: messages.inputs.riskMode.options.conservative,
                          },
                          {
                            value: "balanced",
                            label: messages.inputs.riskMode.options.balanced,
                          },
                          {
                            value: "aggressive",
                            label: messages.inputs.riskMode.options.aggressive,
                          },
                        ].map((item) => (
                          <label
                            key={item.value}
                            className="surface-panel-muted flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-200"
                          >
                            <RadioGroupItem value={item.value} />
                            {item.label}
                          </label>
                        ))}
                      </RadioGroup>
                    </FieldShell>

                    <FieldShell
                      label={messages.inputs.reviewScore.label}
                      description={messages.inputs.reviewScore.description}
                    >
                      <div className="surface-panel-muted rounded-3xl px-4 py-5">
                        <div className="mb-4 flex items-center justify-between text-sm">
                          <span className="text-zinc-300">
                            {messages.inputs.reviewScore.caption}
                          </span>
                          <span className="font-medium text-emerald-200">{reviewScore[0]}%</span>
                        </div>
                        <Slider
                          value={reviewScore}
                          onValueChange={(value) => {
                            setReviewScore(Array.isArray(value) ? [...value] : [value]);
                          }}
                          max={100}
                          step={1}
                        />
                      </div>
                    </FieldShell>

                    <div className="space-y-3">
                      {[
                        {
                          label: messages.inputs.switches.realtimeSync.label,
                          description: messages.inputs.switches.realtimeSync.description,
                          checked: syncRealtime,
                          onCheckedChange: setSyncRealtime,
                        },
                        {
                          label: messages.inputs.switches.budgetAlerts.label,
                          description: messages.inputs.switches.budgetAlerts.description,
                          checked: budgetAlerts,
                          onCheckedChange: setBudgetAlerts,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="surface-panel-muted flex items-center justify-between rounded-2xl px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{item.label}</p>
                            <p className="text-xs text-zinc-400">{item.description}</p>
                          </div>
                          <Switch
                            checked={item.checked}
                            onCheckedChange={(checked) =>
                              item.onCheckedChange(Boolean(checked))
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          label: messages.inputs.checkboxes.includeTransfers,
                          checked: includeTransfers,
                          onCheckedChange: setIncludeTransfers,
                        },
                        {
                          label: messages.inputs.checkboxes.compactMode,
                          checked: compactMode,
                          onCheckedChange: setCompactMode,
                        },
                      ].map((item) => (
                        <label
                          key={item.label}
                          className="surface-panel-muted flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-200"
                        >
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={(checked) => item.onCheckedChange(Boolean(checked))}
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Accordion
                  defaultValue={["advanced"]}
                  className="surface-panel rounded-[2rem] px-6"
                >
                  <AccordionItem value="advanced" className="border-none">
                    <AccordionTrigger className="py-5 text-left text-base font-semibold text-white">
                      {messages.inputs.advanced.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <div className="grid gap-4">
                        <div className="surface-panel-muted rounded-2xl p-4 text-sm text-zinc-300">
                          {messages.inputs.advanced.description}
                        </div>
                        <Button variant="outline" className="justify-start rounded-2xl border-white/10 bg-transparent text-zinc-200">
                          <RiFilter3Line className="size-4 text-emerald-200" />
                          {messages.inputs.advanced.action}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="actions" className="mt-6 space-y-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,420px)]">
              <div className="surface-panel rounded-[2rem] p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">{messages.actions.title}</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {messages.actions.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="surface-panel-muted rounded-3xl p-4">
                    <p className="mb-4 text-sm font-medium text-zinc-200">
                      {messages.actions.actionButtons}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button className="rounded-2xl border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 text-slate-950 shadow-[0_12px_30px_rgba(74,222,128,0.16)] hover:brightness-105">
                        <RiExchangeDollarLine className="size-4" />
                        {messages.actions.buttons.createTransfer}
                      </Button>
                      <Button variant="secondary" className="rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-100 hover:bg-white/[0.08]">
                        <RiDownload2Line className="size-4" />
                        {messages.actions.buttons.export}
                      </Button>
                      <Button variant="outline" className="rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/[0.04]">
                        <RiFileChartLine className="size-4 text-emerald-200" />
                        {messages.actions.buttons.report}
                      </Button>
                    </div>
                  </div>

                  <div className="surface-panel-muted rounded-3xl p-4">
                    <p className="mb-4 text-sm font-medium text-zinc-200">
                      {messages.actions.dropdown.title}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-10 w-full items-center justify-between rounded-2xl border border-white/10 bg-emerald-950/20 px-4 text-sm text-zinc-100">
                        {messages.actions.dropdown.trigger}
                        <RiMore2Fill className="size-4 text-emerald-200" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="surface-floating rounded-2xl text-zinc-100">
                        <DropdownMenuLabel>{messages.actions.dropdown.label}</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <RiWallet3Line className="size-4 text-emerald-200" />
                          {messages.actions.dropdown.reconcileBalances}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RiNotification3Line className="size-4 text-emerald-200" />
                          {messages.actions.dropdown.createAlert}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          {messages.actions.dropdown.includeHiddenWallets}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          {messages.actions.dropdown.showArchivedCategories}
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="surface-panel-muted rounded-3xl p-4">
                    <p className="mb-4 text-sm font-medium text-zinc-200">
                      {messages.actions.modal.title}
                    </p>
                    <Dialog>
                      <DialogTrigger className="flex h-10 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 font-medium text-slate-950 shadow-[0_12px_30px_rgba(74,222,128,0.16)]">
                        {messages.actions.modal.trigger}
                      </DialogTrigger>
                      <DialogContent className="surface-floating max-w-lg rounded-[1.75rem] p-0 text-zinc-100">
                        <DialogHeader className="px-6 pt-6">
                          <DialogTitle>{messages.actions.modal.heading}</DialogTitle>
                          <DialogDescription className="text-zinc-400">
                            {messages.actions.modal.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="px-6 py-2">
                          <div className="surface-panel-muted rounded-3xl p-4 text-sm text-zinc-300">
                            {messages.actions.modal.body}
                          </div>
                        </div>
                        <DialogFooter className="border-white/10 bg-white/[0.03]">
                          <Button variant="outline" className="rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/[0.04]">
                            {messages.actions.modal.reviewDetails}
                          </Button>
                          <Button className="rounded-2xl border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 text-slate-950 shadow-[0_12px_30px_rgba(74,222,128,0.16)] hover:brightness-105">
                            {messages.actions.modal.confirm}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="surface-panel-muted rounded-3xl p-4">
                    <p className="mb-4 text-sm font-medium text-zinc-200">
                      {messages.actions.sheet.title}
                    </p>
                    <Sheet>
                      <SheetTrigger className="flex h-10 w-full items-center justify-center rounded-2xl border border-white/10 bg-emerald-950/20 font-medium text-zinc-100">
                        {messages.actions.sheet.trigger}
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="surface-floating text-zinc-100 sm:max-w-md"
                      >
                        <SheetHeader>
                          <SheetTitle>{messages.actions.sheet.heading}</SheetTitle>
                          <SheetDescription className="text-zinc-400">
                            {messages.actions.sheet.description}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 px-4">
                          <Input
                            placeholder={messages.actions.sheet.merchantPlaceholder}
                            className="surface-field h-11 rounded-2xl"
                          />
                          <Input
                            placeholder={messages.actions.sheet.amountPlaceholder}
                            className="surface-field h-11 rounded-2xl"
                          />
                          <Select defaultValue="food">
                            <SelectTrigger className="surface-field h-11 rounded-2xl text-zinc-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="surface-floating rounded-2xl text-zinc-100">
                              <SelectItem value="food">
                                {messages.actions.sheet.categories.food}
                              </SelectItem>
                              <SelectItem value="infra">
                                {messages.actions.sheet.categories.infrastructure}
                              </SelectItem>
                              <SelectItem value="crypto">
                                {messages.actions.sheet.categories.crypto}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <SheetFooter>
                          <Button variant="outline" className="rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/[0.04]">
                            {messages.actions.sheet.saveDraft}
                          </Button>
                          <Button className="rounded-2xl border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 text-slate-950 shadow-[0_12px_30px_rgba(74,222,128,0.16)] hover:brightness-105">
                            {messages.actions.sheet.submit}
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              <div className="surface-panel rounded-[2rem] p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{messages.actions.dangerZone.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {messages.actions.dangerZone.description}
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger className="flex h-11 w-full items-center justify-center rounded-2xl bg-red-500/14 font-medium text-red-200 hover:bg-red-500/20">
                    {messages.actions.dangerZone.trigger}
                  </AlertDialogTrigger>
                  <AlertDialogContent className="surface-floating rounded-[1.75rem] text-zinc-100">
                    <AlertDialogHeader>
                      <AlertDialogMedia className="bg-red-500/14 text-red-200">
                        <RiAlarmWarningLine className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>{messages.actions.dangerZone.heading}</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        {messages.actions.dangerZone.body}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="border-white/10 bg-white/[0.03]">
                      <AlertDialogCancel className="rounded-2xl border-white/10 bg-transparent text-zinc-200">
                        {messages.actions.dangerZone.cancel}
                      </AlertDialogCancel>
                      <AlertDialogAction className="rounded-2xl bg-red-500/14 text-red-200 hover:bg-red-500/20">
                        {messages.actions.dangerZone.disconnect}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="surface-panel-muted mt-6 rounded-3xl p-5">
                  <p className="mb-4 text-sm font-medium text-zinc-200">
                    {messages.actions.recommendations.title}
                  </p>
                  <div className="space-y-3 text-sm text-zinc-300">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <RiSafe2Line className="mt-0.5 size-4 text-emerald-200" />
                      {messages.actions.recommendations.items[0]}
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <RiBankCardLine className="mt-0.5 size-4 text-emerald-200" />
                      {messages.actions.recommendations.items[1]}
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <RiDatabase2Line className="mt-0.5 size-4 text-emerald-200" />
                      {messages.actions.recommendations.items[2]}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="feedback" className="mt-6 space-y-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
              <div className="surface-panel space-y-4 rounded-[2rem] p-6">
                <div>
                  <h2 className="text-2xl font-semibold">{messages.feedback.title}</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {messages.feedback.description}
                  </p>
                </div>

                <Alert className="rounded-3xl border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                  <RiCheckboxCircleLine className="size-4" />
                  <AlertTitle>{messages.feedback.alerts.success.title}</AlertTitle>
                  <AlertDescription className="text-emerald-100/80">
                    {messages.feedback.alerts.success.description}
                  </AlertDescription>
                  <AlertAction>
                    <Button size="xs" className="rounded-xl border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 text-slate-950 hover:brightness-105">
                      <RiCheckDoubleLine className="size-3.5" />
                      {messages.feedback.alerts.success.action}
                    </Button>
                  </AlertAction>
                </Alert>

                <Alert className="rounded-3xl border-amber-400/20 bg-amber-400/10 text-amber-100">
                  <RiTimeLine className="size-4" />
                  <AlertTitle>{messages.feedback.alerts.warning.title}</AlertTitle>
                  <AlertDescription className="text-amber-100/80">
                    {messages.feedback.alerts.warning.description}
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive" className="rounded-3xl border-red-500/20 bg-red-500/10">
                  <RiCloseCircleLine className="size-4" />
                  <AlertTitle>{messages.feedback.alerts.error.title}</AlertTitle>
                  <AlertDescription>
                    {messages.feedback.alerts.error.description}
                  </AlertDescription>
                </Alert>
              </div>

              <div className="surface-panel space-y-6 rounded-[2rem] p-6">
                <div>
                  <h3 className="text-lg font-semibold">{messages.feedback.progress.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {messages.feedback.progress.description}
                  </p>
                </div>

                <div className="surface-panel-muted rounded-3xl p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      {messages.feedback.progress.historicalImport}
                    </span>
                    <span className="text-sm font-medium text-emerald-200">67%</span>
                  </div>
                  <Progress value={67} className="h-2 rounded-full bg-white/10" />
                </div>

                <div className="surface-panel-muted rounded-3xl border-dashed p-6 text-center">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                    <RiFolderOpenLine className="size-6" />
                  </div>
                  <p className="text-base font-medium text-white">
                    {messages.feedback.progress.emptyState.title}
                  </p>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-400">
                    {messages.feedback.progress.emptyState.description}
                  </p>
                  <Button className="mt-5 rounded-2xl border border-emerald-300/20 bg-linear-to-r from-emerald-300 via-emerald-400 to-lime-300 text-slate-950 shadow-[0_12px_30px_rgba(74,222,128,0.16)] hover:brightness-105">
                    <RiFlashlightLine className="size-4" />
                    {messages.feedback.progress.emptyState.action}
                  </Button>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="data" className="mt-6 space-y-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,380px)]">
              <div className="surface-panel rounded-[2rem] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{messages.data.title}</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {messages.data.description}
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-2xl border-white/10 bg-transparent text-zinc-200">
                    <RiSearchLine className="size-4 text-emerald-200" />
                    {messages.data.filter}
                  </Button>
                </div>

                <Table className="rounded-3xl">
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-zinc-400">
                        {messages.data.columns.merchant}
                      </TableHead>
                      <TableHead className="text-zinc-400">
                        {messages.data.columns.category}
                      </TableHead>
                      <TableHead className="text-zinc-400">
                        {messages.data.columns.amount}
                      </TableHead>
                      <TableHead className="text-zinc-400">
                        {messages.data.columns.status}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.data.transactions.map((item) => (
                      <TableRow key={item.merchant} className="border-white/8 hover:bg-white/[0.03]">
                        <TableCell className="font-medium text-zinc-100">{item.merchant}</TableCell>
                        <TableCell className="text-zinc-300">{item.category}</TableCell>
                        <TableCell className={item.amount.startsWith("+") ? "text-emerald-200" : "text-zinc-100"}>
                          {item.amount}
                        </TableCell>
                        <TableCell>
                          <Badge className="rounded-full border border-white/10 bg-emerald-950/20 text-zinc-200 hover:bg-emerald-950/20">
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="surface-panel space-y-6 rounded-[2rem] p-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {messages.data.buildingBlocks.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {messages.data.buildingBlocks.description}
                  </p>
                </div>

                <div className="grid gap-4">
                  {messages.data.buildingBlocks.items.map(({ title, description }, index) => {
                    const Icon = [RiSlideshowLine, RiSideBarLine, RiStackLine][index];

                    return (
                      <div
                        key={title}
                        className="surface-panel-muted rounded-3xl p-5"
                      >
                        <div className="mb-3 inline-flex rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
                          <Icon className="size-5" />
                        </div>
                        <p className="text-base font-semibold text-white">{title}</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
