from django.conf import settings
from django.db import models
from django.utils.text import slugify

from app.models import TimeStampedModel


class PublicContactDetails(TimeStampedModel):
    class LocaleCode(models.TextChoices):
        EN = "en", "English"
        RU = "ru", "Russian"
        KG = "kg", "Kyrgyz"

    locale = models.CharField(max_length=8, choices=LocaleCode.choices, unique=True)
    phone_primary = models.CharField(max_length=64, blank=True, default="")
    phone_secondary = models.CharField(max_length=64, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    address = models.CharField(max_length=255, blank=True, default="")
    working_hours = models.CharField(max_length=160, blank=True, default="")
    telegram_url = models.URLField(blank=True, default="")
    whatsapp_url = models.URLField(blank=True, default="")
    instagram_url = models.URLField(blank=True, default="")
    youtube_url = models.URLField(blank=True, default="")
    facebook_url = models.URLField(blank=True, default="")
    linkedin_url = models.URLField(blank=True, default="")
    tiktok_url = models.URLField(blank=True, default="")

    class Meta:
        ordering = ("locale",)
        verbose_name = "Public contact details"
        verbose_name_plural = "Public contact details"

    def save(self, *args, **kwargs):
        self.locale = self.locale.strip().lower()
        self.phone_primary = self.phone_primary.strip()
        self.phone_secondary = self.phone_secondary.strip()
        self.email = self.email.strip().lower()
        self.address = self.address.strip()
        self.working_hours = self.working_hours.strip()
        self.telegram_url = self.telegram_url.strip()
        self.whatsapp_url = self.whatsapp_url.strip()
        self.instagram_url = self.instagram_url.strip()
        self.youtube_url = self.youtube_url.strip()
        self.facebook_url = self.facebook_url.strip()
        self.linkedin_url = self.linkedin_url.strip()
        self.tiktok_url = self.tiktok_url.strip()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Public contacts<{self.locale}>"


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True, default="")
    message = models.TextField(max_length=4000)
    locale = models.CharField(max_length=8, blank=True, default="")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True, default="")
    source = models.CharField(max_length=64, blank=True, default="website")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_messages",
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Contact message"
        verbose_name_plural = "Contact messages"

    def save(self, *args, **kwargs):
        self.name = self.name.strip()
        self.email = self.email.strip().lower()
        self.phone = self.phone.strip()
        self.locale = self.locale.strip().lower()
        self.user_agent = self.user_agent.strip()
        self.source = self.source.strip() or "website"
        self.message = self.message.strip()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"


class TrafficSourceLink(TimeStampedModel):
    name = models.CharField(max_length=120)
    code = models.SlugField(max_length=64, unique=True)
    target_path = models.CharField(max_length=255, blank=True, default="/")
    locale = models.CharField(max_length=8, blank=True, default="")
    utm_source = models.CharField(max_length=120, blank=True, default="")
    utm_medium = models.CharField(max_length=120, blank=True, default="")
    utm_campaign = models.CharField(max_length=160, blank=True, default="")
    utm_content = models.CharField(max_length=160, blank=True, default="")
    utm_term = models.CharField(max_length=160, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("name", "code")
        verbose_name = "Traffic source link"
        verbose_name_plural = "Traffic source links"

    def save(self, *args, **kwargs):
        self.name = self.name.strip()
        self.code = slugify(self.code or self.name).strip("-")
        self.target_path = (self.target_path or "/").strip() or "/"
        if not self.target_path.startswith("/"):
            self.target_path = f"/{self.target_path}"
        self.locale = self.locale.strip().lower()
        self.utm_source = self.utm_source.strip()
        self.utm_medium = self.utm_medium.strip()
        self.utm_campaign = self.utm_campaign.strip()
        self.utm_content = self.utm_content.strip()
        self.utm_term = self.utm_term.strip()
        self.notes = self.notes.strip()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.name} [{self.code}]"


class SiteVisit(TimeStampedModel):
    source_link = models.ForeignKey(
        TrafficSourceLink,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="visits",
    )
    tracking_code = models.CharField(max_length=64, blank=True, default="")
    locale = models.CharField(max_length=8, blank=True, default="")
    path = models.CharField(max_length=255, blank=True, default="")
    landing_url = models.URLField(max_length=600, blank=True, default="")
    referrer_url = models.URLField(max_length=600, blank=True, default="")
    referrer_host = models.CharField(max_length=255, blank=True, default="")
    utm_source = models.CharField(max_length=120, blank=True, default="")
    utm_medium = models.CharField(max_length=120, blank=True, default="")
    utm_campaign = models.CharField(max_length=160, blank=True, default="")
    utm_content = models.CharField(max_length=160, blank=True, default="")
    utm_term = models.CharField(max_length=160, blank=True, default="")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True, default="")

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Site visit"
        verbose_name_plural = "Site visits"
        indexes = [
            models.Index(fields=("created_at",)),
            models.Index(fields=("tracking_code",)),
            models.Index(fields=("referrer_host",)),
            models.Index(fields=("locale",)),
        ]

    def save(self, *args, **kwargs):
        self.tracking_code = self.tracking_code.strip().lower()
        self.locale = self.locale.strip().lower()
        self.path = self.path.strip()
        self.landing_url = self.landing_url.strip()
        self.referrer_url = self.referrer_url.strip()
        self.referrer_host = self.referrer_host.strip().lower()
        self.utm_source = self.utm_source.strip()
        self.utm_medium = self.utm_medium.strip()
        self.utm_campaign = self.utm_campaign.strip()
        self.utm_content = self.utm_content.strip()
        self.utm_term = self.utm_term.strip()
        self.user_agent = self.user_agent.strip()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Visit<{self.path or '/'}:{self.tracking_code or 'direct'}>"
