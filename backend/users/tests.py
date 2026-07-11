"""
API tests for the users app: registration, login, profile, donor directory,
OTP password reset, and donation rules — including the security regressions
(OTP leakage, donation IDOR, login enumeration, role escalation).
"""

from datetime import timedelta

from django.core.cache import cache
from django.test import override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User, Districts, Upazilas, UserAddress, Donations

PASSWORD = 'Str0ng@Pass'


def make_user(mobile='01711111111', password=PASSWORD, **extra):
    return User.objects.create_user(mobile, password, **extra)


class BaseTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.district = Districts.objects.create(id=1, name='Dhaka', bn_name='ঢাকা')
        cls.upazila = Upazilas.objects.create(id=10, district_id=1, name='Savar', bn_name='সাভার')
        cls.other_district = Districts.objects.create(id=2, name='Chattogram', bn_name='চট্টগ্রাম')
        cls.other_upazila = Upazilas.objects.create(id=20, district_id=2, name='Patiya', bn_name='পটিয়া')

    def setUp(self):
        cache.clear()

    def login(self, mobile='01711111111', password=PASSWORD):
        response = self.client.post('/api/users/login/', {'mobile_number': mobile, 'password': password})
        assert response.status_code == 200, response.data
        token = response.data['token']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return response


class RegistrationTests(BaseTestCase):
    payload = {
        'mobile_number': '01722222222',
        'password': PASSWORD,
        'first_name': 'Rahim',
        'last_name': 'Uddin',
        'blood_group': 'O+',
        'district': 1,
        'upazila': 10,
    }

    def test_register_success_links_address(self):
        response = self.client.post('/api/users/register/', self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(mobile_number='01722222222')
        self.assertIsNotNone(user.address)
        self.assertEqual(user.address.district_id, 1)
        self.assertEqual(user.address.upazila_id, 10)
        self.assertEqual(response.data['blood_group'], 'O+')

    def test_register_versioned_mount(self):
        response = self.client.post('/api/v1/users/register/', self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_rejects_role_escalation(self):
        response = self.client.post('/api/users/register/', {**self.payload, 'role': 'Admin'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(mobile_number='01722222222')
        self.assertEqual(user.role, 'Donar')
        self.assertFalse(user.is_staff)

    def test_register_duplicate_mobile(self):
        make_user('01722222222')
        response = self.client.post('/api/users/register/', self.payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('mobile_number', response.data['errors'])

    def test_register_weak_password(self):
        response = self.client.post('/api/users/register/', {**self.payload, 'password': 'weakpass'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['errors'])

    def test_register_upazila_must_match_district(self):
        response = self.client.post('/api/users/register/', {**self.payload, 'upazila': 20})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_invalid_mobile(self):
        response = self.client.post('/api/users/register/', {**self.payload, 'mobile_number': '12345'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('mobile_number', response.data['errors'])


class LoginTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = make_user(first_name='Karim', blood_group='A+')
        address = UserAddress.objects.create(user=self.user, district=self.district, upazila=self.upazila)
        self.user.address = address
        self.user.save(update_fields=['address'])

    def test_login_success_returns_tokens_and_address(self):
        response = self.client.post('/api/users/login/', {'mobile_number': '01711111111', 'password': PASSWORD})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data['token'])
        self.assertIn('refresh', response.data['token'])
        self.assertEqual(response.data['user']['mobile_number'], '01711111111')
        self.assertEqual(response.data['user_address']['district_id'], 1)

    def test_login_wrong_password_is_generic(self):
        response = self.client.post('/api/users/login/', {'mobile_number': '01711111111', 'password': 'Wrong@123'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['message'], 'Invalid mobile number or password.')

    def test_login_unknown_and_inactive_user_same_response(self):
        unknown = self.client.post('/api/users/login/', {'mobile_number': '01799999999', 'password': PASSWORD})
        self.user.is_active = False
        self.user.save(update_fields=['is_active'])
        inactive = self.client.post('/api/users/login/', {'mobile_number': '01711111111', 'password': PASSWORD})
        self.assertEqual(unknown.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(inactive.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(unknown.data['message'], inactive.data['message'])

    def test_logout_blacklists_refresh_token(self):
        login = self.login()
        refresh = login.data['token']['refresh']
        response = self.client.post('/api/users/logout/', {'refresh': refresh})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Re-using the blacklisted refresh token must fail
        refresh_response = self.client.post('/api/users/token/refresh/', {'refresh': refresh})
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_error_envelope(self):
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['message'], 'Unauthenticated.')


class ProfileTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = make_user()
        self.login()

    def test_get_profile(self):
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['mobile_number'], '01711111111')

    def test_update_profile_creates_address(self):
        response = self.client.put('/api/users/profile/', {
            'first_name': 'New',
            'blood_group': 'B+',
            'district_id': 1,
            'upazila_id': 10,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'New')
        self.assertEqual(response.data['district_id'], 1)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.address)

    def test_update_profile_invalid_area_pair(self):
        response = self.client.put('/api/users/profile/', {'district_id': 1, 'upazila_id': 20})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DonorDirectoryTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = make_user()
        self.login()

        donor = make_user('01733333333', first_name='Donor', blood_group='O-')
        address = UserAddress.objects.create(user=donor, district=self.district, upazila=self.upazila)
        donor.address = address
        donor.save(update_fields=['address'])
        Donations.objects.create(user=donor, donation_date=timezone.localdate(), amount=450)

        make_user('01744444444', blood_group='O-', is_staff=True)

    def test_directory_excludes_staff(self):
        response = self.client.get('/api/users/?blood_group=O-')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mobiles = [u['mobile_number'] for u in response.data['results']]
        self.assertIn('01733333333', mobiles)
        self.assertNotIn('01744444444', mobiles)

    def test_directory_filters_by_district_and_annotates(self):
        response = self.client.get('/api/users/?district_id=1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        donor = response.data['results'][0]
        self.assertEqual(donor['donation_count'], 1)
        self.assertEqual(donor['bn_district'], 'ঢাকা')
        self.assertEqual(donor['district_id'], 1)

    def test_directory_requires_auth(self):
        self.client.credentials()
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AreaTests(BaseTestCase):
    def test_districts_public(self):
        response = self.client.get('/api/area/district/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_upazila_get_by_query_param(self):
        response = self.client.get('/api/area/upazila/?district_id=1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['name'], 'Savar')

    def test_upazila_legacy_post(self):
        response = self.client.post('/api/area/upazila/', {'district_id': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], 10)


class PasswordResetTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = make_user()

    def _send_otp(self):
        return self.client.post('/api/users/send-reset-password-otp/', {'mobile_number': '01711111111'})

    def test_send_otp_generic_response_for_unknown_number(self):
        known = self._send_otp()
        unknown = self.client.post('/api/users/send-reset-password-otp/', {'mobile_number': '01798765432'})
        self.assertEqual(known.status_code, status.HTTP_200_OK)
        self.assertEqual(unknown.status_code, status.HTTP_200_OK)
        self.assertEqual(known.data['message'], unknown.data['message'])

    @override_settings(OTP_DEBUG_EXPOSE=False)
    def test_otp_never_leaked_in_response(self):
        response = self._send_otp()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('otp', response.data)

    def test_full_reset_flow(self):
        otp = self._send_otp().data['otp']  # OTP_DEBUG_EXPOSE=True in test settings

        verify = self.client.post('/api/users/verify-reset-password-otp/', {
            'mobile_number': '01711111111', 'otp': otp,
        })
        self.assertEqual(verify.status_code, status.HTTP_200_OK)
        reset_token = verify.data['reset_token']

        reset = self.client.post('/api/users/reset-password/', {
            'mobile_number': '01711111111',
            'reset_token': reset_token,
            'new_password': 'N3w@Password',
        })
        self.assertEqual(reset.status_code, status.HTTP_200_OK)

        login = self.client.post('/api/users/login/', {
            'mobile_number': '01711111111', 'password': 'N3w@Password',
        })
        self.assertEqual(login.status_code, status.HTTP_200_OK)

    def test_reset_requires_valid_token(self):
        self._send_otp()
        response = self.client.post('/api/users/reset-password/', {
            'mobile_number': '01711111111',
            'reset_token': 'forged-token',
            'new_password': 'N3w@Password',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_otp_attempt_limit(self):
        otp = self._send_otp().data['otp']
        for _ in range(5):
            self.client.post('/api/users/verify-reset-password-otp/', {
                'mobile_number': '01711111111', 'otp': '000000',
            })
        # Correct OTP no longer works — invalidated after max attempts
        response = self.client.post('/api/users/verify-reset-password-otp/', {
            'mobile_number': '01711111111', 'otp': otp,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_token_is_single_use(self):
        otp = self._send_otp().data['otp']
        verify = self.client.post('/api/users/verify-reset-password-otp/', {
            'mobile_number': '01711111111', 'otp': otp,
        })
        reset_token = verify.data['reset_token']
        first = self.client.post('/api/users/reset-password/', {
            'mobile_number': '01711111111', 'reset_token': reset_token, 'new_password': 'N3w@Password',
        })
        second = self.client.post('/api/users/reset-password/', {
            'mobile_number': '01711111111', 'reset_token': reset_token, 'new_password': 'Other@Pass1',
        })
        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)


class DonationTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = make_user()
        self.login()

    def test_create_and_list_donation(self):
        today = timezone.localdate().isoformat()
        response = self.client.post('/api/users/donate/', {'amount': 450, 'date': today, 'note': 'City hospital'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        listing = self.client.get('/api/users/donate/')
        self.assertEqual(listing.status_code, status.HTTP_200_OK)
        self.assertEqual(len(listing.data), 1)
        self.assertEqual(listing.data[0]['amount'], 450)
        self.assertEqual(listing.data[0]['note'], 'City hospital')

    def test_future_date_rejected(self):
        future = (timezone.localdate() + timedelta(days=1)).isoformat()
        response = self.client.post('/api/users/donate/', {'amount': 450, 'date': future})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_amount_bounds(self):
        today = timezone.localdate().isoformat()
        low = self.client.post('/api/users/donate/', {'amount': 50, 'date': today})
        high = self.client.post('/api/users/donate/', {'amount': 5000, 'date': today})
        self.assertEqual(low.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(high.status_code, status.HTTP_400_BAD_REQUEST)

    def test_120_day_rule(self):
        recent = timezone.localdate() - timedelta(days=30)
        Donations.objects.create(user=self.user, donation_date=recent, amount=450)
        response = self.client.post('/api/users/donate/', {
            'amount': 450, 'date': timezone.localdate().isoformat(),
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        old = timezone.localdate() - timedelta(days=200)
        Donations.objects.all().delete()
        Donations.objects.create(user=self.user, donation_date=old, amount=450)
        response = self.client.post('/api/users/donate/', {
            'amount': 450, 'date': timezone.localdate().isoformat(),
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_duplicate_date_rejected(self):
        today = timezone.localdate()
        Donations.objects.create(user=self.user, donation_date=today, amount=450)
        response = self.client.post('/api/users/donate/', {'amount': 450, 'date': today.isoformat()})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_delete_another_users_donation(self):
        other = make_user('01755555555')
        donation = Donations.objects.create(user=other, donation_date=timezone.localdate(), amount=450)
        response = self.client.delete('/api/users/donate/', {'donation_id': donation.id})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Donations.objects.filter(id=donation.id).exists())

    def test_delete_own_donation(self):
        donation = Donations.objects.create(user=self.user, donation_date=timezone.localdate(), amount=450)
        response = self.client.delete('/api/users/donate/', {'donation_id': donation.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Donations.objects.filter(id=donation.id).exists())


class HealthTests(BaseTestCase):
    def test_liveness(self):
        response = self.client.get('/health/live/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_status_hides_versions_from_anonymous(self):
        response = self.client.get('/health/status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('python_version', response.json())
