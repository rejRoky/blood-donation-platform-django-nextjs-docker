import logging

from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings

from . import services
from .models import User, Districts, Upazilas, UserAddress, Donations, UserActionLog
from .serializers import (
    UserSerializer,
    DonorListSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    ProfileUpdateSerializer,
    SendResetOtpSerializer,
    VerifyResetOtpSerializer,
    ResetPasswordSerializer,
    DistrictSerializer,
    UpazilaSerializer,
    DonationsSerializer,
)

logger = logging.getLogger(__name__)


def get_client_ip(request):
    """Helper function to get the client IP address."""
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
    if ip_address:
        ip_address = ip_address.split(',')[0].strip()
    else:
        ip_address = request.META.get('REMOTE_ADDR', '0.0.0.0')
    return ip_address


def _log_action(user, action_type, description, request):
    """Persist a security-relevant user action; never break the request over it."""
    try:
        UserActionLog.objects.create(
            user=user,
            action_type=action_type,
            action_description=description,
            ip_address=get_client_ip(request),
        )
    except Exception:
        logger.exception("Failed to write user action log")


def _user_address_payload(user):
    """Login/profile convenience payload describing the user's address."""
    address = user.address or UserAddress.objects.filter(user=user).select_related('district', 'upazila').first()
    if address is None or address.district is None or address.upazila is None:
        return None
    return {
        'district': address.district.name,
        'district_id': address.district.id,
        'upazila': address.upazila.name,
        'upazila_id': address.upazila.id,
    }


class RegisterUser(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'register'

    @swagger_auto_schema(
        request_body=UserRegistrationSerializer,
        responses={201: UserSerializer, 400: 'Validation error'},
        security=[],
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        _log_action(user, 'REGISTER', 'User registered', request)

        return Response(
            {
                'success': True,
                'message': 'Registration successful.',
                **UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginUser(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    @swagger_auto_schema(
        request_body=UserLoginSerializer,
        responses={200: 'Access/refresh token pair with user profile', 401: 'Invalid credentials'},
        security=[],
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Single authenticate call; the same generic message is returned whether
        # the account is missing, inactive, or the password is wrong, so mobile
        # numbers cannot be enumerated through this endpoint.
        user = authenticate(
            request,
            mobile_number=serializer.validated_data['mobile_number'],
            password=serializer.validated_data['password'],
        )
        if user is None:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid mobile number or password.',
                    'code': 'invalid_credentials',
                    'status_code': status.HTTP_401_UNAUTHORIZED,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        _log_action(user, 'LOGIN', 'User logged in', request)

        return Response({
            'success': True,
            'token': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'token_type': 'Bearer',
                'expires_in': refresh.access_token.lifetime.total_seconds(),
            },
            'user': UserSerializer(user).data,
            'user_address': _user_address_payload(user),
        })


class LogoutUser(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token of the user'),
            },
            required=['refresh'],
        ),
        responses={200: 'Success', 400: 'Invalid token'},
    )
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'success': False, 'message': 'Refresh token is required.', 'code': 'validation_error',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {'success': False, 'message': 'Invalid or expired refresh token.', 'code': 'invalid_token',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        _log_action(request.user, 'LOGOUT', 'User logged out', request)
        return Response({'success': True, 'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)


class Profile(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: UserSerializer})
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=ProfileUpdateSerializer,
        responses={200: UserSerializer, 400: 'Validation error'},
    )
    def put(self, request):
        serializer = ProfileUpdateSerializer(
            instance=request.user, data=request.data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        _log_action(user, 'UPDATE', 'User updated profile', request)
        return Response(UserSerializer(user).data)


class UserList(APIView):
    """
    Donor directory. Staff accounts are excluded — this endpoint exists so
    donors can find each other, not to enumerate administrators.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('blood_group', openapi.IN_QUERY, type=openapi.TYPE_STRING),
            openapi.Parameter('district_id', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter('upazila_id', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter('page', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        ],
        responses={200: UserSerializer(many=True)},
    )
    def get(self, request):
        from django.db.models import Count, Max

        users = (
            User.objects
            .filter(is_active=True, is_staff=False, is_superuser=False)
            .select_related('address__district', 'address__upazila')
            .annotate(
                donation_count=Count('donations'),
                last_donation_date=Max('donations__donation_date'),
            )
            .order_by('-created_at')
        )

        blood_group = request.query_params.get('blood_group')
        district_id = request.query_params.get('district_id')
        upazila_id = request.query_params.get('upazila_id')

        if blood_group:
            users = users.filter(blood_group=blood_group)
        if district_id:
            users = users.filter(address__district_id=district_id)
        if upazila_id:
            users = users.filter(address__upazila_id=upazila_id)

        from project.pagination import StandardResultsSetPagination
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(users, request)
        serializer = DonorListSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: UserSerializer, 404: 'Not Found'})
    def get(self, request, pk):
        user = get_object_or_404(
            User.objects.select_related('address__district', 'address__upazila'),
            pk=pk, is_active=True,
        )
        serializer = UserSerializer(user)
        return Response(serializer.data)


class DistrictView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={200: DistrictSerializer(many=True)}, security=[])
    def get(self, request):
        districts = Districts.objects.all()
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)


class UpazilaView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('district_id', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=True),
        ],
        responses={200: UpazilaSerializer(many=True)},
        security=[],
    )
    def get(self, request):
        """Canonical read endpoint: GET /area/upazila/?district_id=N"""
        return self._list(request.query_params.get('district_id'))

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'district_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the district'),
            },
            required=['district_id'],
        ),
        responses={200: UpazilaSerializer(many=True)},
        security=[],
    )
    def post(self, request):
        """Legacy body-based variant kept for existing clients."""
        return self._list(request.data.get('district_id'))

    def _list(self, district_id):
        if district_id in (None, ''):
            return Response(
                {'success': False, 'message': 'District ID is required.', 'code': 'validation_error',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )
        upazilas = Upazilas.objects.filter(district_id=district_id)
        serializer = UpazilaSerializer(upazilas, many=True)
        return Response(serializer.data)


class IsDonateFirstView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'is_donate_first': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Is donate first'),
            },
            required=['is_donate_first'],
        ),
        responses={200: 'Success'},
    )
    def post(self, request):
        is_donate_first = request.data.get('is_donate_first')
        if not isinstance(is_donate_first, bool):
            return Response(
                {'success': False, 'message': 'is_donate_first must be a boolean.', 'code': 'validation_error',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.is_donate_first = is_donate_first
        request.user.save(update_fields=['is_donate_first', 'updated_at'])
        return Response({'success': True, 'message': 'Donation preference updated.'}, status=status.HTTP_200_OK)


class IsActiveView(APIView):
    """Toggles the user's donor availability flag (is_donate)."""
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Donor availability'),
            },
            required=['is_active'],
        ),
        responses={200: 'Success'},
    )
    def post(self, request):
        is_active = request.data.get('is_active')
        if not isinstance(is_active, bool):
            return Response(
                {'success': False, 'message': 'is_active must be a boolean.', 'code': 'validation_error',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.is_donate = is_active
        request.user.save(update_fields=['is_donate', 'updated_at'])
        return Response({'success': True, 'message': 'Donor availability updated.'}, status=status.HTTP_200_OK)


class SendResetPasswordOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    @swagger_auto_schema(
        request_body=SendResetOtpSerializer,
        responses={200: 'OTP dispatched if the account exists'},
        security=[],
    )
    def post(self, request):
        serializer = SendResetOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile_number = serializer.validated_data['mobile_number']

        payload = {
            'success': True,
            'message': 'If an account exists with this mobile number, an OTP has been sent.',
        }

        # The OTP is only actually generated for existing accounts, but the
        # response is identical either way so accounts cannot be enumerated.
        if User.objects.filter(mobile_number=mobile_number, is_active=True).exists():
            otp = services.send_otp(mobile_number)
            if settings.OTP_DEBUG_EXPOSE:
                payload['otp'] = otp

        return Response(payload, status=status.HTTP_200_OK)


class VerifyResetPasswordOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    @swagger_auto_schema(
        request_body=VerifyResetOtpSerializer,
        responses={200: 'OTP verified; response contains reset_token', 400: 'Invalid or expired OTP'},
        security=[],
    )
    def post(self, request):
        serializer = VerifyResetOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_token = services.verify_otp(
            serializer.validated_data['mobile_number'],
            serializer.validated_data['otp'],
        )
        if reset_token is None:
            return Response(
                {'success': False, 'message': 'Invalid or expired OTP.', 'code': 'invalid_otp',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {'success': True, 'message': 'OTP verified successfully.', 'reset_token': reset_token},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'otp'

    @swagger_auto_schema(
        request_body=ResetPasswordSerializer,
        responses={200: 'Password reset successfully', 400: 'Invalid or expired reset token'},
        security=[],
    )
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile_number = serializer.validated_data['mobile_number']

        if not services.consume_reset_token(mobile_number, serializer.validated_data['reset_token']):
            return Response(
                {'success': False, 'message': 'Invalid or expired reset token. Please verify the OTP again.',
                 'code': 'invalid_reset_token', 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(mobile_number=mobile_number, is_active=True)
        except User.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Invalid or expired reset token. Please verify the OTP again.',
                 'code': 'invalid_reset_token', 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password', 'updated_at'])

        # Revoke every outstanding refresh token so stolen sessions die with
        # the old password.
        try:
            from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
            for token in OutstandingToken.objects.filter(user=user):
                BlacklistedToken.objects.get_or_create(token=token)
        except Exception:
            logger.exception("Failed to blacklist outstanding tokens after password reset")

        _log_action(user, 'PASSWORD_RESET', 'Password reset via OTP', request)
        return Response({'success': True, 'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)


class DonationView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'amount': openapi.Schema(type=openapi.TYPE_INTEGER, description='Amount of donation (ml)'),
                'date': openapi.Schema(type=openapi.TYPE_STRING, format='date',
                                       description='Date of donation (YYYY-MM-DD)'),
            },
            required=['amount', 'date'],
        ),
        responses={201: DonationsSerializer, 400: 'Validation error'},
    )
    def post(self, request):
        serializer = DonationsSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'success': True, 'message': 'Donation added successfully.', 'donation': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @swagger_auto_schema(responses={200: DonationsSerializer(many=True)})
    def get(self, request):
        donations = Donations.objects.filter(user=request.user)
        serializer = DonationsSerializer(donations, many=True, context={'request': request})
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'donation_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the donation'),
            },
            required=['donation_id'],
        ),
        responses={200: 'Success', 404: 'Not found'},
    )
    def delete(self, request):
        donation_id = request.data.get('donation_id')
        if donation_id is None:
            return Response(
                {'success': False, 'message': 'Donation ID is required.', 'code': 'validation_error',
                 'status_code': status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Scoped to the requesting user: nobody can delete another donor's records.
        deleted, _ = Donations.objects.filter(id=donation_id, user=request.user).delete()
        if not deleted:
            return Response(
                {'success': False, 'message': 'Donation not found.', 'code': 'not_found',
                 'status_code': status.HTTP_404_NOT_FOUND},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({'success': True, 'message': 'Donation deleted successfully.'}, status=status.HTTP_200_OK)
