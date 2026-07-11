from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import FooterMultipleLogo, SiteSetting
from .serializers import FooterMultipleLogoSerializer, SiteSettingSerializer


class SiteSettingListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = SiteSetting.objects.filter(site_status=True)
    serializer_class = SiteSettingSerializer
    pagination_class = None


class SiteSettingDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = SiteSetting.objects.filter(site_status=True)
    serializer_class = SiteSettingSerializer


class FooterMultipleLogoListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = FooterMultipleLogo.objects.filter(footer_logo_status=True)
    serializer_class = FooterMultipleLogoSerializer
    pagination_class = None


class FooterMultipleLogoDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = FooterMultipleLogo.objects.filter(footer_logo_status=True)
    serializer_class = FooterMultipleLogoSerializer
