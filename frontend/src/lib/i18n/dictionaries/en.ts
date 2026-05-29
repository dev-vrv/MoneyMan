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
      login: "Log in",
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
    login: {
      title: "Account login",
      description:
        "Authentication flows, session policy and account access screens will be added here.",
    },
  },
};
