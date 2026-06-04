export const enMessages = {
  metadata: {
    title: "Fin Man",
    description: "AI-powered financial management platform.",
  },
  loading: {
    brand: "Fin Man",
    title: "Building your financial workspace",
    description:
      "Preparing balances, analytics and connected modules in one secure flow.",
  },
  header: {
    logo: "Fin Man",
    navigation: {
      pricing: "Pricing",
      contacts: "Contacts",
      security: "Security",
      info: "Info",
    },
    infoMenu: {
      about: "About us",
      faq: "FAQ",
      roadmap: "Roadmap",
    },
    language: {
      label: "Language",
      en: "English",
      ru: "Russian",
      kg: "Kyrgyz",
    },
    actions: {
      auth: "Auth",
      workspace: "Workspace",
    },
  },
  home: {
    badge: "Fin Man Platform",
    architecture: "API-first fintech architecture",
    eyebrow: "Personal finance, crypto, analytics, AI",
    title: "Premium financial control built on a single scalable API core.",
    description:
      "Web, future mobile, integrations and automation all connect to one backend contract designed for secure financial operations.",
    actions: {
      apiHealth: "API health",
      openApiDocs: "OpenAPI docs",
      uiComponents: "UI components",
    },
    cards: [
      {
        title: "Financial core",
        description:
          "Balances, transactions, recurring payments and account abstractions prepared for shared and business use cases.",
      },
      {
        title: "Analytics layer",
        description:
          "Typed APIs, background sync and realtime-ready data flows for charts, reports, PnL and forecasting modules.",
      },
      {
        title: "Security baseline",
        description:
          "JWT rotation, environment-driven config, isolated services, Postgres consistency and Redis-backed async processing.",
      },
    ],
  },
  auth: {
    badge: "Credential workspace",
    title: "A premium authentication flow shaped like a real product surface.",
    description:
      "Switch between sign in and sign up with a motion-rich screen that feels native to a modern fintech product, not like a detached modal.",
    logo: {
      title: "Fin Man Access",
      subtitle: "Placeholder mark linked to home",
    },
    tabs: {
      caption: "Account access",
      signIn: "Sign in",
      signUp: "Create account",
    },
    metrics: [
      {
        label: "Session trust",
        value: "99.98%",
        caption: "Adaptive checks tuned for returning devices and secure recovery.",
      },
      {
        label: "Access speed",
        value: "< 90 sec",
        caption: "From new registration to a verified workspace in one flow.",
      },
      {
        label: "Signal layers",
        value: "6",
        caption: "Identity, device, consent, recovery and policy checkpoints.",
      },
    ],
    showcase: {
      eyebrow: "Animated auth system",
      signIn: {
        title: "Fast return for trusted members",
        description:
          "The sign-in state emphasizes clarity, memory cues and quick recovery while keeping the form visually calm and conversion-focused.",
        bullets: [
          "Smooth panel transitions preserve orientation instead of snapping content.",
          "Field surfaces stay dense and readable on both mobile and desktop.",
          "Recovery and session hints are visible without cluttering the core action.",
        ],
      },
      signUp: {
        title: "Confident onboarding for first-time users",
        description:
          "Registration expands the panel, reveals consent context and frames account creation as a polished first-run experience.",
        bullets: [
          "Progressive reveal makes the longer form feel lighter during mode switch.",
          "Consent copy and legal links are integrated into the visual hierarchy.",
          "Email and password inputs stay focused, fast and consistent with the core auth flow.",
        ],
      },
    },
    highlights: [
      {
        title: "Product-grade motion",
        description:
          "Layered gradients, staggered reveal and animated state shifts make the page feel intentional instead of template-driven.",
      },
      {
        title: "Clear legal path",
        description:
          "Terms and privacy links are present directly in registration, where the consent decision actually happens.",
      },
      {
        title: "Security-first framing",
        description:
          "The page communicates trust, session discipline and access clarity before any backend integration lands.",
      },
    ],
    placeholders: {
      email: "your@email.com",
      phone: "+7 700 000 00 00",
      password: "Enter password",
      confirmPassword: "Repeat password",
    },
    signIn: {
      title: "Welcome back",
      description:
        "Sign in to your workspace, restore your active sessions and continue from the last secure checkpoint.",
      fields: {
        email: "Email",
        password: "Password",
      },
      remember: "Remember this device",
      forgotPassword: "Forgot password?",
      submit: "Continue to dashboard",
      footnote:
        "By continuing you enter the protected Fin Man workspace with active session and device policies.",
    },
    signUp: {
      title: "Create your account",
      description:
        "Start with the standard registration data and confirm agreement with the product terms before activation.",
      fields: {
        email: "Email",
        phone: "Phone",
        password: "Password",
        confirmPassword: "Repeat password",
      },
      consent: {
        prefix: "I agree with the",
        terms: "Terms of Service",
        and: "and",
        privacy: "Privacy & Security policy",
      },
      submit: "Create account",
      footnote:
        "After registration, the user can move into verification, onboarding and protected product areas without changing the visual shell.",
    },
    footer: {
      status: "Designed for responsive auth",
      backHome: "Back to home",
    },
    messages: {
      pending: "Processing",
      signInSuccess: "Signed in successfully.",
      signUpSuccess: "Account created successfully.",
      consentRequired: "You need to accept the terms before registration.",
      genericError: "Unable to complete the request right now.",
      socialStub: "Social auth buttons are placeholders for the future all-auth flow.",
    },
    social: {
      facebook: "Facebook",
      google: "Google",
      telegram: "Telegram",
    },
  },
  passwordRecovery: {
    title: "Recover account access",
    description:
      "If access to the account was lost, enter the linked email and continue through a secure password reset flow.",
    bullets: [
      "One focused step instead of a crowded recovery scenario.",
      "Uses the same visual system as the auth screen.",
      "Ready for backend integration when reset link delivery is connected.",
    ],
    actions: {
      backToAuth: "Back to sign in",
    },
    form: {
      title: "Password recovery",
      description:
        "Enter the email linked to your account. Once the backend is connected, this screen will send a password reset link.",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      submit: "Send recovery link",
      footnote:
        "Reset email delivery is not connected yet. The interface is already prepared for the next integration step.",
    },
    messages: {
      stub: "The recovery screen is ready. Password reset email delivery will be connected next.",
    },
  },
  workspace: {
    badge: "Financial workspace",
    greeting: "Welcome, {name}",
    description:
      "This is the operating surface for daily financial control: balances, cash flow, budgets, recent activity and the next areas that need attention.",
    actions: {
      addTransaction: "Add transaction",
      planBudget: "Plan budget",
      signOut: "Sign out",
    },
    loading: {
      title: "Preparing your workspace",
      description: "Fetching balances, budgets and account context.",
    },
    error: {
      title: "Workspace data is unavailable",
      description:
        "The dashboard could not load the latest financial overview. Try again or sign out and start a new session.",
      retry: "Retry",
    },
    summary: {
      netWorth: "Net worth",
      income: "Monthly income",
      expenses: "Monthly expenses",
      savingsRate: "Savings rate",
    },
    sections: {
      widgets: "Control center",
      widgetsDescription: "Top-level finance widgets that tell you where to focus first.",
      budgets: "Budget tracking",
      budgetsDescription: "Monitor category pressure and available room before the cycle closes.",
      transactions: "Recent activity",
      transactionsDescription: "Latest movements across accounts, subscriptions and planned outflows.",
      accounts: "Account structure",
      accountsDescription: "Core balance buckets for cash, reserve and long-term allocation.",
      priorities: "Priority signals",
      prioritiesDescription: "The most important operational items to review next.",
      nextSteps: "Next steps",
    },
    labels: {
      utilization: "Utilization",
    },
    remaining: "Remaining {value}",
    table: {
      title: "Title",
      account: "Account",
      category: "Category",
      date: "Date",
      amount: "Amount",
    },
    priorityCards: {
      obligationsTitle: "Upcoming obligations",
      obligationsBody: "Scheduled outflow currently stands at {value}. Review the next planned payments before they settle.",
      focusTitle: "Attention queue",
      focusBody: "{count} pending or scheduled items are waiting for review in the current cycle.",
    },
    nextSteps: [
      {
        title: "Add manual expense capture",
        description: "The next product layer should let the user record daily spend directly from this surface.",
      },
      {
        title: "Connect recurring planning",
        description: "Budget automation, subscription checkpoints and category rules should be attached to these widgets.",
      },
      {
        title: "Expand analytics stack",
        description: "Cash flow trends, period comparisons and forecast cards belong in the next workspace iteration.",
      },
    ],
    attention: "{count} items need attention",
    backHome: "Back to home",
  },
  uiCatalog: {
    badges: {
      debug: "Debug UI Catalog",
      hidden: "Hidden outside debug mode",
    },
    backHome: "Back to home",
    title: "UI system for a serious financial product",
    description:
      "A catalog of product-ready components built on top of our `ui` library: forms, filters, alerts, overlays, actions and data surfaces for a fintech application.",
    metrics: {
      unifiedBalance: {
        title: "Unified balance",
        value: "$148,320",
        caption: "Across fiat, cards and exchanges",
      },
      runway: {
        title: "Runway",
        value: "18.4 mo",
        caption: "Based on current burn profile",
      },
      subscriptions: {
        title: "Subscriptions",
        value: "32 active",
        caption: "With anomaly tracking enabled",
      },
      securityScore: {
        title: "Security score",
        value: "94 / 100",
        caption: "API keys, webhooks and auth posture",
      },
    },
    tabs: {
      inputs: "Inputs",
      actions: "Actions",
      feedback: "Feedback",
      data: "Data",
    },
    inputs: {
      title: "Financial form controls",
      description:
        "Inputs for budgets, transfers, recurring schedules and account settings.",
      accountTypeDescription:
        "Supports personal, shared, treasury and future business accounts.",
      accountTypes: {
        personal: "Personal",
        shared: "Shared household",
        treasury: "Treasury",
        business: "Business-ready",
      },
      controlGroupsTitle: "Control groups",
      controlGroupsDescription:
        "Choice controls for filters, risk levels and user preferences.",
      riskMode: {
        label: "Risk mode",
        description:
          "Preset behavior for planning and portfolio recommendations.",
        options: {
          conservative: "Conservative",
          balanced: "Balanced",
          aggressive: "Aggressive",
        },
      },
      reviewScore: {
        label: "Review score threshold",
        description:
          "Threshold before the system asks for manual review.",
        caption: "Automation confidence",
      },
      switches: {
        realtimeSync: {
          label: "Realtime sync",
          description: "Stream exchange and wallet balance updates.",
        },
        budgetAlerts: {
          label: "Budget alerts",
          description: "Notify when categories exceed threshold.",
        },
      },
      checkboxes: {
        includeTransfers: "Include internal transfers",
        compactMode: "Compact dashboard mode",
      },
      advanced: {
        title: "Advanced filters",
        description:
          "Sync network, statement source, tag filters and date ranges can be composed here without changing the public app shell.",
        action: "Open advanced rule builder",
      },
    },
    actions: {
      title: "Buttons, menus and overlays",
      description:
        "All interactive surfaces that a finance app uses for actions and confirmations.",
      actionButtons: "Action buttons",
      buttons: {
        createTransfer: "Create transfer",
        export: "Export",
        report: "Report",
      },
      dropdown: {
        title: "Dropdown actions",
        trigger: "Quick actions",
        label: "Portfolio",
        reconcileBalances: "Reconcile balances",
        createAlert: "Create alert",
        includeHiddenWallets: "Include hidden wallets",
        showArchivedCategories: "Show archived categories",
      },
      modal: {
        title: "Modal dialog",
        trigger: "Open confirmation modal",
        heading: "Confirm monthly rebalance",
        description:
          "Review transfers between accounts and exchanges before execution.",
        body: "3 transfers, 2 budget reallocations and 1 treasury sweep are ready.",
        reviewDetails: "Review details",
        confirm: "Confirm",
      },
      sheet: {
        title: "Sheet / side panel",
        trigger: "Open mobile sheet",
        heading: "Quick expense capture",
        description:
          "Fast mobile-first panel for adding transactions on the go.",
        merchantPlaceholder: "Merchant name",
        amountPlaceholder: "Amount",
        categories: {
          food: "Food",
          infrastructure: "Infrastructure",
          crypto: "Crypto",
        },
        saveDraft: "Save draft",
        submit: "Submit",
      },
      dangerZone: {
        title: "Danger zone / destructive flows",
        description:
          "Explicit confirmations for destructive financial actions.",
        trigger: "Disconnect exchange API key",
        heading: "Remove exchange connection?",
        body: "Sync jobs will stop, balances may freeze and API key metadata will be revoked.",
        cancel: "Cancel",
        disconnect: "Disconnect",
      },
      recommendations: {
        title: "Recommended actions",
        items: [
          "Rotate API keys every 90 days and keep permissions read-only unless trading is mandatory.",
          "Add dual approval for treasury withdrawals and business account payouts.",
          "Keep export jobs auditable with trace IDs and retention policies.",
        ],
      },
    },
    feedback: {
      title: "Alerts and states",
      description:
        "Clear status surfaces for sync, subscriptions, budgets and abnormal activity.",
      alerts: {
        success: {
          title: "Exchange sync completed",
          description:
            "Binance, Bybit and OKX balances refreshed successfully 24 seconds ago.",
          action: "Open log",
        },
        warning: {
          title: "Subscription budget at 89%",
          description:
            "Monthly SaaS spend is close to threshold. One renewal is pending this week.",
        },
        error: {
          title: "Wallet webhook signature failed",
          description:
            "Last callback from the blockchain provider was rejected and needs investigation.",
        },
      },
      progress: {
        title: "Progress / process state",
        description:
          "Useful for imports, long sync jobs and reporting workflows.",
        historicalImport: "Historical import",
        emptyState: {
          title: "Empty state",
          description:
            "No manually reconciled transactions yet. Import a statement or connect an exchange.",
          action: "Start reconciliation",
        },
      },
    },
    data: {
      title: "Transaction table",
      description:
        "Reusable data surface for ledger-like views and reconciliation screens.",
      filter: "Filter",
      columns: {
        merchant: "Merchant",
        category: "Category",
        amount: "Amount",
        status: "Status",
      },
      transactions: [
        {
          merchant: "AWS Billing",
          category: "Infrastructure",
          amount: "-$286.42",
          status: "Scheduled",
        },
        {
          merchant: "Binance Spot",
          category: "Crypto",
          amount: "+$1,204.00",
          status: "Settled",
        },
        {
          merchant: "Netflix",
          category: "Subscription",
          amount: "-$12.99",
          status: "Recurring",
        },
      ],
      buildingBlocks: {
        title: "Page building blocks",
        description:
          "Common surfaces for dashboards, analytics and side workflows.",
        items: [
          {
            title: "Dashboard shell",
            description:
              "Header, KPIs, widgets and contextual quick actions.",
          },
          {
            title: "Filter rail",
            description:
              "Saved filters, advanced rules and segment presets.",
          },
          {
            title: "Analytics stack",
            description:
              "Reports, charts, comparisons and forecast cards.",
          },
        ],
      },
    },
    fields: {
      search: {
        label: "Search",
        description:
          "Global lookup for wallets, transactions and subscriptions.",
        placeholder: "Search account, tx hash or merchant",
      },
      email: {
        label: "Email",
        description:
          "Dedicated notifications and exchange security routing.",
        placeholder: "finance@company.dev",
      },
      amount: {
        label: "Amount",
        description:
          "Production-oriented amount field for budgets, balances and transfers.",
        placeholder: "0.00",
      },
      accountType: {
        label: "Account type",
        description:
          "Supports personal, shared, treasury and future business accounts.",
      },
      password: {
        label: "Password",
        description:
          "Used for sensitive actions like API key reveal or export unlock.",
        placeholder: "Enter secure password",
      },
      settlementDate: {
        label: "Settlement date",
        description:
          "Custom date picker for recurring payments, invoices and reports.",
        placeholder: "Select date",
        popoverTitle: "Financial date",
        popoverDescription:
          "Pick the exact posting date for this operation.",
        clear: "Clear",
      },
      reminderTime: {
        label: "Reminder time",
        description:
          "Custom time selector for alerts, sync windows and notifications.",
        hourPlaceholder: "Hour",
        minutePlaceholder: "Minute",
      },
      phone: {
        label: "Contact phone",
        description:
          "Used for urgent payment verification and support escalation.",
        placeholder: "+7 777 000 00 00",
      },
      notes: {
        label: "Memo / notes",
        description:
          "Cross-platform notes for transactions, audits and reconciliations.",
        placeholder:
          "Add notes for reconciliation, treasury review or category rules",
      },
    },
    common: {
      live: "Live",
    },
  },
  pages: {
    common: {
      status: "Page in progress",
      backHome: "Back to home",
    },
    pricing: {
      title: "Pricing",
      description:
        "Public pricing tiers, usage limits and future billing logic will be assembled here.",
    },
    contacts: {
      title: "Contacts",
      description:
        "Support channels, partnership contacts and operational communication points will live here.",
    },
    security: {
      title: "Security",
      description:
        "Security model, data protection posture and integration hardening details will be published here.",
    },
    about: {
      title: "About us",
      description:
        "Product vision, team context and the long-term direction of the financial platform will be presented here.",
    },
    faq: {
      title: "FAQ",
      description:
        "Answers for common questions about accounts, sync, security and platform capabilities will appear here.",
    },
    roadmap: {
      title: "Roadmap",
      description:
        "Upcoming modules, integrations and platform milestones will be tracked here.",
    },
    auth: {
      title: "Authentication",
      description:
        "Animated sign-in and registration flows live here with product-grade transitions and legal entry points.",
    },
    terms: {
      title: "Terms of Service",
      description:
        "The legal terms, consent language and usage conditions for account creation will be published here.",
    },
    forgotPassword: {
      title: "Password recovery",
      description:
        "A dedicated recovery screen will live here and connect to the future password reset flow.",
    },
  },
};
