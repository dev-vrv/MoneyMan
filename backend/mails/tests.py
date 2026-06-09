from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContactMessage, PublicContactDetails, SiteVisit, TrafficSourceLink


class ContactMessageApiTests(APITestCase):
    def test_create_contact_message(self):
        response = self.client.post(
            reverse("api:contact-message-create"),
            {
                "name": "Ivan Ivanov",
                "email": "ivan@example.com",
                "phone": "+996700000000",
                "message": "Need help with balances and exchange rates setup.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.get().email, "ivan@example.com")

    def test_public_contact_details_resolve_requested_locale_and_field_fallbacks(self):
        PublicContactDetails.objects.create(
            locale="en",
            phone_primary="+1 555 0100",
            email="hello@example.com",
            youtube_url="https://youtube.com/@finman-en",
        )
        PublicContactDetails.objects.create(
            locale="ru",
            phone_primary="+7 700 000 00 01",
            telegram_url="https://t.me/finman_ru",
            address="Bishkek",
        )
        PublicContactDetails.objects.create(
            locale="kg",
            email="salam@example.kg",
        )

        response = self.client.get(
            reverse("api:public-contact-details"),
            HTTP_X_LOCALE="kg",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone_primary"], "+7 700 000 00 01")
        self.assertEqual(response.data["email"], "salam@example.kg")
        self.assertEqual(response.data["telegram_url"], "https://t.me/finman_ru")
        self.assertEqual(response.data["youtube_url"], "https://youtube.com/@finman-en")
        self.assertEqual(response.data["resolved_sources"]["phone_primary"], "ru")
        self.assertEqual(response.data["resolved_sources"]["email"], "kg")

    def test_public_contact_details_return_default_phone_and_email_when_db_empty(self):
        response = self.client.get(
            reverse("api:public-contact-details"),
            HTTP_X_LOCALE="ru",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone_primary"], "+996 550 337683")
        self.assertEqual(response.data["email"], "dev.vrv@gmail.com")
        self.assertEqual(response.data["resolved_sources"]["phone_primary"], "default")
        self.assertEqual(response.data["resolved_sources"]["email"], "default")

    def test_create_site_visit_with_tracking_code_and_referrer(self):
        TrafficSourceLink.objects.create(
            name="Telegram campaign",
            code="tg-launch",
            locale="ru",
            target_path="/pricing",
            utm_source="telegram",
            utm_medium="social",
        )

        response = self.client.post(
            reverse("api:site-visit-create"),
            {
                "tracking_code": "tg-launch",
                "path": "/ru/pricing",
                "landing_url": "https://finman.example/ru/pricing?trk=tg-launch&utm_source=telegram",
                "referrer_url": "https://t.me/finman_channel",
                "utm_source": "telegram",
                "utm_medium": "social",
            },
            format="json",
            HTTP_X_LOCALE="ru",
            HTTP_USER_AGENT="pytest-browser",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SiteVisit.objects.count(), 1)

        visit = SiteVisit.objects.select_related("source_link").get()
        self.assertEqual(visit.source_link.code, "tg-launch")
        self.assertEqual(visit.referrer_host, "t.me")
        self.assertEqual(visit.locale, "ru")
        self.assertEqual(visit.utm_source, "telegram")

    def test_create_site_visit_without_tracking_code_marks_direct_source(self):
        response = self.client.post(
            reverse("api:site-visit-create"),
            {
                "path": "/en",
                "landing_url": "https://finman.example/en",
            },
            format="json",
            HTTP_X_LOCALE="en",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        visit = SiteVisit.objects.get()
        self.assertEqual(visit.tracking_code, "")
        self.assertIsNone(visit.source_link)
        self.assertEqual(visit.locale, "en")
