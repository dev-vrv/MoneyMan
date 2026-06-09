from django.urls import path

from .views import ContactMessageCreateView, PublicContactDetailsView, SiteVisitCreateView

urlpatterns = [
    path("public-contact-details/", PublicContactDetailsView.as_view(), name="public-contact-details"),
    path("contact-messages/", ContactMessageCreateView.as_view(), name="contact-message-create"),
    path("site-visits/", SiteVisitCreateView.as_view(), name="site-visit-create"),
]
