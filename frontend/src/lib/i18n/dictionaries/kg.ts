import type { enMessages } from "./en";

export const kgMessages: typeof enMessages = {
  metadata: {
    title: "Fin Man",
    description: "Каржыны башкаруу үчүн AI-платформа.",
  },
  loading: {
    brand: "Fin Man",
    title: "Каржылык workspace даярдалып жатат",
    description:
      "Бир коопсуз агымда баланстарды, аналитиканы жана туташкан модулдарды даярдап жатабыз.",
  },
  header: {
    logo: "Fin Man",
    navigation: {
      pricing: "Тарифтер",
      contacts: "Байланыш",
      security: "Коопсуздук",
      info: "Маалымат",
    },
    infoMenu: {
      about: "Биз жөнүндө",
      faq: "FAQ",
      roadmap: "Roadmap",
    },
    language: {
      label: "Тил",
      en: "English",
      ru: "Русский",
      kg: "Кыргызча",
    },
    actions: {
      login: "Кирүү",
    },
  },
  home: {
    badge: "Fin Man платформасы",
    architecture: "API-first fintech архитектурасы",
    eyebrow: "Жеке финансы, крипто, аналитика, AI",
    title: "Бирдиктүү масштабдалуучу API өзөгүндөгү премиум каржы көзөмөлү.",
    description:
      "Web, келечектеги mobile, интеграциялар жана automation коопсуз каржылык операциялар үчүн бир backend-келишим аркылуу иштейт.",
    actions: {
      apiHealth: "API абалы",
      openApiDocs: "OpenAPI docs",
      uiComponents: "UI components",
    },
    cards: [
      {
        title: "Каржылык өзөк",
        description:
          "Баланс, транзакциялар, кайталанма төлөмдөр жана personal, shared, business сценарийлерине даяр account abstraction.",
      },
      {
        title: "Аналитика катмары",
        description:
          "Typed API, background sync жана графиктер, отчеттор, PnL жана прогноз үчүн realtime-ready маалымат агымдары.",
      },
      {
        title: "Коопсуздук базасы",
        description:
          "JWT rotation, env-driven конфиг, изоляцияланган сервистер, Postgres консистенттүүлүгү жана Redis аркылуу async processing.",
      },
    ],
  },
  uiCatalog: {
    badges: {
      debug: "Debug UI Catalog",
      hidden: "Debug режиминен тышкары жашырылган",
    },
    backHome: "Башкы бетке",
    title: "Олуттуу финансылык продукт үчүн UI системасы",
    description:
      "Биздин `ui` китепканасынын үстүндөгү production-ready компоненттер каталогу: формалар, фильтрлер, alerts, overlays, actions жана data surfaces.",
    metrics: {
      unifiedBalance: {
        title: "Жалпы баланс",
        value: "$148,320",
        caption: "Fiat, карта жана биржалар боюнча",
      },
      runway: {
        title: "Runway",
        value: "18.4 ай",
        caption: "Учурдагы burn profile негизинде",
      },
      subscriptions: {
        title: "Жазылуулар",
        value: "32 активдүү",
        caption: "Anomaly tracking иштеп турат",
      },
      securityScore: {
        title: "Коопсуздук упайы",
        value: "94 / 100",
        caption: "API keys, webhooks жана auth posture",
      },
    },
    tabs: {
      inputs: "Inputs",
      actions: "Actions",
      feedback: "Feedback",
      data: "Data",
    },
    inputs: {
      title: "Финансылык form controls",
      description:
        "Бюджет, которуу, кайталанма сценарий жана аккаунт жөндөөлөрү үчүн input controls.",
      accountTypeDescription:
        "Personal, shared, treasury жана келечектеги business аккаунттарды колдойт.",
      accountTypes: {
        personal: "Жеке",
        shared: "Жалпы household",
        treasury: "Treasury",
        business: "Business-ready",
      },
      controlGroupsTitle: "Контрол топтору",
      controlGroupsDescription:
        "Фильтрлер, risk level жана колдонуучу жөндөөлөрү үчүн тандоо контролдору.",
      riskMode: {
        label: "Тобокел режими",
        description:
          "Пландоо жана portfolio recommendations үчүн алдын ала коюлган жүрүм-турум.",
        options: {
          conservative: "Консервативдүү",
          balanced: "Тең салмактуу",
          aggressive: "Агрессивдүү",
        },
      },
      reviewScore: {
        label: "Review score босогосу",
        description:
          "Система кол менен текшерүүнү сурай турган чек.",
        caption: "Автоматизация ишенимдүүлүгү",
      },
      switches: {
        realtimeSync: {
          label: "Realtime sync",
          description: "Биржа жана капчык баланстарын түз агымда жаңыртуу.",
        },
        budgetAlerts: {
          label: "Budget alerts",
          description: "Категория лимити ашканда эскертүү.",
        },
      },
      checkboxes: {
        includeTransfers: "Ички которууларды кошуу",
        compactMode: "Компакт dashboard режими",
      },
      advanced: {
        title: "Кеңейтилген фильтрлер",
        description:
          "Бул жерде network, statement source, tag жана date range фильтрлерин түзсө болот.",
        action: "Advanced rule builder ачуу",
      },
    },
    actions: {
      title: "Баскычтар, менюлар жана overlays",
      description:
        "Финансылык колдонмого аракеттер жана ырастоолор үчүн керек болгон бардык интерактивдүү беттер.",
      actionButtons: "Аракет баскычтары",
      buttons: {
        createTransfer: "Которуу түзүү",
        export: "Экспорт",
        report: "Отчет",
      },
      dropdown: {
        title: "Dropdown actions",
        trigger: "Тез аракеттер",
        label: "Портфель",
        reconcileBalances: "Баланстарды салыштыруу",
        createAlert: "Alert түзүү",
        includeHiddenWallets: "Жашыруун капчыктарды кошуу",
        showArchivedCategories: "Архив категорияларды көрсөтүү",
      },
      modal: {
        title: "Modal dialog",
        trigger: "Confirmation modal ачуу",
        heading: "Айлык rebalance ырастоо",
        description:
          "Аткаруудан мурда аккаунттар жана биржалар ортосундагы которууларды текшериңиз.",
        body: "3 которуу, 2 бюджет кайра бөлүштүрүү жана 1 treasury sweep даяр.",
        reviewDetails: "Толук көрүү",
        confirm: "Ырастоо",
      },
      sheet: {
        title: "Sheet / каптал панель",
        trigger: "Mobile sheet ачуу",
        heading: "Тез чыгым киргизүү",
        description:
          "Жолго чыкканда транзакция кошууга ылайыкташкан mobile-first панель.",
        merchantPlaceholder: "Merchant аталышы",
        amountPlaceholder: "Сумма",
        categories: {
          food: "Тамак",
          infrastructure: "Инфраструктура",
          crypto: "Крипто",
        },
        saveDraft: "Драфт сактоо",
        submit: "Жөнөтүү",
      },
      dangerZone: {
        title: "Danger zone / destructive flows",
        description:
          "Бузуучу финансылык аракеттер үчүн так ырастоолор.",
        trigger: "Биржанын API ачкычын ажыратуу",
        heading: "Биржа туташуусун өчүрөсүзбү?",
        body: "Sync jobs токтойт, баланстар тоңот, API key metadata артка чакырылат.",
        cancel: "Жокко чыгаруу",
        disconnect: "Ажыратуу",
      },
      recommendations: {
        title: "Сунушталган аракеттер",
        items: [
          "API ачкычтарын ар 90 күндө жаңылаңыз жана соода керек болбосо read-only укуктарды колдонуңуз.",
          "Treasury withdrawal жана business payout үчүн dual approval кошуңуз.",
          "Export jobs үчүн trace ID жана retention policy колдонуңуз.",
        ],
      },
    },
    feedback: {
      title: "Alerts жана абалдар",
      description:
        "Sync, жазылуулар, бюджеттер жана аномалиялар үчүн түшүнүктүү статус беттери.",
      alerts: {
        success: {
          title: "Биржа синхрондошуусу аяктады",
          description:
            "Binance, Bybit жана OKX баланстары 24 секунд мурун ийгиликтүү жаңыртылды.",
          action: "Логду ачуу",
        },
        warning: {
          title: "Жазылуу бюджети 89%",
          description:
            "Айлык SaaS чыгымы чекке жакындады. Бул жумада бир renewal күтүлүүдө.",
        },
        error: {
          title: "Wallet webhook signature ишке ашкан жок",
          description:
            "Blockchain provider'ден келген акыркы callback четке кагылды жана текшерүү керек.",
        },
      },
      progress: {
        title: "Прогресс / процесс абалы",
        description:
          "Импорт, узак sync jobs жана отчет workflow'лору үчүн пайдалуу.",
        historicalImport: "Тарыхый импорт",
        emptyState: {
          title: "Бош абал",
          description:
            "Азырынча кол менен салыштырылган транзакциялар жок. Statement импорттоп же биржа кошуңуз.",
          action: "Салыштырууну баштоо",
        },
      },
    },
    data: {
      title: "Транзакциялар таблицасы",
      description:
        "Ledger-like экрандар жана reconciliation flows үчүн кайра колдонулуучу data surface.",
      filter: "Фильтр",
      columns: {
        merchant: "Merchant",
        category: "Категория",
        amount: "Сумма",
        status: "Статус",
      },
      transactions: [
        {
          merchant: "AWS Billing",
          category: "Инфраструктура",
          amount: "-$286.42",
          status: "Пландалган",
        },
        {
          merchant: "Binance Spot",
          category: "Крипто",
          amount: "+$1,204.00",
          status: "Аяктаган",
        },
        {
          merchant: "Netflix",
          category: "Жазылуу",
          amount: "-$12.99",
          status: "Кайталанма",
        },
      ],
      buildingBlocks: {
        title: "Page building blocks",
        description:
          "Dashboard, аналитика жана каптал workflow'лор үчүн жалпы беттер.",
        items: [
          {
            title: "Dashboard shell",
            description:
              "Header, KPIs, widgets жана contextual quick actions.",
          },
          {
            title: "Filter rail",
            description:
              "Saved filters, advanced rules жана segment presets.",
          },
          {
            title: "Analytics stack",
            description:
              "Отчеттор, графиктер, салыштыруулар жана forecast cards.",
          },
        ],
      },
    },
    fields: {
      search: {
        label: "Издөө",
        description:
          "Капчык, транзакция жана жазылуулар боюнча глобалдуу издөө.",
        placeholder: "Аккаунт, tx hash же merchant издөө",
      },
      email: {
        label: "Email",
        description:
          "Билдирүүлөр жана биржа security routing үчүн колдонулат.",
        placeholder: "finance@company.dev",
      },
      amount: {
        label: "Сумма",
        description:
          "Бюджет, баланс жана которуу үчүн production-oriented талаа.",
        placeholder: "0.00",
      },
      accountType: {
        label: "Аккаунт түрү",
        description:
          "Personal, shared, treasury жана келечектеги business аккаунттарды колдойт.",
      },
      password: {
        label: "Сырсөз",
        description:
          "API key көргөзүү же export unlock сыяктуу сезимтал аракеттер үчүн.",
        placeholder: "Коопсуз сырсөз киргизиңиз",
      },
      settlementDate: {
        label: "Өткөрүү күнү",
        description:
          "Кайталанма төлөмдөр, invoice жана отчеттор үчүн custom date picker.",
        placeholder: "Күндү тандаңыз",
        popoverTitle: "Финансылык күн",
        popoverDescription:
          "Операциянын так жүргүзүлүү күнүн тандаңыз.",
        clear: "Тазалоо",
      },
      reminderTime: {
        label: "Эскертүү убактысы",
        description:
          "Alerts, sync windows жана notifications үчүн custom time selector.",
        hourPlaceholder: "Саат",
        minutePlaceholder: "Мүнөт",
      },
      phone: {
        label: "Байланыш телефону",
        description:
          "Шашылыш төлөм текшерүүсү жана support escalation үчүн.",
        placeholder: "+7 777 000 00 00",
      },
      notes: {
        label: "Эскертме / notes",
        description:
          "Транзакция, аудит жана салыштыруу үчүн cross-platform notes.",
        placeholder:
          "Салыштыруу, treasury review же category rules үчүн notes кошуңуз",
      },
    },
    common: {
      live: "Live",
    },
  },
  pages: {
    common: {
      status: "Баракча даярдалып жатат",
      backHome: "Башкы бетке",
    },
    pricing: {
      title: "Тарифтер",
      description:
        "Бул жерде ачык тарифтер, колдонуу лимиттери жана келечектеги billing логикасы жайгашат.",
    },
    contacts: {
      title: "Байланыш",
      description:
        "Бул жерде колдоо каналдары, өнөктөштүк байланыштары жана операциялык коммуникация чекиттери жайгашат.",
    },
    security: {
      title: "Коопсуздук",
      description:
        "Бул жерде коопсуздук модели, маалыматты коргоо ыкмасы жана интеграциялар үчүн hardening деталдары жарыяланат.",
    },
    about: {
      title: "Биз жөнүндө",
      description:
        "Бул жерде продукттун көз карашы, команда тууралуу контекст жана платформанын узак мөөнөттүү багыты көрсөтүлөт.",
    },
    faq: {
      title: "FAQ",
      description:
        "Бул жерде аккаунттар, синхрондоштуруу, коопсуздук жана платформанын мүмкүнчүлүктөрү боюнча жооптор жайгашат.",
    },
    roadmap: {
      title: "Roadmap",
      description:
        "Бул жерде келечектеги модулдар, интеграциялар жана платформанын негизги этаптары көрсөтүлөт.",
    },
    login: {
      title: "Аккаунтка кирүү",
      description:
        "Бул жерде аутентификация агымдары, сессия саясаты жана аккаунтка кирүү экрандары жайгашат.",
    },
  },
};
