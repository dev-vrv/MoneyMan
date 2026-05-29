import type { enMessages } from "./en";

export const ruMessages: typeof enMessages = {
  metadata: {
    title: "Fin Man",
    description: "AI-платформа для управления финансами.",
  },
  loading: {
    brand: "Fin Man",
    title: "Собираем ваше финансовое пространство",
    description:
      "Подготавливаем балансы, аналитику и подключенные модули в одном безопасном потоке.",
  },
  header: {
    logo: "Fin Man",
    navigation: {
      pricing: "Тарифы",
      contacts: "Контакты",
      security: "Безопасность",
      info: "Информация",
    },
    infoMenu: {
      about: "О нас",
      faq: "FAQ",
      roadmap: "Roadmap",
    },
    language: {
      label: "Язык",
      en: "English",
      ru: "Русский",
      kg: "Кыргызча",
    },
    actions: {
      login: "Войти",
    },
  },
  home: {
    badge: "Платформа Fin Man",
    architecture: "Fintech-архитектура с API-first подходом",
    eyebrow: "Личные финансы, крипта, аналитика, AI",
    title: "Премиальный контроль финансов на едином масштабируемом API-ядре.",
    description:
      "Web, будущий mobile, интеграции и автоматизации работают через единый backend-контракт для безопасных финансовых операций.",
    actions: {
      apiHealth: "Проверка API",
      openApiDocs: "OpenAPI документация",
      uiComponents: "UI components",
    },
    cards: [
      {
        title: "Финансовое ядро",
        description:
          "Балансы, транзакции, регулярные платежи и абстракции аккаунтов для personal, shared и business-сценариев.",
      },
      {
        title: "Слой аналитики",
        description:
          "Typed API, background sync и realtime-ready потоки данных для графиков, отчетов, PnL и прогнозирования.",
      },
      {
        title: "Базовая безопасность",
        description:
          "JWT rotation, env-driven конфигурация, изолированные сервисы, консистентность Postgres и async processing через Redis.",
      },
    ],
  },
  uiCatalog: {
    badges: {
      debug: "Debug UI Catalog",
      hidden: "Скрыто вне debug-режима",
    },
    backHome: "На главную",
    title: "UI-система для серьезного финансового продукта",
    description:
      "Каталог production-ready компонентов поверх нашей `ui`-библиотеки: формы, фильтры, alerts, overlays, actions и data surfaces для финтех-приложения.",
    metrics: {
      unifiedBalance: {
        title: "Общий баланс",
        value: "$148,320",
        caption: "По fiat, картам и биржам",
      },
      runway: {
        title: "Runway",
        value: "18.4 мес",
        caption: "На основе текущего burn rate",
      },
      subscriptions: {
        title: "Подписки",
        value: "32 активны",
        caption: "С включенным anomaly tracking",
      },
      securityScore: {
        title: "Оценка безопасности",
        value: "94 / 100",
        caption: "API keys, webhooks и auth posture",
      },
    },
    tabs: {
      inputs: "Inputs",
      actions: "Actions",
      feedback: "Feedback",
      data: "Data",
    },
    inputs: {
      title: "Финансовые form controls",
      description:
        "Поля ввода для бюджетов, переводов, регулярных сценариев и настроек аккаунта.",
      accountTypeDescription:
        "Поддерживает personal, shared, treasury и будущие business-аккаунты.",
      accountTypes: {
        personal: "Личный",
        shared: "Общий household",
        treasury: "Treasury",
        business: "Business-ready",
      },
      controlGroupsTitle: "Группы контролов",
      controlGroupsDescription:
        "Контролы выбора для фильтров, risk-профилей и пользовательских настроек.",
      riskMode: {
        label: "Режим риска",
        description:
          "Преднастроенное поведение для планирования и portfolio recommendations.",
        options: {
          conservative: "Консервативный",
          balanced: "Сбалансированный",
          aggressive: "Агрессивный",
        },
      },
      reviewScore: {
        label: "Порог review score",
        description:
          "Порог, после которого система запросит ручную проверку.",
        caption: "Уверенность автоматизации",
      },
      switches: {
        realtimeSync: {
          label: "Realtime sync",
          description: "Потоковые обновления балансов бирж и кошельков.",
        },
        budgetAlerts: {
          label: "Budget alerts",
          description: "Уведомления при превышении лимитов категорий.",
        },
      },
      checkboxes: {
        includeTransfers: "Включать внутренние переводы",
        compactMode: "Компактный режим dashboard",
      },
      advanced: {
        title: "Расширенные фильтры",
        description:
          "Здесь можно собирать network filters, statement sources, tags и date ranges без изменения публичного app shell.",
        action: "Открыть advanced rule builder",
      },
    },
    actions: {
      title: "Кнопки, меню и overlays",
      description:
        "Все интерактивные поверхности, которые нужны финансовому приложению для действий и подтверждений.",
      actionButtons: "Кнопки действий",
      buttons: {
        createTransfer: "Создать перевод",
        export: "Экспорт",
        report: "Отчет",
      },
      dropdown: {
        title: "Dropdown actions",
        trigger: "Быстрые действия",
        label: "Портфель",
        reconcileBalances: "Сверить балансы",
        createAlert: "Создать alert",
        includeHiddenWallets: "Включить скрытые кошельки",
        showArchivedCategories: "Показать архивные категории",
      },
      modal: {
        title: "Modal dialog",
        trigger: "Открыть confirmation modal",
        heading: "Подтвердить ежемесячный ребаланс",
        description:
          "Проверьте переводы между аккаунтами и биржами перед выполнением.",
        body: "Готовы 3 перевода, 2 перераспределения бюджета и 1 treasury sweep.",
        reviewDetails: "Посмотреть детали",
        confirm: "Подтвердить",
      },
      sheet: {
        title: "Sheet / боковая панель",
        trigger: "Открыть mobile sheet",
        heading: "Быстрое добавление расхода",
        description:
          "Быстрая mobile-first панель для добавления транзакций на ходу.",
        merchantPlaceholder: "Название мерчанта",
        amountPlaceholder: "Сумма",
        categories: {
          food: "Еда",
          infrastructure: "Инфраструктура",
          crypto: "Крипта",
        },
        saveDraft: "Сохранить черновик",
        submit: "Отправить",
      },
      dangerZone: {
        title: "Danger zone / destructive flows",
        description:
          "Явные подтверждения для деструктивных финансовых действий.",
        trigger: "Отключить API ключ биржи",
        heading: "Удалить биржевое подключение?",
        body: "Sync jobs остановятся, балансы замрут, а metadata по API ключу будет отозвана.",
        cancel: "Отмена",
        disconnect: "Отключить",
      },
      recommendations: {
        title: "Рекомендуемые действия",
        items: [
          "Ротируйте API ключи каждые 90 дней и держите права read-only, если торговля не обязательна.",
          "Добавьте dual approval для treasury withdrawals и business payouts.",
          "Храните export jobs с trace IDs и retention policies для аудита.",
        ],
      },
    },
    feedback: {
      title: "Alerts и состояния",
      description:
        "Понятные статусные поверхности для sync, подписок, бюджетов и аномалий.",
      alerts: {
        success: {
          title: "Синхронизация бирж завершена",
          description:
            "Балансы Binance, Bybit и OKX успешно обновлены 24 секунды назад.",
          action: "Открыть лог",
        },
        warning: {
          title: "Бюджет подписок на 89%",
          description:
            "Ежемесячные SaaS-расходы близки к порогу. Одно продление ожидается на этой неделе.",
        },
        error: {
          title: "Ошибка подписи wallet webhook",
          description:
            "Последний callback от blockchain provider был отклонен и требует проверки.",
        },
      },
      progress: {
        title: "Прогресс / состояние процесса",
        description:
          "Полезно для импортов, долгих sync jobs и отчетных workflow.",
        historicalImport: "Исторический импорт",
        emptyState: {
          title: "Пустое состояние",
          description:
            "Пока нет вручную сверенных транзакций. Импортируйте statement или подключите биржу.",
          action: "Начать сверку",
        },
      },
    },
    data: {
      title: "Таблица транзакций",
      description:
        "Переиспользуемая data surface для ledger-like экранов и reconciliation flows.",
      filter: "Фильтр",
      columns: {
        merchant: "Мерчант",
        category: "Категория",
        amount: "Сумма",
        status: "Статус",
      },
      transactions: [
        {
          merchant: "AWS Billing",
          category: "Инфраструктура",
          amount: "-$286.42",
          status: "Запланировано",
        },
        {
          merchant: "Binance Spot",
          category: "Крипта",
          amount: "+$1,204.00",
          status: "Проведено",
        },
        {
          merchant: "Netflix",
          category: "Подписка",
          amount: "-$12.99",
          status: "Регулярно",
        },
      ],
      buildingBlocks: {
        title: "Page building blocks",
        description:
          "Общие поверхности для dashboards, аналитики и side workflows.",
        items: [
          {
            title: "Dashboard shell",
            description:
              "Header, KPIs, widgets и contextual quick actions.",
          },
          {
            title: "Filter rail",
            description:
              "Saved filters, advanced rules и segment presets.",
          },
          {
            title: "Analytics stack",
            description:
              "Отчеты, графики, сравнения и forecast cards.",
          },
        ],
      },
    },
    fields: {
      search: {
        label: "Поиск",
        description:
          "Глобальный поиск по кошелькам, транзакциям и подпискам.",
        placeholder: "Искать аккаунт, tx hash или мерчанта",
      },
      email: {
        label: "Email",
        description:
          "Для уведомлений и маршрутизации security-событий по биржам.",
        placeholder: "finance@company.dev",
      },
      amount: {
        label: "Сумма",
        description:
          "Production-oriented поле для бюджетов, балансов и переводов.",
        placeholder: "0.00",
      },
      accountType: {
        label: "Тип аккаунта",
        description:
          "Поддерживает personal, shared, treasury и будущие business-аккаунты.",
      },
      password: {
        label: "Пароль",
        description:
          "Используется для чувствительных действий: показ API ключей или разблокировка экспорта.",
        placeholder: "Введите надежный пароль",
      },
      settlementDate: {
        label: "Дата проведения",
        description:
          "Кастомный date picker для регулярных платежей, инвойсов и отчетов.",
        placeholder: "Выберите дату",
        popoverTitle: "Финансовая дата",
        popoverDescription:
          "Выберите точную дату проведения операции.",
        clear: "Очистить",
      },
      reminderTime: {
        label: "Время напоминания",
        description:
          "Кастомный time selector для alerts, sync windows и notifications.",
        hourPlaceholder: "Час",
        minutePlaceholder: "Минуты",
      },
      phone: {
        label: "Контактный телефон",
        description:
          "Для срочной верификации платежей и эскалации поддержки.",
        placeholder: "+7 777 000 00 00",
      },
      notes: {
        label: "Заметка / notes",
        description:
          "Кросс-платформенные заметки для транзакций, аудита и сверки.",
        placeholder:
          "Добавьте заметки для сверки, treasury review или category rules",
      },
    },
    common: {
      live: "Live",
    },
  },
  pages: {
    common: {
      status: "Страница в разработке",
      backHome: "На главную",
    },
    pricing: {
      title: "Тарифы",
      description:
        "Здесь будет собрана публичная тарифная сетка, лимиты использования и будущая billing-логика.",
    },
    contacts: {
      title: "Контакты",
      description:
        "Здесь будут размещены каналы поддержки, партнерские контакты и точки операционной коммуникации.",
    },
    security: {
      title: "Безопасность",
      description:
        "Здесь будет опубликована модель безопасности, подход к защите данных и детали hardening для интеграций.",
    },
    about: {
      title: "О нас",
      description:
        "Здесь будет представлено видение продукта, контекст команды и долгосрочное направление платформы.",
    },
    faq: {
      title: "FAQ",
      description:
        "Здесь появятся ответы на частые вопросы по аккаунтам, синхронизации, безопасности и возможностям платформы.",
    },
    roadmap: {
      title: "Roadmap",
      description:
        "Здесь будут зафиксированы будущие модули, интеграции и ключевые этапы развития платформы.",
    },
    login: {
      title: "Вход в аккаунт",
      description:
        "Здесь будут размещены сценарии аутентификации, политика сессий и экраны доступа к аккаунту.",
    },
  },
};
