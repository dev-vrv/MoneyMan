from __future__ import annotations

import logging

from celery import shared_task

from .currency_sync import sync_fx_kg_reference_data


logger = logging.getLogger(__name__)


@shared_task(name="app.sync_fx_kg_reference_data")
def sync_fx_kg_reference_data_task():
    result = sync_fx_kg_reference_data()
    logger.info(
        "FX.kg sync task finished: %s currencies, %s rates.",
        result.currencies_synced,
        result.rates_synced,
    )
    return {
        "currencies_synced": result.currencies_synced,
        "rates_synced": result.rates_synced,
        "effective_date": result.effective_date,
    }
