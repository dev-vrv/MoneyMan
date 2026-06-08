import type { enMessages } from "./en";

export const kgMessages: typeof enMessages = {
  metadata: {
    title: "Fin Man",
    description: "Каржыны башкаруу үчүн AI-платформа.",
  },
  loading: {
    brand: "Fin Man",
    title: "Каржы мейкиндиги даярдалып жатат",
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
      auth: "Кирүү",
      workspace: "Кабинет",
    },
  },
  home: {
    badge: "Fin Man платформасы",
    architecture: "API-first fintech архитектурасы",
    eyebrow: "Жеке финансы, AI, валюта жана крипто",
    title: "Жеке каржыны толук көзөмөлдөңүз.",
    description: "Бардык акча кыймылы, AI-жардамчы жана валюта менен криптанын күн сайын жаңырган курстары бир жерде.",
    actions: {
      apiHealth: "API абалы",
      openApiDocs: "OpenAPI docs",
      uiComponents: "UI components",
    },
    highlights: ["Бардык акча кыймылы", "AI-жардамчы", "Күн сайын жаңырган курстар"],
    signals: {
      sync: "маалымат жаңыртуу",
      growth: "курстар жана рынок",
      security: "аккаунт коопсуздугу",
    },
    visual: {
      topLeft: "каржыны көзөмөлдөө",
      topRight: "эсептер жана курстар",
      radar: "AI-жардамчы",
      radarValue: "24/7",
      alert: "курстар жаңыланат",
      alertValue: "күн сайын",
      flow: "баланс жана cash flow",
      flowValue: "көзөмөлдө",
    },
    deck: {
      active: "активдүү",
      stacked: "стекте",
      previousCard: "Мурунку карта",
      nextCard: "Кийинки карта",
      showCard: "Картаны көрсөтүү",
    },
    insightsSection: {
      eyebrow: "Каржы сигналдары жана AI",
      title: "AI кеңештери жана акчага сереп.",
      description: "Стратегия, баланс жана курстар бир экранда.",
    },
    widget: {
      title: "Жеке каржыга сереп",
      description: "Баланс, курстар жана акча боюнча негизги көрүнүш.",
      focusLabel: "Көзөмөлдө",
      focusValue: "Эсептер жана баланс",
      pulseLabel: "AI-жардамчы",
      pulseValue: "Тобокелдикти көрсөтөт",
      controlLabel: "Курстар",
      controlValue: "Күн сайын",
      pills: ["Бардык эсептер", "Валюта жана крипто курстары", "Акча боюнча кеңештер"],
    },
    beacon: {
      title: "AI капитал стратегиясы",
      description: "AI акча боюнча кийинки кадамды түшүнүүгө жардам берет.",
      radarLabel: "AI стратегия талдоосу",
      active: "активдүү",
      headline: "Капитал боюнча кийинки кадам",
      body: "Топтоо, чыгымдар жана өсүү чекиттери боюнча кеңештер.",
      scan: "талдоо",
      scanValue: "AI",
      pulse: "фокус",
      pulseValue: "Тобокелдик жана өсүү",
      glow: "аракет",
      glowValue: "План даяр",
    },
    cards: [
      {
        title: "Каражатты толук эсепке алуу",
        description: "Киреше, чыгаша, которуулар, эсептер жана баланстар бир системада сакталат.",
      },
      {
        title: "AI-жардамчы",
        description: "Чыгымдарды түшүнүүгө, үлгүлөрдү көрүүгө жана чечимди ылдамыраак кабыл алууга жардам берет.",
      },
      {
        title: "Валюта жана крипто курстары",
        description: "Валюта менен криптанын күн сайын жаңырган курстары каржылык абалды дайыма актуалдуу кылат.",
      },
      {
        title: "Акылдуу аналитика",
        description: "Чыгымдардын түзүмүн, категориялардын динамикасын жана негизги финансылык сигналдарды көрсөтөт.",
      },
      {
        title: "Коопсуз сактоо",
        description: "Каржылык маалымат, тарых жана аккаунтка кирүү коргоодо сакталат.",
      },
    ],
  },
  auth: {
    badge: "Кирүү мейкиндиги",
    title: "Толук продукттук деңгээлде жасалган заманбап authentication экраны.",
    description:
      "Кирүү менен катталуунун ортосундагы которулуу motion, иерархия жана fintech-мүнөзү менен толук кандуу product surface катары иштелген.",
    logo: {
      title: "Fin Man Access",
      subtitle: "Башкы бетке алып баруучу убактылуу логотип",
    },
    tabs: {
      caption: "Аккаунтка жетүү",
      signIn: "Кирүү",
      signUp: "Катталуу",
    },
    metrics: [
      {
        label: "Сессия ишеними",
        value: "99.98%",
        caption: "Таныш түзмөктөр жана коопсуз калыбына келтирүү үчүн adaptive текшерүүлөр.",
      },
      {
        label: "Старт ылдамдыгы",
        value: "< 90 сек",
        caption: "Катталуудан даяр кабинетке чейин бир агымда.",
      },
      {
        label: "Сигнал катмары",
        value: "6",
        caption: "Identity, device, consent, recovery жана policy checkpoints.",
      },
    ],
    showcase: {
      eyebrow: "Анимацияланган auth-система",
      signIn: {
        title: "Кайра кирген колдонуучуга тез кайтуу",
        description:
          "Кирүү режими ылдамдыкты, ориентирди жана калыбына келтирүүнү баса белгилейт, ошол эле учурда форма таза жана премиалдуу бойдон калат.",
        bullets: [
          "Панелдин жумшак алмашуусу контекстти сактайт, контентти кескин алмаштырбайт.",
          "Форма mobile жана desktop-та тыгыз, бирок окумдуу көрүнөт.",
          "Калыбына келтирүү жана сессия боюнча hints негизги аракетти жүктөбөйт.",
        ],
      },
      signUp: {
        title: "Жаңы колдонуучу үчүн ишенимдүү onboarding",
        description:
          "Катталуу режими кошумча контекстти ачат, legal блокту кошот жана биринчи тажрыйбанын бир бөлүгү катары кабыл алынат.",
        bullets: [
          "Progressive reveal узун форманы режим алмашканда жеңилирээк сездирет.",
          "Consent жана юридикалык шилтемелер визуалдык иерархиянын ичинде жайгашат.",
          "Email жана пароль талаалары негизги auth-flow'го ылайык так жана ылдам топтолгон.",
        ],
      },
    },
    highlights: [
      {
        title: "Product-grade motion",
        description:
          "Градиенттер, stagger-анимация жана абалдардын жумшак алмашуусу экранды шаблон эмес, ойлонулган кылып көрсөтөт.",
      },
      {
        title: "Так legal entry point",
        description:
          "Колдонуучу макулдук берген жерде эле шарттарга жана privacy бөлүмүнө шилтемелер бар.",
      },
      {
        title: "Ишенимге негизделген берүү",
        description:
          "Backend интеграциясына чейин эле экран коопсуздукту, сессия тартибин жана так жетүүнү билдирет.",
      },
    ],
    placeholders: {
      email: "your@email.com",
      phone: "+996 700 000 000",
      password: "Пароль киргизиңиз",
      confirmPassword: "Паролду кайталаңыз",
    },
    signIn: {
      title: "Кайра кош келиңиз",
      description:
        "Кабинетке кирип, активдүү сессияны улантып, акыркы корголгон чекиттен ишти улантыңыз.",
      fields: {
        email: "Email",
        password: "Пароль",
      },
      remember: "Бул түзмөктү эстеп калуу",
      forgotPassword: "Пароль унуттуңузбу?",
      submit: "Кабинетке өтүү",
      footnote:
        "Улантуу менен сиз Fin Man'дын корголгон мейкиндигине активдүү сессия жана түзмөк саясаттары менен киресиз.",
    },
    signUp: {
      title: "Аккаунт түзүү",
      description:
        "Стандарттуу катталуу талааларын толтуруп, активдештирүүдөн мурун сервистин шарттарына макул болуңуз.",
      fields: {
        email: "Email",
        phone: "Телефон",
        password: "Пароль",
        confirmPassword: "Паролду кайталоо",
      },
      consent: {
        prefix: "Мен",
        terms: "колдонуу шарттарына",
        and: "жана",
        privacy: "privacy жана security саясатына",
      },
      submit: "Аккаунт түзүү",
      footnote:
        "Катталуудан кийин ушул эле визуалдык shell ичинде verification, onboarding жана корголгон продукт агымдары туташат.",
    },
    footer: {
      status: "Responsive auth үчүн иштелген",
      backHome: "Башкы бетке",
    },
    messages: {
      pending: "Иштетилип жатат",
      signInSuccess: "Кирүү ийгиликтүү аяктады.",
      signUpSuccess: "Аккаунт ийгиликтүү түзүлдү.",
      consentRequired: "Катталуу үчүн шарттарга макул болуу керек.",
      genericError: "Сурамды азыр аткаруу мүмкүн болгон жок.",
      socialStub: "Social auth баскычтары азырынча келечектеги all-auth flow үчүн гана заглушка.",
    },
    social: {
      facebook: "Facebook",
      google: "Google",
      telegram: "Telegram",
    },
  },
  passwordRecovery: {
    title: "Кирүүнү калыбына келтирүү",
    description:
      "Эгер аккаунтка кирүү жоголсо, байланышкан email'ди киргизип, сырсөздү коопсуз калыбына келтирүү жолуна өтүңүз.",
    bullets: [
      "Ашыкча кадамдарсыз бир негизги аракет.",
      "Кирүү барагы менен бирдей визуалдык система сакталат.",
      "Сырсөздү калыбына келтирүү шилтемесин жөнөтүү логикасын кошууга даяр.",
    ],
    actions: {
      backToAuth: "Кирүүгө кайтуу",
    },
    form: {
      title: "Паролду калыбына келтирүү",
      description:
        "Аккаунтка байланышкан email'ди киргизиңиз. Backend кошулгандан кийин бул жерден сырсөздү калыбына келтирүү шилтемеси жөнөтүлөт.",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      submit: "Калыбына келтирүү шилтемесин жөнөтүү",
      footnote:
        "Калыбына келтирүү каты азырынча жөнөтүлбөйт. Интерфейс кийинки интеграция этабы үчүн даяр.",
    },
    messages: {
      stub: "Калыбына келтирүү экраны даяр. Кийинки кадамда кат жөнөтүү логикасы кошулат.",
    },
  },
  workspace: {
    badge: "Каржы мейкиндиги",
    greeting: "Кош келиңиз, {name}",
    description:
      "Бул күнүмдүк финансылык көзөмөл үчүн негизги иш мейкиндиги: баланс, cash flow, бюджеттер, акыркы кыймылдар жана көңүл буруучу зоналар.",
    actions: {
      addTransaction: "Транзакция кошуу",
      planBudget: "Бюджет пландоо",
      signOut: "Чыгуу",
    },
    loading: {
      title: "Иш мейкиндиги даярдалып жатат",
      description: "Баланстар, бюджеттер жана аккаунт контексти жүктөлүүдө.",
    },
    error: {
      title: "Иш мейкиндигинин маалыматтары жеткиликсиз",
      description:
        "Актуалдуу каржылык обзор жүктөлгөн жок. Кайра аракет кылыңыз же сессияны жаап кайра кириңиз.",
      retry: "Кайра аракет",
    },
    summary: {
      netWorth: "Жалпы капитал",
      income: "Айлык киреше",
      expenses: "Айлык чыгаша",
      savingsRate: "Үнөм деңгээли",
    },
    sections: {
      widgets: "Көзөмөл борбору",
      widgetsDescription: "Эң биринчи кайсы жакты көрүү керектигин көрсөткөн негизги виджеттер.",
      budgets: "Бюджет көзөмөлү",
      budgetsDescription: "Категориялар боюнча басымды жана цикл жабылганга чейинки запасты көзөмөлдөңүз.",
      transactions: "Акыркы активдүүлүк",
      transactionsDescription: "Эсептер, жазылуулар жана пландалган төлөмдөр боюнча акыркы кыймылдар.",
      accounts: "Эсеп түзүмү",
      accountsDescription: "Күнүмдүк акча, резерв жана узак мөөнөттүү бөлүштүрүү үчүн негизги эсеп блоктору.",
      priorities: "Приоритет сигналдары",
      prioritiesDescription: "Кийинки карап чыгууга тийиш болгон эң маанилүү операциялык чекиттер.",
      nextSteps: "Иш сценарийлери",
    },
    labels: {
      utilization: "Колдонуу",
    },
    remaining: "{value} калды",
    table: {
      title: "Операция",
      account: "Эсеп",
      category: "Категория",
      date: "Дата",
      amount: "Сумма",
    },
    priorityCards: {
      obligationsTitle: "Жакынкы милдеттенмелер",
      obligationsBody: "Пландалган чыгым учурда {value}. Төлөмдөр аткарылганга чейин аларды текшериңиз.",
      focusTitle: "Көңүл буруу кезеги",
      focusBody: "Учурдагы циклде {count} pending же scheduled операциясы кароону күтүп турат.",
    },
    attention: "{count} элемент көңүл бурууну талап кылат",
    backHome: "Башкы бетке",
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
            title: "Дашборд каркасы",
            description:
              "Хедер, KPI, виджеттер жана контексттик тез аракеттер.",
          },
          {
            title: "Фильтр панели",
            description:
              "Сакталган фильтрлер, кеңейтилген эрежелер жана сегмент пресеттери.",
          },
          {
            title: "Аналитика стеги",
            description:
              "Отчеттор, графиктер, салыштыруулар жана прогноз карточкалары.",
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
        label: "Эскертме",
        description:
          "Транзакция, аудит жана салыштыруу үчүн кроссплатформалык эскертмелер.",
        placeholder:
          "Салыштыруу, treasury review же категория эрежелери үчүн эскертме кошуңуз",
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
    auth: {
      title: "Аутентификация",
      description:
        "Бул жерде product-grade өтүүлөрү жана юридикалык кирүү чекиттери менен анимацияланган кирүү жана катталуу сценарийлери жайгашат.",
    },
    terms: {
      title: "Колдонуу шарттары",
      description:
        "Бул жерде аккаунт түзүү үчүн юридикалык шарттар, макулдук формулировкалары жана колдонуу эрежелери жарыяланат.",
    },
    forgotPassword: {
      title: "Паролду калыбына келтирүү",
      description:
        "Бул жерде кирүүнү калыбына келтирүү үчүн өзүнчө экран жайгашат жана кийинки reset-flow туташат.",
    },
  },
};
