from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import (
    RegisterUser,
    LoginUser,
    LogoutUser,
    Profile,
    UserList,
    UserDetailView,
    DistrictView,
    UpazilaView,
    IsDonateFirstView,
    IsActiveView,
    DonationView,
    SendResetPasswordOtpView,
    VerifyResetPasswordOtpView,
    ResetPasswordView,
)

urlpatterns = [
    # Authentication
    path('users/register/', RegisterUser.as_view(), name='register'),
    path('users/login/', LoginUser.as_view(), name='login'),
    path('users/logout/', LogoutUser.as_view(), name='logout'),
    path('users/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    # Password reset (OTP)
    path('users/send-reset-password-otp/', SendResetPasswordOtpView.as_view(), name='send-reset-password-otp'),
    path('users/verify-reset-password-otp/', VerifyResetPasswordOtpView.as_view(), name='verify-reset-password-otp'),
    path('users/reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    # Profile & donor directory
    path('users/profile/', Profile.as_view(), name='profile'),
    path('users/', UserList.as_view(), name='users'),
    path('users/is_donate_first/', IsDonateFirstView.as_view(), name='is_donate_first'),
    path('users/is_active/', IsActiveView.as_view(), name='is_active'),
    path('users/donate/', DonationView.as_view(), name='donate'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Geographic data
    path('area/district/', DistrictView.as_view(), name='district'),
    path('area/upazila/', UpazilaView.as_view(), name='upazila'),
]
