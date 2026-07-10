import random
import logging

from django.contrib.auth import authenticate
from django.core.cache import cache
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from datetime import datetime, timedelta

from .models import User, Districts, Upazilas, UserAddress, Donations
from .serializers import UserSerializer, DistrictSerializer, UpazilaSerializer, DonationsSerializer

logger = logging.getLogger(__name__)


def get_client_ip(request):
    """Helper function to get the client IP address."""
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
    if ip_address:
        ip_address = ip_address.split(',')[0]
    else:
        ip_address = request.META.get('REMOTE_ADDR', '0.0.0.0')
    return ip_address


class RegisterUser(APIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'mobile_number': openapi.Schema(type=openapi.TYPE_STRING,
                                                description='Mobile number of the user, must be 11 digits long and start with 01 and contain only digits'),
                'password': openapi.Schema(type=openapi.TYPE_STRING,
                                           description='Password of the user, must be at least 8 characters long and contain at least one digit, one alphabet, one uppercase letter, one lowercase letter, and one special character'),
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='First name of the user'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Last name of the user'),
                'blood_group': openapi.Schema(type=openapi.TYPE_STRING, description='Blood group of the user'),
                'district': openapi.Schema(type=openapi.TYPE_INTEGER, description='District of the user'),
                'upazila': openapi.Schema(type=openapi.TYPE_INTEGER, description='Upazila of the user'),

            },
            required=['mobile_number', 'password', 'first_name', 'last_name', 'blood_group', 'district', 'upazila'],

        ),
        responses={201: 'Success'},
    )
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        blood_group = request.data.get('blood_group')
        district = request.data.get('district')
        upazila = request.data.get('upazila')

        # Null validation
        if mobile_number is None:
            return Response({'error': 'Mobile number is required'}, status=status.HTTP_400_BAD_REQUEST)

        if password is None:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        if first_name is None:
            return Response({'error': 'First name is required'}, status=status.HTTP_400_BAD_REQUEST)

        if last_name is None:
            return Response({'error': 'Last name is required'}, status=status.HTTP_400_BAD_REQUEST)

        if blood_group is None:
            return Response({'error': 'Blood group is required'}, status=status.HTTP_400_BAD_REQUEST)

        if district is None:
            return Response({'error': 'District is required'}, status=status.HTTP_400_BAD_REQUEST)

        if upazila is None:
            return Response({'error': 'Upazila is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Mobile number validation
        if mobile_number == '' or password == '' or first_name == '' or last_name == '' or blood_group == '' or district == '' or upazila == '':
            return Response({'error': 'Fields cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        if mobile_number is not None and len(mobile_number) != 11:
            return Response({'error': 'Mobile number must be 11 digits long'}, status=status.HTTP_400_BAD_REQUEST)

        if not mobile_number.isdigit():
            return Response({'error': 'Mobile number must contain only digits'}, status=status.HTTP_400_BAD_REQUEST)

        if not mobile_number.startswith('01'):
            return Response({'error': 'Mobile number must start with 01'}, status=status.HTTP_400_BAD_REQUEST)

        # Password validation
        if password is None or len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not any(char.isdigit() for char in password):
            return Response({'error': 'Password must contain at least one digit'}, status=status.HTTP_400_BAD_REQUEST)

        if not any(char.isalpha() for char in password):
            return Response({'error': 'Password must contain at least one alphabet'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not any(char.isupper() for char in password):
            return Response({'error': 'Password must contain at least one uppercase letter'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not any(char.islower() for char in password):
            return Response({'error': 'Password must contain at least one lowercase letter'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not any(char in ['@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '='] for char in password):
            return Response({'error': 'Password must contain at least one special character'},
                            status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(mobile_number=mobile_number).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(mobile_number, password)
        user.first_name = first_name
        user.last_name = last_name
        user.blood_group = blood_group
        # Staff status should only be assigned through admin panel or management commands
        user.save()
        serializer = UserSerializer(user)

        if district is not None and upazila is not None:
            district = Districts.objects.get(id=district)
            upazila = Upazilas.objects.get(id=upazila)
            UserAddress.objects.create(user=user, district=district, upazila=upazila)

        # Log user registration
        # logger.info(f"User {user.mobile_number} registered at {now()}.")
        # UserActionLog.objects.create(user=user, action_type='REGISTER', action_description='User registered', ip_address=get_client_ip(request))

        return Response(serializer.data)


class LoginUser(APIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'mobile_number': openapi.Schema(type=openapi.TYPE_STRING, description='Mobile number of the user'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password of the user'),
            },
            required=['username', 'password'],
        ),
        responses={200: 'Success'},
    )
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        password = request.data.get('password')

        if mobile_number is None:
            return Response({'error': 'Mobile number is required'}, status=status.HTTP_400_BAD_REQUEST)

        if password is None:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        if mobile_number == '' or password == '':
            return Response({'error': 'Fields cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        if not User.objects.filter(mobile_number=mobile_number).exists():
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if not User.objects.get(mobile_number=mobile_number).is_active:
            return Response({'error': 'User is not active'}, status=status.HTTP_401_UNAUTHORIZED)

        if not authenticate(mobile_number=mobile_number, password=password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(mobile_number=mobile_number, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            # User Address
            user_address = UserAddress.objects.filter(user=user).first()
            if user_address is not None:
                user_address = {
                    'district': user_address.district.name,
                    'district_id': user_address.district.id,
                    'upazila': user_address.upazila.name,
                    'upazila_id': user_address.upazila.id,
                }
            return Response({
                'token':
                    {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'token_type': 'Bearer',
                        'expires_in': refresh.access_token.lifetime.total_seconds(),  # seconds
                    },
                'user': UserSerializer(user).data,
                'user_address': user_address

            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


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
        responses={200: 'Success'},
    )
    def post(self, request):
        try:
            # Get the refresh token from the request
            refresh_token = request.data.get('refresh')

            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Decode and revoke the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Log the user logout
            # logger.info(f"User {request.user.mobile_number} logged out.")

            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

        except Exception as e:
            # logger.error(f"Error logging out user: {e}")
            return Response({'error': 'Invalid token or error processing request'}, status=status.HTTP_400_BAD_REQUEST)


class Profile(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={200: 'Success'},
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='First name of the user'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Last name of the user'),
                'blood_group': openapi.Schema(type=openapi.TYPE_STRING, description='Blood group of the user'),
                'district_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='District of the user'),
                'upazila_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Upazila of the user'),

            },
            required=['first_name', 'last_name', 'blood_group', 'district', 'upazila'],
        ),
        responses={200: 'Success'},
    )
    def put(self, request):
        user = request.user
        data = request.data
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.blood_group = data.get('blood_group', user.blood_group)

        district_id = data.get('district_id')
        upazila_id = data.get('upazila_id')

        if district_id is not None and upazila_id is not None:
            district = Districts.objects.get(id=district_id)
            upazila = Upazilas.objects.get(id=upazila_id)
            user_address = UserAddress.objects.filter(user=user).first()
            if user_address is not None:
                user_address.district = district
                user_address.upazila = upazila
                user_address.save()
            else:
                UserAddress.objects.create(user=user, district=district, upazila=upazila)

        user.save()
        serializer = UserSerializer(user)

        # Log user profile update
        # logger.info(f"User {user.mobile_number} updated profile at {now()}.")
        # UserActionLog.objects.create(user=request.user, action_type='UPDATE', action_description='User updated profile', ip_address=get_client_ip(request))
        return Response(serializer.data)


class UserList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_active is False:
            return Response({'error': 'User is not active'}, status=status.HTTP_401_UNAUTHORIZED)

        users = User.objects.all()

        blood_group = request.query_params.get('blood_group')
        district_id = request.query_params.get('district_id')
        upazila_id = request.query_params.get('upazila_id')

        if blood_group:
            users = users.filter(blood_group=blood_group)
        if district_id:
            users = users.filter(address__district_id=district_id)
        if upazila_id:
            users = users.filter(address__upazila_id=upazila_id)

        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class DistrictView(APIView):

    @swagger_auto_schema(
        responses={200: 'Success'},
    )
    def get(self, request):
        districts = Districts.objects.all()
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)


class UpazilaView(APIView):
    @swagger_auto_schema(

        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'district_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the district'),
            },
            required=['district_id'],
        ),
        responses={200: 'Success'},
    )
    def post(self, request):
        district_id = request.data.get('district_id')
        if district_id is None:
            return Response({'error': 'District ID is required'}, status=status.HTTP_400_BAD_REQUEST)

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

        if is_donate_first is None:
            return Response({'error': 'Is donate first is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        if is_donate_first is True:
            user.is_donate_first = True
            user.save()
            return Response({'message': 'User has donated first'}, status=status.HTTP_200_OK)

        if is_donate_first is False:
            user.is_donate_first = False
            user.save()
            return Response({'message': 'User has not donated first'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)


class IsActiveView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Is active'),
            },
            required=['is_active'],
        ),
        responses={200: 'Success'},
    )
    def post(self, request):

        is_active = request.data.get('is_active')

        if is_active is None:
            return Response({'error': 'Is active is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        if is_active is True:
            user.is_donate = True
            user.save()
            return Response({'message': 'User is active'}, status=status.HTTP_200_OK)

        if is_active is False:
            user.is_donate = False
            user.save()
            return Response({'message': 'User is not active'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)


from datetime import datetime  # Correct import for datetime


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class SendResetPasswordOtpView(APIView):

    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        if not mobile_number:
            return Response({'error': 'Mobile number is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not User.objects.filter(mobile_number=mobile_number).exists():
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        otp = str(random.randint(100000, 999999))
        cache.set(f'reset_otp_{mobile_number}', otp, timeout=300)  # 5 min expiry
        # In production send OTP via SMS. For now return in response for testing.
        return Response({'message': 'OTP sent successfully', 'otp': otp}, status=status.HTTP_200_OK)


class VerifyResetPasswordOtpView(APIView):

    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        otp = request.data.get('otp')
        if not mobile_number or not otp:
            return Response({'error': 'Mobile number and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        cached_otp = cache.get(f'reset_otp_{mobile_number}')
        if cached_otp is None:
            return Response({'error': 'OTP expired or not found'}, status=status.HTTP_400_BAD_REQUEST)
        if cached_otp != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Store verified flag so reset-password can proceed
        cache.set(f'otp_verified_{mobile_number}', True, timeout=300)
        cache.delete(f'reset_otp_{mobile_number}')
        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):

    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        new_password = request.data.get('new_password')

        if not mobile_number or not new_password:
            return Response({'error': 'Mobile number and new password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not cache.get(f'otp_verified_{mobile_number}'):
            return Response({'error': 'OTP not verified'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(mobile_number=mobile_number)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        cache.delete(f'otp_verified_{mobile_number}')
        return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)


from datetime import datetime  # kept for DonationView below


class DonationView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'amount': openapi.Schema(type=openapi.TYPE_INTEGER, description='Amount of donation'),
                'date': openapi.Schema(type=openapi.TYPE_STRING, format='date',
                                       description='Date of donation (YYYY-MM-DD)'),
            },
            required=['amount', 'date'],
        ),
        responses={
            201: openapi.Response('Donation created successfully'),
            400: 'Invalid input',
        },
    )
    def post(self, request):
        amount = request.data.get('amount')
        date = request.data.get('date')

        try:
            donation_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format, expected YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if a donation already exists for the same date
            if Donations.objects.filter(user=request.user, donation_date=donation_date).exists():
                return Response({'error': 'Donation already exists for this date'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the last donation and check the 120-day rule
            last_donation = Donations.objects.filter(user=request.user).order_by('-donation_date').first()
            if last_donation:
                last_donation_date = last_donation.donation_date
                if isinstance(last_donation_date, datetime):
                    last_donation_date = last_donation_date.date()

                # Calculate remaining days for next donation
                next_donation_date = last_donation_date + timedelta(days=120)
                remaining_days = (next_donation_date - donation_date).days

                if remaining_days > 0:
                    return Response({
                        'error': 'Donation not allowed within 120 days of the last donation',
                        'next_donation_date': next_donation_date.strftime('%Y-%m-%d'),
                        'remaining_days': remaining_days,
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Create the donation
            Donations.objects.create(user=request.user, amount=amount, donation_date=donation_date)

        except Exception as e:
            return Response({'error': 'Failed to create donation', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Donation added successfully'}, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        responses={200: 'Success'},
    )
    def get(self, request):
        donations = Donations.objects.filter(user=request.user)
        serializer = DonationsSerializer(donations, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'donation_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the donation'),
            },
            required=['donation_id'],
        ),
        responses={200: 'Success'},
    )
    def delete(self, request):
        donation_id = request.data.get('donation_id')

        if donation_id is None:
            return Response({'error': 'Donation ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            donation = Donations.objects.get(id=donation_id)
            donation.delete()
        except Donations.DoesNotExist:
            return Response({'error': 'Donation not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'Donation deleted successfully'}, status=status.HTTP_200_OK)
