from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_UP
from calendar import monthrange

from django.db import transaction
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from .models import (
    Account,
    AccountDepositProfile,
    AccountTaxProfile,
    Budget,
    Category,
    Currency,
    CryptoAsset,
    CryptoAssetNetwork,
    CryptoHolding,
    CryptoNetwork,
    ExchangeRate,
    Notification,
    NotificationReceipt,
    Transaction,
)


@dataclass(frozen=True)
class AccountDelta:
    account_id: int
    amount: Decimal


@dataclass(frozen=True)
class DepositEvent:
    event_date: date
    amount: Decimal


ZERO = Decimal("0.00")
HUNDRED = Decimal("100")

DEFAULT_CURRENCIES = (
    {"code": "USD", "name": "US Dollar", "symbol": "$", "numeric_code": "840", "is_default": True},
    {"code": "EUR", "name": "Euro", "symbol": "EUR", "numeric_code": "978", "is_default": False},
    {"code": "KGS", "name": "Kyrgyzstani som", "symbol": "KGS", "numeric_code": "417", "is_default": False},
    {"code": "RUB", "name": "Russian Ruble", "symbol": "₽", "numeric_code": "643", "is_default": False},
    {"code": "KZT", "name": "Kazakhstani tenge", "symbol": "₸", "numeric_code": "398", "is_default": False},
)

DEFAULT_SYSTEM_CATEGORIES = (
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Employment income",
        "name_ru": "Доход от работы",
        "name_en": "Employment income",
        "name_kg": "Эмгек кирешеси",
        "slug": "employment-income",
        "icon": "briefcase",
        "color": "emerald",
        "sort_order": 10,
    },
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Salary",
        "name_ru": "Зарплата",
        "name_en": "Salary",
        "name_kg": "Айлык",
        "slug": "salary",
        "parent_slug": "employment-income",
        "icon": "wallet",
        "color": "emerald",
        "sort_order": 11,
    },
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Bonus",
        "name_ru": "Бонус",
        "name_en": "Bonus",
        "name_kg": "Бонус",
        "slug": "bonus",
        "parent_slug": "employment-income",
        "icon": "sparkles",
        "color": "emerald",
        "sort_order": 12,
    },
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Freelance",
        "name_ru": "Фриланс",
        "name_en": "Freelance",
        "name_kg": "Фриланс",
        "slug": "freelance",
        "icon": "laptop",
        "color": "teal",
        "sort_order": 20,
    },
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Business",
        "name_ru": "Бизнес",
        "name_en": "Business",
        "name_kg": "Бизнес",
        "slug": "business",
        "icon": "building",
        "color": "cyan",
        "sort_order": 30,
    },
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Investments",
        "name_ru": "Инвестиции",
        "name_en": "Investments",
        "name_kg": "Инвестициялар",
        "slug": "investments",
        "icon": "line-chart",
        "color": "lime",
        "sort_order": 40,
    },
    {
        "kind": Category.CategoryKind.INCOME,
        "name": "Gifts",
        "name_ru": "Подарки",
        "name_en": "Gifts",
        "name_kg": "Белектер",
        "slug": "gifts",
        "icon": "gift",
        "color": "rose",
        "sort_order": 50,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Housing",
        "name_ru": "Жилье",
        "name_en": "Housing",
        "name_kg": "Турак жай",
        "slug": "housing",
        "icon": "home",
        "color": "sky",
        "sort_order": 110,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Rent",
        "name_ru": "Аренда",
        "name_en": "Rent",
        "name_kg": "Ижара",
        "slug": "rent",
        "parent_slug": "housing",
        "icon": "home-4",
        "color": "sky",
        "sort_order": 111,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Utilities",
        "name_ru": "Коммунальные услуги",
        "name_en": "Utilities",
        "name_kg": "Коммуналдык кызматтар",
        "slug": "utilities",
        "parent_slug": "housing",
        "icon": "flashlight",
        "color": "sky",
        "sort_order": 112,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Food",
        "name_ru": "Еда",
        "name_en": "Food",
        "name_kg": "Тамак-аш",
        "slug": "food",
        "icon": "restaurant",
        "color": "amber",
        "sort_order": 120,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Groceries",
        "name_ru": "Продукты",
        "name_en": "Groceries",
        "name_kg": "Азык-түлүк",
        "slug": "groceries",
        "parent_slug": "food",
        "icon": "basket",
        "color": "amber",
        "sort_order": 121,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Cafes and restaurants",
        "name_ru": "Кафе и рестораны",
        "name_en": "Cafes and restaurants",
        "name_kg": "Кафе жана ресторандар",
        "slug": "cafes-restaurants",
        "parent_slug": "food",
        "icon": "cup",
        "color": "amber",
        "sort_order": 122,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Transport",
        "name_ru": "Транспорт",
        "name_en": "Transport",
        "name_kg": "Транспорт",
        "slug": "transport",
        "icon": "car",
        "color": "violet",
        "sort_order": 130,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Fuel",
        "name_ru": "Топливо",
        "name_en": "Fuel",
        "name_kg": "Күйүүчү май",
        "slug": "fuel",
        "parent_slug": "transport",
        "icon": "gas-station",
        "color": "violet",
        "sort_order": 131,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Taxi and public transport",
        "name_ru": "Такси и общественный транспорт",
        "name_en": "Taxi and public transport",
        "name_kg": "Такси жана коомдук транспорт",
        "slug": "taxi-public-transport",
        "parent_slug": "transport",
        "icon": "bus",
        "color": "violet",
        "sort_order": 132,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Health",
        "name_ru": "Здоровье",
        "name_en": "Health",
        "name_kg": "Ден соолук",
        "slug": "health",
        "icon": "heart-pulse",
        "color": "rose",
        "sort_order": 140,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Education",
        "name_ru": "Образование",
        "name_en": "Education",
        "name_kg": "Билим берүү",
        "slug": "education",
        "icon": "book-open",
        "color": "cyan",
        "sort_order": 150,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Shopping",
        "name_ru": "Покупки",
        "name_en": "Shopping",
        "name_kg": "Сатып алуулар",
        "slug": "shopping",
        "icon": "shopping-bag",
        "color": "fuchsia",
        "sort_order": 160,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Subscriptions",
        "name_ru": "Подписки",
        "name_en": "Subscriptions",
        "name_kg": "Жазылуулар",
        "slug": "subscriptions",
        "icon": "stack",
        "color": "rose",
        "sort_order": 170,
    },
    {
        "kind": Category.CategoryKind.EXPENSE,
        "name": "Entertainment",
        "name_ru": "Развлечения",
        "name_en": "Entertainment",
        "name_kg": "Көңүл ачуу",
        "slug": "entertainment",
        "icon": "movie",
        "color": "indigo",
        "sort_order": 180,
    },
    {
        "kind": Category.CategoryKind.TRANSFER,
        "name": "Internal transfer",
        "name_ru": "Внутренний перевод",
        "name_en": "Internal transfer",
        "name_kg": "Ички которуу",
        "slug": "internal-transfer",
        "icon": "swap",
        "color": "slate",
        "sort_order": 300,
    },
)

DEFAULT_CRYPTO_NETWORKS = (
    {
        "name": "Bitcoin",
        "code": "bitcoin",
        "chain_id": "btc-mainnet",
        "protocol": "UTXO",
        "native_symbol": "BTC",
        "icon": "bitcoin",
        "color": "amber",
        "explorer_url": "https://www.blockchain.com/explorer",
    },
    {
        "name": "Ethereum",
        "code": "ethereum",
        "chain_id": "1",
        "protocol": "ERC20",
        "native_symbol": "ETH",
        "icon": "ethereum",
        "color": "indigo",
        "explorer_url": "https://etherscan.io",
        "is_evm": True,
    },
    {
        "name": "BNB Smart Chain",
        "code": "bsc",
        "chain_id": "56",
        "protocol": "BEP20",
        "native_symbol": "BNB",
        "icon": "bnb",
        "color": "yellow",
        "explorer_url": "https://bscscan.com",
        "is_evm": True,
    },
    {
        "name": "Tron",
        "code": "tron",
        "chain_id": "tron-mainnet",
        "protocol": "TRC20",
        "native_symbol": "TRX",
        "icon": "tron",
        "color": "red",
        "explorer_url": "https://tronscan.org",
    },
    {
        "name": "Solana",
        "code": "solana",
        "chain_id": "sol-mainnet",
        "protocol": "SPL",
        "native_symbol": "SOL",
        "icon": "solana",
        "color": "violet",
        "explorer_url": "https://solscan.io",
    },
    {
        "name": "Litecoin",
        "code": "litecoin",
        "chain_id": "ltc-mainnet",
        "protocol": "UTXO",
        "native_symbol": "LTC",
        "icon": "litecoin",
        "color": "slate",
        "explorer_url": "https://blockchair.com/litecoin",
    },
    {
        "name": "Ripple",
        "code": "xrpl",
        "chain_id": "xrpl-mainnet",
        "protocol": "XRPL",
        "native_symbol": "XRP",
        "icon": "xrp",
        "color": "sky",
        "explorer_url": "https://livenet.xrpl.org",
    },
    {
        "name": "Dogecoin",
        "code": "dogecoin",
        "chain_id": "doge-mainnet",
        "protocol": "UTXO",
        "native_symbol": "DOGE",
        "icon": "dogecoin",
        "color": "amber",
        "explorer_url": "https://dogechain.info",
    },
    {
        "name": "TON",
        "code": "ton",
        "chain_id": "ton-mainnet",
        "protocol": "TON",
        "native_symbol": "TON",
        "icon": "ton",
        "color": "sky",
        "explorer_url": "https://tonviewer.com",
    },
    {
        "name": "Polygon",
        "code": "polygon",
        "chain_id": "137",
        "protocol": "ERC20",
        "native_symbol": "POL",
        "icon": "polygon",
        "color": "fuchsia",
        "explorer_url": "https://polygonscan.com",
        "is_evm": True,
    },
    {
        "name": "Arbitrum One",
        "code": "arbitrum",
        "chain_id": "42161",
        "protocol": "ERC20",
        "native_symbol": "ETH",
        "icon": "arbitrum",
        "color": "cyan",
        "explorer_url": "https://arbiscan.io",
        "is_evm": True,
    },
    {
        "name": "Optimism",
        "code": "optimism",
        "chain_id": "10",
        "protocol": "ERC20",
        "native_symbol": "ETH",
        "icon": "optimism",
        "color": "rose",
        "explorer_url": "https://optimistic.etherscan.io",
        "is_evm": True,
    },
    {
        "name": "Avalanche C-Chain",
        "code": "avalanche",
        "chain_id": "43114",
        "protocol": "ERC20",
        "native_symbol": "AVAX",
        "icon": "avalanche",
        "color": "red",
        "explorer_url": "https://snowtrace.io",
        "is_evm": True,
    },
    {
        "name": "Base",
        "code": "base",
        "chain_id": "8453",
        "protocol": "ERC20",
        "native_symbol": "ETH",
        "icon": "base",
        "color": "blue",
        "explorer_url": "https://basescan.org",
        "is_evm": True,
    },
)

DEFAULT_CRYPTO_ASSETS = (
    {"symbol": "BTC", "name": "Bitcoin", "slug": "bitcoin", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "bitcoin", "color": "amber", "coingecko_id": "bitcoin"},
    {"symbol": "ETH", "name": "Ethereum", "slug": "ethereum", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "ethereum", "color": "indigo", "coingecko_id": "ethereum"},
    {"symbol": "USDT", "name": "Tether", "slug": "tether", "asset_type": CryptoAsset.AssetType.STABLECOIN, "decimals": 6, "icon": "tether", "color": "emerald", "coingecko_id": "tether"},
    {"symbol": "USDC", "name": "USD Coin", "slug": "usd-coin", "asset_type": CryptoAsset.AssetType.STABLECOIN, "decimals": 6, "icon": "usd-coin", "color": "blue", "coingecko_id": "usd-coin"},
    {"symbol": "BNB", "name": "BNB", "slug": "bnb", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "bnb", "color": "yellow", "coingecko_id": "binancecoin"},
    {"symbol": "SOL", "name": "Solana", "slug": "solana", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 9, "icon": "solana", "color": "violet", "coingecko_id": "solana"},
    {"symbol": "XRP", "name": "XRP", "slug": "xrp", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "xrp", "color": "sky", "coingecko_id": "ripple"},
    {"symbol": "DOGE", "name": "Dogecoin", "slug": "dogecoin", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "dogecoin", "color": "amber", "coingecko_id": "dogecoin"},
    {"symbol": "TRX", "name": "TRON", "slug": "tron", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "tron", "color": "red", "coingecko_id": "tron"},
    {"symbol": "TON", "name": "Toncoin", "slug": "toncoin", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 9, "icon": "ton", "color": "sky", "coingecko_id": "the-open-network"},
    {"symbol": "ADA", "name": "Cardano", "slug": "cardano", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "cardano", "color": "blue", "coingecko_id": "cardano"},
    {"symbol": "AVAX", "name": "Avalanche", "slug": "avalanche", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "avalanche", "color": "red", "coingecko_id": "avalanche-2"},
    {"symbol": "DOT", "name": "Polkadot", "slug": "polkadot", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 10, "icon": "polkadot", "color": "fuchsia", "coingecko_id": "polkadot"},
    {"symbol": "LINK", "name": "Chainlink", "slug": "chainlink", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "chainlink", "color": "blue", "coingecko_id": "chainlink"},
    {"symbol": "LTC", "name": "Litecoin", "slug": "litecoin", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "litecoin", "color": "slate", "coingecko_id": "litecoin"},
    {"symbol": "BCH", "name": "Bitcoin Cash", "slug": "bitcoin-cash", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "bitcoin-cash", "color": "emerald", "coingecko_id": "bitcoin-cash"},
    {"symbol": "XLM", "name": "Stellar", "slug": "stellar", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 7, "icon": "stellar", "color": "slate", "coingecko_id": "stellar"},
    {"symbol": "ATOM", "name": "Cosmos", "slug": "cosmos", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "cosmos", "color": "indigo", "coingecko_id": "cosmos"},
    {"symbol": "UNI", "name": "Uniswap", "slug": "uniswap", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "uniswap", "color": "pink", "coingecko_id": "uniswap"},
    {"symbol": "AAVE", "name": "Aave", "slug": "aave", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "aave", "color": "violet", "coingecko_id": "aave"},
    {"symbol": "NEAR", "name": "NEAR Protocol", "slug": "near-protocol", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 24, "icon": "near", "color": "slate", "coingecko_id": "near"},
    {"symbol": "ETC", "name": "Ethereum Classic", "slug": "ethereum-classic", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "etc", "color": "emerald", "coingecko_id": "ethereum-classic"},
    {"symbol": "ICP", "name": "Internet Computer", "slug": "internet-computer", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "icp", "color": "fuchsia", "coingecko_id": "internet-computer"},
    {"symbol": "ARB", "name": "Arbitrum", "slug": "arbitrum", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "arbitrum", "color": "cyan", "coingecko_id": "arbitrum"},
    {"symbol": "OP", "name": "Optimism", "slug": "optimism", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "optimism", "color": "rose", "coingecko_id": "optimism"},
    {"symbol": "POL", "name": "Polygon", "slug": "polygon", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "polygon", "color": "fuchsia", "coingecko_id": "matic-network"},
    {"symbol": "SUI", "name": "Sui", "slug": "sui", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 9, "icon": "sui", "color": "sky", "coingecko_id": "sui"},
    {"symbol": "APT", "name": "Aptos", "slug": "aptos", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "aptos", "color": "slate", "coingecko_id": "aptos"},
    {"symbol": "HBAR", "name": "Hedera", "slug": "hedera", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "hedera", "color": "slate", "coingecko_id": "hedera-hashgraph"},
    {"symbol": "FIL", "name": "Filecoin", "slug": "filecoin", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "filecoin", "color": "cyan", "coingecko_id": "filecoin"},
    {"symbol": "INJ", "name": "Injective", "slug": "injective", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "injective", "color": "blue", "coingecko_id": "injective-protocol"},
    {"symbol": "VET", "name": "VeChain", "slug": "vechain", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "vechain", "color": "slate", "coingecko_id": "vechain"},
    {"symbol": "ALGO", "name": "Algorand", "slug": "algorand", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "algorand", "color": "slate", "coingecko_id": "algorand"},
    {"symbol": "XTZ", "name": "Tezos", "slug": "tezos", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "tezos", "color": "blue", "coingecko_id": "tezos"},
    {"symbol": "EGLD", "name": "MultiversX", "slug": "multiversx", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "multiversx", "color": "slate", "coingecko_id": "elrond-erd-2"},
    {"symbol": "THETA", "name": "Theta Network", "slug": "theta-network", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 18, "icon": "theta", "color": "emerald", "coingecko_id": "theta-token"},
    {"symbol": "SAND", "name": "The Sandbox", "slug": "the-sandbox", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "sand", "color": "cyan", "coingecko_id": "the-sandbox"},
    {"symbol": "MANA", "name": "Decentraland", "slug": "decentraland", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "mana", "color": "orange", "coingecko_id": "decentraland"},
    {"symbol": "GRT", "name": "The Graph", "slug": "the-graph", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "graph", "color": "violet", "coingecko_id": "the-graph"},
    {"symbol": "RUNE", "name": "THORChain", "slug": "thorchain", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "thorchain", "color": "amber", "coingecko_id": "thorchain"},
    {"symbol": "MKR", "name": "Maker", "slug": "maker", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "maker", "color": "emerald", "coingecko_id": "maker"},
    {"symbol": "PEPE", "name": "Pepe", "slug": "pepe", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "pepe", "color": "lime", "coingecko_id": "pepe"},
    {"symbol": "SHIB", "name": "Shiba Inu", "slug": "shiba-inu", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 18, "icon": "shib", "color": "orange", "coingecko_id": "shiba-inu"},
    {"symbol": "DAI", "name": "Dai", "slug": "dai", "asset_type": CryptoAsset.AssetType.STABLECOIN, "decimals": 18, "icon": "dai", "color": "amber", "coingecko_id": "dai"},
    {"symbol": "TUSD", "name": "TrueUSD", "slug": "true-usd", "asset_type": CryptoAsset.AssetType.STABLECOIN, "decimals": 18, "icon": "trueusd", "color": "blue", "coingecko_id": "true-usd"},
    {"symbol": "FDUSD", "name": "First Digital USD", "slug": "first-digital-usd", "asset_type": CryptoAsset.AssetType.STABLECOIN, "decimals": 18, "icon": "fdusd", "color": "blue", "coingecko_id": "first-digital-usd"},
    {"symbol": "WETH", "name": "Wrapped Ether", "slug": "wrapped-ether", "asset_type": CryptoAsset.AssetType.WRAPPED, "decimals": 18, "icon": "weth", "color": "indigo", "coingecko_id": "weth"},
    {"symbol": "WBTC", "name": "Wrapped Bitcoin", "slug": "wrapped-bitcoin", "asset_type": CryptoAsset.AssetType.WRAPPED, "decimals": 8, "icon": "wbtc", "color": "amber", "coingecko_id": "wrapped-bitcoin"},
    {"symbol": "BUSD", "name": "Binance USD", "slug": "binance-usd", "asset_type": CryptoAsset.AssetType.STABLECOIN, "decimals": 18, "icon": "busd", "color": "yellow", "coingecko_id": "binance-usd"},
    {"symbol": "CRO", "name": "Cronos", "slug": "cronos", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "cronos", "color": "blue", "coingecko_id": "crypto-com-chain"},
    {"symbol": "KAS", "name": "Kaspa", "slug": "kaspa", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 8, "icon": "kaspa", "color": "cyan", "coingecko_id": "kaspa"},
    {"symbol": "SEI", "name": "Sei", "slug": "sei", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "sei", "color": "rose", "coingecko_id": "sei-network"},
    {"symbol": "TIA", "name": "Celestia", "slug": "celestia", "asset_type": CryptoAsset.AssetType.COIN, "decimals": 6, "icon": "celestia", "color": "violet", "coingecko_id": "celestia"},
    {"symbol": "JUP", "name": "Jupiter", "slug": "jupiter", "asset_type": CryptoAsset.AssetType.TOKEN, "decimals": 6, "icon": "jupiter", "color": "amber", "coingecko_id": "jupiter-exchange-solana"},
)

DEFAULT_CRYPTO_ASSET_NETWORKS = (
    {"asset": "BTC", "network": "bitcoin", "is_native": True, "token_standard": "UTXO", "sort_order": 10},
    {"asset": "ETH", "network": "ethereum", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "BNB", "network": "bsc", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "SOL", "network": "solana", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "XRP", "network": "xrpl", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "TRX", "network": "tron", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "TON", "network": "ton", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "LTC", "network": "litecoin", "is_native": True, "token_standard": "UTXO", "sort_order": 10},
    {"asset": "DOGE", "network": "dogecoin", "is_native": True, "token_standard": "UTXO", "sort_order": 10},
    {"asset": "AVAX", "network": "avalanche", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "POL", "network": "polygon", "is_native": True, "token_standard": "NATIVE", "sort_order": 10},
    {"asset": "ARB", "network": "arbitrum", "is_native": False, "token_standard": "ERC20", "sort_order": 10},
    {"asset": "OP", "network": "optimism", "is_native": False, "token_standard": "ERC20", "sort_order": 10},
    {"asset": "USDT", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "USDT", "network": "tron", "token_standard": "TRC20", "sort_order": 20},
    {"asset": "USDT", "network": "bsc", "token_standard": "BEP20", "sort_order": 30},
    {"asset": "USDT", "network": "solana", "token_standard": "SPL", "sort_order": 40},
    {"asset": "USDT", "network": "ton", "token_standard": "JETTON", "sort_order": 50},
    {"asset": "USDC", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "USDC", "network": "solana", "token_standard": "SPL", "sort_order": 20},
    {"asset": "USDC", "network": "polygon", "token_standard": "ERC20", "sort_order": 30},
    {"asset": "USDC", "network": "arbitrum", "token_standard": "ERC20", "sort_order": 40},
    {"asset": "USDC", "network": "base", "token_standard": "ERC20", "sort_order": 50},
    {"asset": "DAI", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "DAI", "network": "arbitrum", "token_standard": "ERC20", "sort_order": 20},
    {"asset": "BUSD", "network": "bsc", "token_standard": "BEP20", "sort_order": 10},
    {"asset": "FDUSD", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "FDUSD", "network": "bsc", "token_standard": "BEP20", "sort_order": 20},
    {"asset": "TUSD", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "LINK", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "UNI", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "AAVE", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "WETH", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "WETH", "network": "arbitrum", "token_standard": "ERC20", "sort_order": 20},
    {"asset": "WBTC", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "PEPE", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "SHIB", "network": "ethereum", "token_standard": "ERC20", "sort_order": 10},
    {"asset": "JUP", "network": "solana", "token_standard": "SPL", "sort_order": 10},
)


def category_queryset_for_user(user):
    return Category.objects.filter(Q(owner=user) | Q(is_system=True)).select_related("parent")


def get_period_start(current_date: date, reporting_period: str) -> date:
    if reporting_period == AccountTaxProfile.ReportingPeriod.MONTHLY:
        return current_date.replace(day=1)
    if reporting_period == AccountTaxProfile.ReportingPeriod.YEARLY:
        return current_date.replace(month=1, day=1)

    quarter_start_month = ((current_date.month - 1) // 3) * 3 + 1
    return current_date.replace(month=quarter_start_month, day=1)


def add_months(value: date, months: int) -> date:
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    return value.replace(year=year, month=month, day=1)


def get_next_period_start(period_start: date, reporting_period: str) -> date:
    if reporting_period == AccountTaxProfile.ReportingPeriod.MONTHLY:
        return add_months(period_start, 1)
    if reporting_period == AccountTaxProfile.ReportingPeriod.YEARLY:
        return period_start.replace(year=period_start.year + 1, month=1, day=1)
    return add_months(period_start, 3)


def clamp_due_day(target_date: date, due_day: int) -> date:
    if target_date.month == 12:
        next_month = target_date.replace(year=target_date.year + 1, month=1, day=1)
    else:
        next_month = target_date.replace(month=target_date.month + 1, day=1)
    last_day = (next_month - timedelta(days=1)).day
    return target_date.replace(day=min(due_day, last_day))


def build_tax_obligations(*, user, today: date | None = None) -> list[dict]:
    current_date = today or timezone.localdate()
    profiles = list(
        AccountTaxProfile.objects.filter(account__owner=user, is_active=True, account__status=Account.AccountStatus.ACTIVE)
        .select_related("account", "account__currency")
        .order_by("account__name")
    )
    obligations: list[dict] = []

    for profile in profiles:
        reporting_period = profile.reporting_period
        due_day = profile.due_day
        if profile.account.kind in {Account.AccountKind.ENTREPRENEUR, Account.AccountKind.COMPANY}:
            reporting_period = AccountTaxProfile.ReportingPeriod.QUARTERLY
            due_day = 20

        period_start = get_period_start(current_date, reporting_period)
        next_period_start = get_next_period_start(period_start, reporting_period)
        period_end = next_period_start - timedelta(days=1)
        due_date = clamp_due_day(next_period_start, due_day)

        if profile.calculation_source == AccountTaxProfile.CalculationSource.MANUAL:
            tax_base = profile.manual_tax_base or ZERO
        else:
            tax_base = (
                Transaction.objects.filter(
                    owner=user,
                    account=profile.account,
                    type=Transaction.TransactionType.INCOME,
                    status=Transaction.TransactionStatus.CLEARED,
                    occurred_on__gte=period_start,
                    occurred_on__lte=min(current_date, period_end),
                ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
                or ZERO
            )

        tax_amount = (
            profile.manual_tax_amount
            if profile.manual_tax_amount is not None
            else (tax_base * profile.tax_rate / Decimal("100"))
        )
        social_amount = (
            profile.manual_social_fund_amount
            if profile.manual_social_fund_amount is not None
            else (tax_base * profile.social_fund_rate / Decimal("100"))
        )
        total_amount = (tax_amount or ZERO) + (social_amount or ZERO)

        obligations.append(
            {
                "account_id": profile.account_id,
                "account_name": profile.account.name,
                "currency": profile.account.currency_id,
                "entity_type": profile.entity_type,
                "template_code": profile.template_code,
                "reporting_period": reporting_period,
                "period_start": period_start.isoformat(),
                "period_end": period_end.isoformat(),
                "due_date": due_date.isoformat(),
                "tax_base": f"{(tax_base or ZERO):.2f}",
                "tax_rate": f"{profile.tax_rate:.4f}",
                "tax_amount": f"{(tax_amount or ZERO):.2f}",
                "social_fund_rate": f"{profile.social_fund_rate:.4f}",
                "social_fund_amount": f"{(social_amount or ZERO):.2f}",
                "total_amount": f"{total_amount:.2f}",
                "days_left": (due_date - current_date).days,
            }
        )

    return sorted(obligations, key=lambda item: (item["days_left"], item["due_date"], item["account_name"]))


def ensure_default_currencies() -> None:
    for payload in DEFAULT_CURRENCIES:
        defaults = payload.copy()
        code = defaults.pop("code")
        CurrencyModel = Account._meta.get_field("currency").remote_field.model
        CurrencyModel.objects.update_or_create(code=code, defaults=defaults)


def ensure_system_categories() -> None:
    categories_by_slug: dict[str, Category] = {}
    for payload in DEFAULT_SYSTEM_CATEGORIES:
        defaults = {
            "name": payload["name"],
            "name_ru": payload["name_ru"],
            "name_en": payload["name_en"],
            "name_kg": payload["name_kg"],
            "description": "",
            "icon": payload["icon"],
            "color": payload["color"],
            "sort_order": payload["sort_order"],
            "is_system": True,
            "is_active": True,
        }
        category, _ = Category.objects.update_or_create(
            owner=None,
            kind=payload["kind"],
            slug=payload["slug"],
            defaults=defaults,
        )
        categories_by_slug[payload["slug"]] = category

    for payload in DEFAULT_SYSTEM_CATEGORIES:
        parent_slug = payload.get("parent_slug")
        if not parent_slug:
            continue

        category = categories_by_slug[payload["slug"]]
        parent = categories_by_slug[parent_slug]
        if category.parent_id != parent.id:
            category.parent = parent
            category.save(update_fields=["parent", "updated_at"])


@dataclass(frozen=True)
class CryptoReferenceSeedResult:
    networks_synced: int
    assets_synced: int
    links_synced: int


def ensure_default_crypto_reference_data() -> CryptoReferenceSeedResult:
    networks_by_code: dict[str, CryptoNetwork] = {}
    network_count = 0
    for payload in DEFAULT_CRYPTO_NETWORKS:
        defaults = payload.copy()
        code = defaults.pop("code")
        network, _ = CryptoNetwork.objects.update_or_create(
            owner=None,
            code=code,
            defaults={
                **defaults,
                "is_system": True,
                "is_active": True,
            },
        )
        networks_by_code[code] = network
        network_count += 1

    assets_by_symbol: dict[str, CryptoAsset] = {}
    asset_count = 0
    for payload in DEFAULT_CRYPTO_ASSETS:
        defaults = payload.copy()
        symbol = defaults.pop("symbol")
        asset, _ = CryptoAsset.objects.update_or_create(
            owner=None,
            symbol=symbol,
            defaults={
                **defaults,
                "is_system": True,
                "is_active": True,
            },
        )
        assets_by_symbol[symbol] = asset
        asset_count += 1

    link_count = 0
    for payload in DEFAULT_CRYPTO_ASSET_NETWORKS:
        asset = assets_by_symbol[payload["asset"]]
        network = networks_by_code[payload["network"]]
        CryptoAssetNetwork.objects.update_or_create(
            asset=asset,
            network=network,
            contract_address="",
            defaults={
                "token_standard": payload.get("token_standard", ""),
                "is_native": payload.get("is_native", False),
                "sort_order": payload.get("sort_order", 0),
                "deposit_enabled": True,
                "withdrawal_enabled": True,
                "is_active": True,
            },
        )
        link_count += 1

    return CryptoReferenceSeedResult(
        networks_synced=network_count,
        assets_synced=asset_count,
        links_synced=link_count,
    )


@transaction.atomic
def ensure_user_finance_setup(*, user) -> None:
    ensure_default_currencies()
    ensure_system_categories()
    ensure_default_crypto_reference_data()
    ensure_default_account(user=user)
    refresh_all_budget_spent_amounts(user=user)


@transaction.atomic
def ensure_default_account(*, user) -> None:
    if Account.objects.filter(owner=user).exists():
        return

    currency = (
        Currency.objects.filter(is_active=True, is_default=True).order_by("code").first()
        or Currency.objects.filter(is_active=True).order_by("code").first()
    )
    if currency is None:
        return

    Account.objects.create(
        owner=user,
        currency=currency,
        name="Main account",
        kind=Account.AccountKind.BANK,
        status=Account.AccountStatus.ACTIVE,
        institution="FinMan",
        opening_balance=ZERO,
        current_balance=ZERO,
        include_in_net_worth=True,
        color="emerald",
        icon="RiBankLine",
    )


@transaction.atomic
def create_transaction(*, user, validated_data: dict) -> Transaction:
    status = validated_data.get("status", Transaction.TransactionStatus.CLEARED)
    if status == Transaction.TransactionStatus.CLEARED and not validated_data.get("cleared_at"):
        validated_data["cleared_at"] = timezone.now()
    if status != Transaction.TransactionStatus.DRAFT and not validated_data.get("posted_at"):
        validated_data["posted_at"] = timezone.now()

    transaction_obj = Transaction.objects.create(owner=user, **validated_data)
    _apply_transaction_balance_effects(transaction_obj)
    return transaction_obj


@transaction.atomic
def update_transaction(*, transaction_obj: Transaction, validated_data: dict) -> Transaction:
    transaction_obj = (
        Transaction.objects
        .select_for_update()
        .get(pk=transaction_obj.pk)
    )
    _apply_transaction_balance_effects(transaction_obj, reverse=True)

    for field, value in validated_data.items():
        setattr(transaction_obj, field, value)

    if transaction_obj.status == Transaction.TransactionStatus.CLEARED and not transaction_obj.cleared_at:
        transaction_obj.cleared_at = timezone.now()
    if transaction_obj.status != Transaction.TransactionStatus.CLEARED:
        transaction_obj.cleared_at = None
    if transaction_obj.status != Transaction.TransactionStatus.DRAFT and not transaction_obj.posted_at:
        transaction_obj.posted_at = timezone.now()

    transaction_obj.save()
    _apply_transaction_balance_effects(transaction_obj)
    return transaction_obj


@transaction.atomic
def delete_transaction(*, transaction_obj: Transaction) -> None:
    transaction_obj = (
        Transaction.objects
        .select_for_update()
        .get(pk=transaction_obj.pk)
    )
    _apply_transaction_balance_effects(transaction_obj, reverse=True)
    transaction_obj.delete()


@transaction.atomic
def refresh_budget_spent_amount(*, budget: Budget) -> Budget:
    total = (
        Transaction.objects.filter(
            owner=budget.owner,
            category=budget.category,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
            occurred_on__gte=budget.start_date,
            occurred_on__lte=budget.end_date,
            account__currency=budget.currency,
        ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
        or ZERO
    )
    budget.spent_amount = total
    budget.save(update_fields=["spent_amount", "updated_at"])
    return budget


@transaction.atomic
def refresh_all_budget_spent_amounts(*, user) -> None:
    for budget in Budget.objects.filter(owner=user).select_related("category", "currency"):
        refresh_budget_spent_amount(budget=budget)


def quantize_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def add_months_to_date(value: date, months: int) -> date:
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    day = min(value.day, monthrange(year, month)[1])
    return value.replace(year=year, month=month, day=day)


def get_day_count_denominator(value: date, convention: str) -> Decimal:
    if convention == AccountDepositProfile.DayCountConvention.ACTUAL_366:
        return Decimal("366")
    if convention == AccountDepositProfile.DayCountConvention.ACTUAL_ACTUAL:
        year_days = Decimal("366") if monthrange(value.year, 2)[1] == 29 else Decimal("365")
        return year_days
    if convention == AccountDepositProfile.DayCountConvention.THIRTY_360:
        return Decimal("360")
    return Decimal("365")


def get_day_count_days(start_date: date, end_date: date, convention: str) -> int:
    if end_date <= start_date:
        return 0
    if convention == AccountDepositProfile.DayCountConvention.THIRTY_360:
        start_day = min(start_date.day, 30)
        end_day = min(end_date.day, 30)
        return (
            (end_date.year - start_date.year) * 360
            + (end_date.month - start_date.month) * 30
            + (end_day - start_day)
        )
    return (end_date - start_date).days


def iter_deposit_payout_dates(profile: AccountDepositProfile, end_date: date) -> list[date]:
    if profile.interest_payout_frequency == AccountDepositProfile.InterestPayoutFrequency.AT_MATURITY:
        return [profile.maturity_date] if profile.maturity_date and profile.maturity_date <= end_date else []

    step_by_frequency = {
        AccountDepositProfile.InterestPayoutFrequency.MONTHLY: 1,
        AccountDepositProfile.InterestPayoutFrequency.QUARTERLY: 3,
        AccountDepositProfile.InterestPayoutFrequency.YEARLY: 12,
    }
    step = step_by_frequency.get(profile.interest_payout_frequency, 1)
    payout_dates: list[date] = []
    cursor = add_months_to_date(profile.term_start_date, step)
    capped_end_date = min(end_date, profile.maturity_date) if profile.maturity_date else end_date

    while cursor <= capped_end_date:
        payout_dates.append(cursor)
        cursor = add_months_to_date(cursor, step)

    return payout_dates


def build_deposit_events(account: Account, profile: AccountDepositProfile, *, as_of: date) -> list[DepositEvent]:
    effective_end = min(as_of, profile.maturity_date) if profile.maturity_date else as_of
    if effective_end <= profile.term_start_date:
        return []

    transactions = (
        Transaction.objects.filter(
            owner=account.owner,
            status=Transaction.TransactionStatus.CLEARED,
        )
        .filter(
            Q(account=account) | Q(destination_account=account)
        )
        .filter(occurred_on__gte=profile.term_start_date, occurred_on__lte=effective_end)
        .order_by("occurred_on", "created_at")
    )

    events: list[DepositEvent] = []
    for item in transactions:
        delta = ZERO
        if item.type == Transaction.TransactionType.INCOME and item.account_id == account.id:
            delta += item.amount
        elif item.type == Transaction.TransactionType.EXPENSE and item.account_id == account.id:
            delta -= item.amount
        elif item.type == Transaction.TransactionType.TRANSFER:
            if item.account_id == account.id:
                delta -= item.amount
            if item.destination_account_id == account.id:
                delta += item.destination_amount or item.amount

        if delta != ZERO:
            events.append(DepositEvent(event_date=item.occurred_on, amount=delta))

    return events


def calculate_deposit_snapshot(
    *,
    account: Account,
    profile: AccountDepositProfile,
    as_of: date | None = None,
) -> dict:
    calculation_date = as_of or timezone.localdate()
    effective_end = min(calculation_date, profile.maturity_date) if profile.maturity_date else calculation_date
    principal = Decimal(account.opening_balance)
    capitalized_interest = ZERO
    accrued_interest = ZERO
    paid_out_interest = ZERO
    last_anchor = profile.term_start_date

    payout_dates = iter_deposit_payout_dates(profile, effective_end)
    events_by_date: dict[date, Decimal] = defaultdict(lambda: ZERO)
    for event in build_deposit_events(account, profile, as_of=effective_end):
        events_by_date[event.event_date] += event.amount

    timeline = sorted(set([*payout_dates, *events_by_date.keys(), effective_end]))

    for point in timeline:
        if point > effective_end:
            continue

        days = get_day_count_days(last_anchor, point, profile.day_count_convention)
        if days > 0 and principal > ZERO:
            denominator = get_day_count_denominator(last_anchor, profile.day_count_convention)
            period_interest = principal * (profile.annual_interest_rate / HUNDRED) * Decimal(days) / denominator
            accrued_interest += period_interest

        if point in payout_dates and accrued_interest:
            if profile.capitalization_enabled:
                principal += accrued_interest
                capitalized_interest += accrued_interest
            else:
                paid_out_interest += accrued_interest
            accrued_interest = ZERO

        if point in events_by_date:
            principal += events_by_date[point]

        if principal < ZERO:
            principal = ZERO

        last_anchor = point

    projected_balance = principal + accrued_interest
    annual_yield_amount = principal * (profile.annual_interest_rate / HUNDRED)

    return {
        "principal_balance": f"{quantize_money(principal):.2f}",
        "accrued_interest": f"{quantize_money(accrued_interest):.2f}",
        "capitalized_interest": f"{quantize_money(capitalized_interest):.2f}",
        "paid_out_interest": f"{quantize_money(paid_out_interest):.2f}",
        "projected_balance": f"{quantize_money(projected_balance):.2f}",
        "annual_yield_amount": f"{quantize_money(annual_yield_amount):.2f}",
        "effective_date": effective_end.isoformat(),
        "maturity_date": profile.maturity_date.isoformat() if profile.maturity_date else None,
        "is_matured": bool(profile.maturity_date and calculation_date >= profile.maturity_date),
    }


def build_workspace_overview(*, user) -> dict:
    ensure_user_finance_setup(user=user)
    refresh_all_budget_spent_amounts(user=user)
    tax_obligations = build_tax_obligations(user=user)

    accounts = list(
        Account.objects.filter(owner=user)
        .select_related("currency", "tax_profile", "deposit_profile")
        .order_by("name")
    )
    transactions = list(
        Transaction.objects.filter(owner=user)
        .select_related("account", "destination_account", "category", "account__currency")
        .order_by("-occurred_on", "-created_at")
    )
    budgets = list(
        Budget.objects.filter(owner=user, is_active=True)
        .select_related("category", "currency")
        .order_by("-start_date", "category__name")
    )

    cleared_income = sum(
        (
            item.amount
            for item in transactions
            if item.type == Transaction.TransactionType.INCOME and item.status == Transaction.TransactionStatus.CLEARED
        ),
        ZERO,
    )
    operational_expense = sum(
        (
            item.amount
            for item in transactions
            if item.type == Transaction.TransactionType.EXPENSE
            and item.status in {Transaction.TransactionStatus.CLEARED, Transaction.TransactionStatus.PENDING}
        ),
        ZERO,
    )
    scheduled_outflow = sum(
        (
            item.amount
            for item in transactions
            if item.type == Transaction.TransactionType.EXPENSE and item.status == Transaction.TransactionStatus.PENDING
        ),
        ZERO,
    )
    net_worth = ZERO
    for account in accounts:
        if not account.include_in_net_worth:
            continue
        if hasattr(account, "deposit_profile"):
            snapshot = calculate_deposit_snapshot(account=account, profile=account.deposit_profile)
            net_worth += Decimal(snapshot["projected_balance"])
        else:
            net_worth += account.current_balance
    attention_count = sum(
        1 for item in transactions[:20] if item.status in {Transaction.TransactionStatus.DRAFT, Transaction.TransactionStatus.PENDING}
    )
    attention_count += sum(1 for item in tax_obligations if item["days_left"] <= 15)
    savings_rate = 0.0
    if cleared_income > ZERO:
        savings_rate = round(float(((cleared_income - operational_expense) / cleared_income) * Decimal("100")), 2)

    budget_alerts = sum(1 for budget in budgets if budget.amount and (budget.spent_amount / budget.amount * 100) >= budget.alert_threshold)
    upcoming_items = [
        item
        for item in transactions
        if item.status in {Transaction.TransactionStatus.DRAFT, Transaction.TransactionStatus.PENDING}
    ][:3]

    return {
        "user": {
            "email": user.email,
            "phone": getattr(user, "phone", "") or "",
            "display_name": user.get_full_name() or user.first_name or user.email,
        },
        "summary": {
            "net_worth": f"{net_worth:.2f}",
            "monthly_income": f"{cleared_income:.2f}",
            "monthly_expenses": f"{operational_expense:.2f}",
            "savings_rate": savings_rate,
            "scheduled_outflow": f"{scheduled_outflow:.2f}",
            "attention_count": attention_count,
        },
        "accounts": [
            {
                "id": account.id,
                "name": account.name,
                "kind": account.kind,
                "institution": account.institution,
                "currency": account.currency_id,
                "balance": f"{account.current_balance:.2f}",
                "color_token": account.color,
                "status": account.status,
                "deposit_profile": (
                    {
                        "annual_interest_rate": f"{account.deposit_profile.annual_interest_rate:.4f}",
                        "term_start_date": account.deposit_profile.term_start_date.isoformat(),
                        "maturity_date": (
                            account.deposit_profile.maturity_date.isoformat()
                            if account.deposit_profile.maturity_date
                            else None
                        ),
                        "capitalization_enabled": account.deposit_profile.capitalization_enabled,
                        **calculate_deposit_snapshot(account=account, profile=account.deposit_profile),
                    }
                ) if hasattr(account, "deposit_profile") else None,
                "tax_profile": {
                    "entity_type": account.tax_profile.entity_type,
                    "template_code": account.tax_profile.template_code,
                    "reporting_period": account.tax_profile.reporting_period,
                } if hasattr(account, "tax_profile") else None,
            }
            for account in accounts
        ],
        "budgets": [
            {
                "id": budget.id,
                "category": budget.category.name,
                "spent": f"{budget.spent_amount:.2f}",
                "limit": f"{budget.amount:.2f}",
                "utilization_percent": round((budget.spent_amount / budget.amount) * 100, 2) if budget.amount else 0,
                "remaining": f"{max(budget.amount - budget.spent_amount, ZERO):.2f}",
                "alert_threshold": budget.alert_threshold,
            }
            for budget in budgets[:6]
        ],
        "transactions": [
            {
                "id": item.id,
                "title": item.title,
                "merchant": item.merchant,
                "amount": f"{(-item.amount if item.type == Transaction.TransactionType.EXPENSE else item.amount):.2f}",
                "status": item.status,
                "category": item.category.name if item.category else "",
                "account": item.account.name,
                "transaction_date": item.occurred_on.isoformat(),
                "note": item.description,
            }
            for item in transactions[:8]
        ],
        "tax_obligations": tax_obligations,
        "widgets": [
            {
                "title": "Cash control",
                "value": f"{len(accounts)} active accounts",
                "description": "Balances, reserve coverage and account structure across your finance stack.",
            },
            {
                "title": "Budget pressure",
                "value": f"{budget_alerts} categories to watch",
                "description": "Track overspend risk and react before monthly limits are exhausted.",
            },
            {
                "title": "Attention queue",
                "value": f"{len(upcoming_items)} items",
                "description": ", ".join(item.title for item in upcoming_items) or "No pending items right now.",
            },
        ],
    }


def build_dashboard_overview(*, user) -> dict:
    ensure_user_finance_setup(user=user)
    refresh_all_budget_spent_amounts(user=user)

    accounts = list(
        Account.objects.filter(owner=user)
        .select_related("currency", "deposit_profile")
        .order_by("name")
    )
    transactions = list(
        Transaction.objects.filter(owner=user)
        .select_related("account", "destination_account", "category", "account__currency")
        .order_by("-occurred_on", "-created_at")[:10]
    )
    budgets = list(
        Budget.objects.filter(owner=user, is_active=True)
        .select_related("category", "currency")
        .order_by("start_date", "category__name")
    )

    balances_by_currency = defaultdict(lambda: ZERO)
    for account in accounts:
        if hasattr(account, "deposit_profile"):
            snapshot = calculate_deposit_snapshot(account=account, profile=account.deposit_profile)
            balances_by_currency[account.currency_id] += Decimal(snapshot["projected_balance"])
        else:
            balances_by_currency[account.currency_id] += account.current_balance

    income_total = (
        Transaction.objects.filter(
            owner=user,
            type=Transaction.TransactionType.INCOME,
            status=Transaction.TransactionStatus.CLEARED,
        ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
        or ZERO
    )
    expense_total = (
        Transaction.objects.filter(
            owner=user,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
        ).aggregate(total=Coalesce(Sum("amount"), ZERO))["total"]
        or ZERO
    )

    return {
        "totals": {
            "income": f"{income_total:.2f}",
            "expense": f"{expense_total:.2f}",
            "net": f"{(income_total - expense_total):.2f}",
            "balances_by_currency": [
                {"currency": currency, "balance": f"{amount:.2f}"}
                for currency, amount in sorted(balances_by_currency.items())
            ],
        },
        "accounts": [
            {
                "id": account.id,
                "name": account.name,
                "kind": account.kind,
                "status": account.status,
                "currency": account.currency_id,
                "current_balance": f"{account.current_balance:.2f}",
                "opening_balance": f"{account.opening_balance:.2f}",
                "institution": account.institution,
                "deposit_profile": (
                    {
                        "annual_interest_rate": f"{account.deposit_profile.annual_interest_rate:.4f}",
                        **calculate_deposit_snapshot(account=account, profile=account.deposit_profile),
                    }
                ) if hasattr(account, "deposit_profile") else None,
            }
            for account in accounts
        ],
        "budgets": [
            {
                "id": budget.id,
                "category": budget.category.name,
                "currency": budget.currency_id,
                "amount": f"{budget.amount:.2f}",
                "spent_amount": f"{budget.spent_amount:.2f}",
                "utilization_percent": (
                    round((budget.spent_amount / budget.amount) * 100, 2)
                    if budget.amount
                    else 0
                ),
                "start_date": budget.start_date.isoformat(),
                "end_date": budget.end_date.isoformat(),
            }
            for budget in budgets
        ],
        "recent_transactions": [
            {
                "id": item.id,
                "title": item.title,
                "type": item.type,
                "status": item.status,
                "amount": f"{item.amount:.2f}",
                "account": item.account.name,
                "destination_account": item.destination_account.name if item.destination_account else None,
                "currency": item.account.currency_id,
                "category": item.category.name if item.category else None,
                "occurred_on": item.occurred_on.isoformat(),
                "merchant": item.merchant,
            }
            for item in transactions
        ],
    }


def _apply_transaction_balance_effects(transaction_obj: Transaction, *, reverse: bool = False) -> None:
    if transaction_obj.status != Transaction.TransactionStatus.CLEARED:
        return

    direction = Decimal("-1") if reverse else Decimal("1")
    deltas = _build_account_deltas(transaction_obj)
    if not deltas:
        return

    account_ids = [delta.account_id for delta in deltas]
    accounts = {
        account.id: account
        for account in Account.objects.select_for_update().filter(id__in=account_ids)
    }

    aggregated_deltas = defaultdict(lambda: ZERO)
    for delta in deltas:
        aggregated_deltas[delta.account_id] += delta.amount * direction

    for account_id, amount in aggregated_deltas.items():
        account = accounts[account_id]
        account.current_balance += amount
        account.save(update_fields=["current_balance", "updated_at"])


def _build_account_deltas(transaction_obj: Transaction) -> list[AccountDelta]:
    if transaction_obj.type == Transaction.TransactionType.INCOME:
        return [AccountDelta(account_id=transaction_obj.account_id, amount=transaction_obj.amount)]

    if transaction_obj.type == Transaction.TransactionType.EXPENSE:
        return [AccountDelta(account_id=transaction_obj.account_id, amount=-transaction_obj.amount)]

    if transaction_obj.type == Transaction.TransactionType.TRANSFER and transaction_obj.destination_account_id:
        destination_amount = transaction_obj.destination_amount or transaction_obj.amount
        return [
            AccountDelta(account_id=transaction_obj.account_id, amount=-transaction_obj.amount),
            AccountDelta(account_id=transaction_obj.destination_account_id, amount=destination_amount),
        ]

    return []
