from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views
from .views import RegisterUser, LogoutUser, LoginUser, Profile, UserList, DistrictView, UpazilaView, IsDonateFirstView, IsActiveView,DonationView
router = DefaultRouter()
# router.register(r'users', UserViewSet)


urlpatterns = [
    path('', include(router.urls)),

    path('users/register/', RegisterUser.as_view(), name='register'),
    path('users/login/', LoginUser.as_view(), name='login'),
    path('users/logout/', LogoutUser.as_view(), name='logout'),
    path('users/profile/', Profile.as_view(), name='profile'),
    path('users/', UserList.as_view(), name='users'),
    path('users/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path('area/district/', DistrictView.as_view(), name='district'),
    path('area/upazila/', UpazilaView.as_view(), name='upazila'),

    path('users/is_donate_first/', IsDonateFirstView.as_view(), name='is_donate_first'),
    path('users/is_active/', IsActiveView.as_view(), name='is_active'),
    path('users/donate/', DonationView.as_view(), name='donate'),

]
