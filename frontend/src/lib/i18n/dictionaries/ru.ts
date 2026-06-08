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
      auth: "Войти",
      workspace: "Кабинет",
    },
  },
  home: {
    badge: "Платформа Fin Man",
    architecture: "Fintech-архитектура с API-first подходом",
    eyebrow: "Личные финансы, AI, валюты и крипта",
    title: "Полный контроль личных финансов.",
    description: "Все движения денег, AI-помощник и ежедневные курсы валют и криптовалют в одном менеджере.",
    actions: {
      apiHealth: "Проверка API",
      openApiDocs: "OpenAPI документация",
      uiComponents: "UI components",
    },
    highlights: ["Все движения средств", "AI-помощник", "Курсы каждый день"],
    signals: {
      sync: "обновление данных",
      growth: "курсы и рынок",
      security: "защита аккаунта",
    },
    visual: {
      topLeft: "Контроль финансов",
      topRight: "Все счета и курсы",
      radar: "AI-помощник",
      radarValue: "24/7",
      alert: "Обновление курсов",
      alertValue: "Ежедневно",
      flow: "Баланс и cash flow",
      flowValue: "Под контролем",
    },
    deck: {
      active: "активна",
      stacked: "в стеке",
      previousCard: "Предыдущая карточка",
      nextCard: "Следующая карточка",
      showCard: "Показать карточку",
    },
    insightsSection: {
      eyebrow: "Финансовые сигналы и AI",
      title: "AI-подсказки и обзор денег.",
      description: "Стратегия, баланс и курсы в одном экране.",
    },
    widget: {
      title: "Обзор личных финансов",
      description: "Баланс, курсы и главное по деньгам.",
      focusLabel: "Под контролем",
      focusValue: "Счета и баланс",
      pulseLabel: "AI-помощник",
      pulseValue: "Показывает риски",
      controlLabel: "Курсы",
      controlValue: "Каждый день",
      pills: ["Все счета", "Курсы валют и крипты", "Подсказки по деньгам"],
    },
    beacon: {
      title: "AI-стратегия капитала",
      description: "AI помогает понять, что делать с деньгами дальше.",
      radarLabel: "AI-разбор стратегии",
      active: "активно",
      headline: "Следующий шаг по капиталу",
      body: "Подсказки по накоплениям, расходам и точкам роста.",
      scan: "анализ",
      scanValue: "AI",
      pulse: "фокус",
      pulseValue: "Риски и рост",
      glow: "действие",
      glowValue: "Есть план",
    },
    cards: [
      {
        title: "Полный учет средств",
        description: "Доходы, расходы, переводы, счета и балансы всегда собраны в одной системе.",
      },
      {
        title: "AI-помощник",
        description: "Подсказывает по финансам, помогает разбираться в расходах и быстрее принимать решения.",
      },
      {
        title: "Курсы валют и крипты",
        description: "Ежедневные обновления валютных и криптовалютных курсов для актуальной картины по деньгам.",
      },
      {
        title: "Умная аналитика",
        description: "Показывает структуру расходов, динамику по категориям и ключевые финансовые сигналы.",
      },
      {
        title: "Безопасное хранение",
        description: "Ваши финансовые данные, история движений и доступ к аккаунту остаются под защитой.",
      },
    ],
  },
  auth: {
    badge: "Вход в Fin Man",
    title: "Войдите в аккаунт или создайте его за минуту.",
    description:
      "Все, что нужно для старта: вход по email, быстрая регистрация и прямой переход в рабочее пространство управления финансами.",
    logo: {
      title: "Fin Man Access",
      subtitle: "Заглушка логотипа со ссылкой на главную",
    },
    tabs: {
      caption: "Доступ к аккаунту",
      signIn: "Вход",
      signUp: "Регистрация",
    },
    metrics: [
      {
        label: "Доверие сессии",
        value: "99.98%",
        caption: "Адаптивные проверки для знакомых устройств и безопасного восстановления.",
      },
      {
        label: "Скорость старта",
        value: "< 90 сек",
        caption: "От регистрации до готового кабинета в одном потоке.",
      },
      {
        label: "Слои сигнала",
        value: "6",
        caption: "Идентичность, устройство, consent, recovery и policy checkpoints.",
      },
    ],
    showcase: {
      eyebrow: "Анимированная auth-система",
      signIn: {
        title: "Вернитесь к своим финансам без лишних шагов",
        description:
          "Введите email и пароль, чтобы сразу открыть рабочее пространство, продолжить учет и проверить актуальную картину по деньгам.",
        bullets: [
          "Плавное переключение панелей сохраняет контекст вместо резкой подмены контента.",
          "Поля остаются плотными, читабельными и удобными на mobile и desktop.",
          "Подсказки по восстановлению и сессии встроены без визуального шума.",
        ],
      },
      signUp: {
        title: "Создайте аккаунт и начните вести финансы уже сейчас",
        description:
          "Регистрация занимает минуту: укажите email, задайте пароль и сразу переходите к счетам, расходам, бюджетам и общей финансовой картине.",
        bullets: [
          "Progressive reveal делает длинную форму заметно легче при переключении режима.",
          "Consent-блок и юридические ссылки встроены в иерархию, а не висят отдельно.",
          "Email и пароли сгруппированы так, чтобы форма оставалась быстрой и сфокусированной на базовом auth-flow.",
        ],
      },
    },
    highlights: [
      {
        title: "Motion уровня продукта",
        description:
          "Градиенты, stagger-анимации и мягкая смена состояний делают экран осмысленным, а не шаблонным.",
      },
      {
        title: "Понятный legal entry point",
        description:
          "Ссылки на условия и privacy присутствуют ровно в том месте, где пользователь дает согласие.",
      },
      {
        title: "Подача через доверие",
        description:
          "Экран заранее транслирует безопасность, дисциплину сессий и аккуратный доступ еще до интеграции backend-логики.",
      },
    ],
    placeholders: {
      email: "your@email.com",
      phone: "+7 700 000 00 00",
      password: "Введите пароль",
      confirmPassword: "Повторите пароль",
    },
    signIn: {
      title: "С возвращением",
      description:
        "Войдите в кабинет, восстановите активную сессию и продолжите с последней защищенной точки.",
      fields: {
        email: "Email",
        password: "Пароль",
      },
      remember: "Запомнить это устройство",
      forgotPassword: "Забыли пароль?",
      submit: "Продолжить в кабинет",
      footnote:
        "Продолжая, вы входите в защищенное пространство Fin Man с действующими политиками сессий и устройств.",
    },
    signUp: {
      title: "Создание аккаунта",
      description:
        "Заполните стандартные регистрационные поля и подтвердите согласие с условиями сервиса перед активацией.",
      fields: {
        email: "Email",
        phone: "Телефон",
        password: "Пароль",
        confirmPassword: "Повторите пароль",
      },
      consent: {
        prefix: "Я соглашаюсь с",
        terms: "условиями использования",
        and: "и",
        privacy: "политикой privacy и security",
      },
      submit: "Создать аккаунт",
      footnote:
        "После регистрации сюда же естественно подключаются verification, onboarding и дальнейшие защищенные продуктовые сценарии.",
    },
    footer: {
      status: "Сцена адаптирована под responsive auth",
      backHome: "На главную",
    },
    messages: {
      pending: "Обработка",
      signInSuccess: "Вход выполнен успешно.",
      signUpSuccess: "Аккаунт успешно создан.",
      consentRequired: "Для регистрации нужно принять условия.",
      genericError: "Сейчас не удалось выполнить запрос.",
      socialStub: "Кнопки social auth пока работают как заглушки для будущего all-auth flow.",
    },
    social: {
      facebook: "Facebook",
      google: "Google",
      telegram: "Telegram",
    },
  },
  passwordRecovery: {
    title: "Восстановление доступа",
    description:
      "Если вы потеряли доступ к аккаунту, укажите email, и мы поможем безопасно вернуться ко входу.",
    bullets: [
      "Один основной шаг без лишних действий и перегруженного сценария.",
      "Та же визуальная система, что и на странице входа.",
      "Экран готов к подключению отправки ссылки для сброса пароля.",
    ],
    actions: {
      backToAuth: "Назад ко входу",
    },
    form: {
      title: "Восстановление пароля",
      description:
        "Введите email, привязанный к аккаунту. После подключения backend здесь будет отправляться ссылка для сброса пароля.",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      submit: "Отправить ссылку",
      footnote:
        "Письмо для сброса пароля пока не отправляется. Экран подготовлен для следующего этапа интеграции.",
    },
    messages: {
      stub: "Экран восстановления готов. Следующим шагом подключим отправку письма для сброса пароля.",
    },
  },
  workspace: {
    badge: "Финансовое пространство",
    greeting: "Здравствуйте, {name}",
    description:
      "Это основная рабочая поверхность для ежедневного контроля финансов: балансы, cash flow, бюджеты, последние движения и ближайшие зоны внимания.",
    actions: {
      addTransaction: "Добавить транзакцию",
      planBudget: "Планировать бюджет",
      signOut: "Выйти",
    },
    loading: {
      title: "Подготавливаем рабочее пространство",
      description: "Загружаем балансы, бюджеты и контекст аккаунтов.",
    },
    error: {
      title: "Данные рабочего пространства недоступны",
      description:
        "Не удалось загрузить актуальный финансовый обзор. Повторите попытку или завершите сессию и войдите снова.",
      retry: "Повторить",
    },
    summary: {
      netWorth: "Капитал",
      income: "Доход за месяц",
      expenses: "Расход за месяц",
      savingsRate: "Норма сбережений",
    },
    sections: {
      widgets: "Центр контроля",
      widgetsDescription: "Ключевые виджеты для быстрого контроля финансовой ситуации.",
      budgets: "Контроль бюджетов",
      budgetsDescription: "Следите за давлением по категориям и доступным запасом до закрытия периода.",
      transactions: "Последняя активность",
      transactionsDescription: "Свежие движения по счетам, подпискам и запланированным списаниям.",
      accounts: "Структура счетов",
      accountsDescription: "Основные корзины баланса для ежедневных денег, резерва и долгосрочного капитала.",
      priorities: "Приоритетные сигналы",
      prioritiesDescription: "Самые важные операционные точки, которые стоит проверить дальше.",
      nextSteps: "Рабочие сценарии",
    },
    labels: {
      utilization: "Использование",
    },
    remaining: "Осталось {value}",
    table: {
      title: "Операция",
      account: "Счет",
      category: "Категория",
      date: "Дата",
      amount: "Сумма",
    },
    priorityCards: {
      obligationsTitle: "Ближайшие обязательства",
      obligationsBody: "Объем запланированных списаний сейчас составляет {value}. Проверьте будущие платежи до их исполнения.",
      focusTitle: "Очередь внимания",
      focusBody: "В текущем цикле {count} операций со статусом pending или scheduled требуют просмотра.",
    },
    attention: "{count} элементов требуют внимания",
    backHome: "На главную",
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
            title: "Каркас дашборда",
            description:
              "Хедер, KPI, виджеты и контекстные быстрые действия.",
          },
          {
            title: "Панель фильтров",
            description:
              "Сохраненные фильтры, расширенные правила и пресеты сегментов.",
          },
          {
            title: "Стек аналитики",
            description:
              "Отчеты, графики, сравнения и прогнозные карточки.",
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
        label: "Заметка",
        description:
          "Кроссплатформенные заметки для транзакций, аудита и сверки.",
        placeholder:
          "Добавьте заметки для сверки, treasury review или правил категорий",
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
    auth: {
      title: "Аутентификация",
      description:
        "Здесь размещены анимированные сценарии входа и регистрации с юридическими точками входа и product-grade переходами.",
    },
    terms: {
      title: "Условия использования",
      description:
        "Здесь будут опубликованы юридические условия, формулировки согласия и правила использования сервиса при создании аккаунта.",
    },
    forgotPassword: {
      title: "Восстановление пароля",
      description:
        "Здесь будет размещен отдельный экран восстановления доступа и подключен будущий reset-flow.",
    },
  },
};
