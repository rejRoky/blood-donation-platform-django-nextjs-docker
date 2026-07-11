"""
Serializers for the users app with comprehensive validation.
"""

from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import User, Districts, Upazilas, Donations, UserAddress
from .validators import validate_mobile_number, validate_password_strength, validate_blood_group


class UserAddressSerializer(serializers.ModelSerializer):
    """Serializer for user address information."""
    district_name = serializers.CharField(source='district.name', read_only=True)
    upazila_name = serializers.CharField(source='upazila.name', read_only=True)

    class Meta:
        model = UserAddress
        fields = ('district', 'upazila', 'district_name', 'upazila_name')


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model with validation.
    """
    address_detail = UserAddressSerializer(source='address', read_only=True)
    district_id = serializers.SerializerMethodField()
    upazila_id = serializers.SerializerMethodField()
    mobile_number = serializers.CharField(
        max_length=11,
        validators=[validate_mobile_number]
    )
    blood_group = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[validate_blood_group]
    )

    class Meta:
        model = User
        fields = (
            'id',
            'mobile_number',
            'first_name',
            'last_name',
            'email',
            'profile_picture',
            'blood_group',
            'is_donate_first',
            'is_donate',
            'role',
            'address',
            'address_detail',
            'district_id',
            'upazila_id',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'is_donate_first', 'is_donate', 'role', 'address', 'created_at', 'updated_at')

    def get_district_id(self, obj):
        return obj.address.district_id if obj.address else None

    def get_upazila_id(self, obj):
        return obj.address.upazila_id if obj.address else None

    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            user_id = self.instance.id if self.instance else None
            if User.objects.filter(email=value).exclude(id=user_id).exists():
                raise serializers.ValidationError("This email is already in use.")
        return value


class DonorListSerializer(UserSerializer):
    """
    Donor directory entry: everything a donor card needs in one payload —
    location names (English + Bangla), donation count and last donation date
    (annotated on the queryset), and availability flags.
    """
    district_name = serializers.SerializerMethodField()
    upazila_name = serializers.SerializerMethodField()
    bn_district = serializers.SerializerMethodField()
    bn_upazila = serializers.SerializerMethodField()
    donation_count = serializers.IntegerField(read_only=True, default=0)
    last_donation_date = serializers.DateField(read_only=True, default=None)
    is_active = serializers.BooleanField(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + (
            'district_name',
            'upazila_name',
            'bn_district',
            'bn_upazila',
            'donation_count',
            'last_donation_date',
            'is_active',
        )

    def get_district_name(self, obj):
        return obj.address.district.name if obj.address and obj.address.district else None

    def get_upazila_name(self, obj):
        return obj.address.upazila.name if obj.address and obj.address.upazila else None

    def get_bn_district(self, obj):
        return obj.address.district.bn_name if obj.address and obj.address.district else None

    def get_bn_upazila(self, obj):
        return obj.address.upazila.bn_name if obj.address and obj.address.upazila else None


class DistrictUpazilaValidationMixin:
    """Shared district/upazila pair validation."""

    @staticmethod
    def validate_area(district_id, upazila_id):
        if (district_id is None) != (upazila_id is None):
            raise serializers.ValidationError(
                {"district": "Both district and upazila must be provided together."}
            )
        if district_id is not None:
            if not Districts.objects.filter(id=district_id).exists():
                raise serializers.ValidationError({"district": "Invalid district ID."})
            if not Upazilas.objects.filter(id=upazila_id, district_id=district_id).exists():
                raise serializers.ValidationError(
                    {"upazila": "Invalid upazila ID or upazila does not belong to the selected district."}
                )


class UserRegistrationSerializer(DistrictUpazilaValidationMixin, serializers.Serializer):
    """
    Serializer for user registration with password validation.

    Role is intentionally NOT accepted from the client: every self-registered
    account is a donor. Staff roles are assigned via the admin panel.
    """
    mobile_number = serializers.CharField(
        max_length=11,
        validators=[validate_mobile_number]
    )
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password_strength],
        style={'input_type': 'password'}
    )
    first_name = serializers.CharField(max_length=50, required=True)
    last_name = serializers.CharField(max_length=50, required=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    blood_group = serializers.CharField(
        required=True,
        validators=[validate_blood_group]
    )
    district = serializers.IntegerField(required=False, allow_null=True)
    upazila = serializers.IntegerField(required=False, allow_null=True)

    def validate_mobile_number(self, value):
        """Check if mobile number already exists."""
        if User.objects.filter(mobile_number=value).exists():
            raise serializers.ValidationError("This mobile number is already registered.")
        return value

    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate(self, data):
        self.validate_area(data.get('district'), data.get('upazila'))
        return data

    @transaction.atomic
    def create(self, validated_data):
        district_id = validated_data.pop('district', None)
        upazila_id = validated_data.pop('upazila', None)
        password = validated_data.pop('password')
        email = validated_data.pop('email', None) or None

        user = User.objects.create_user(
            validated_data.pop('mobile_number'),
            password,
            email=email,
            **validated_data,
        )

        if district_id is not None:
            address = UserAddress.objects.create(
                user=user,
                district_id=district_id,
                upazila_id=upazila_id,
            )
            user.address = address
            user.save(update_fields=['address'])

        return user


class ProfileUpdateSerializer(DistrictUpazilaValidationMixin, serializers.Serializer):
    """Serializer for authenticated profile updates."""
    first_name = serializers.CharField(max_length=50, required=False)
    last_name = serializers.CharField(max_length=50, required=False)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    blood_group = serializers.CharField(required=False, validators=[validate_blood_group])
    district_id = serializers.IntegerField(required=False, allow_null=True)
    upazila_id = serializers.IntegerField(required=False, allow_null=True)

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exclude(id=self.context['request'].user.id).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate(self, data):
        if 'district_id' in data or 'upazila_id' in data:
            self.validate_area(data.get('district_id'), data.get('upazila_id'))
        return data

    @transaction.atomic
    def update(self, user, validated_data):
        district_id = validated_data.pop('district_id', None)
        upazila_id = validated_data.pop('upazila_id', None)

        for field in ('first_name', 'last_name', 'blood_group'):
            if field in validated_data:
                setattr(user, field, validated_data[field])
        if 'email' in validated_data:
            user.email = validated_data['email'] or None

        if district_id is not None:
            address = UserAddress.objects.filter(user=user).first()
            if address is not None:
                address.district_id = district_id
                address.upazila_id = upazila_id
                address.save(update_fields=['district_id', 'upazila_id', 'updated_at'])
            else:
                address = UserAddress.objects.create(
                    user=user, district_id=district_id, upazila_id=upazila_id
                )
            user.address = address

        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    mobile_number = serializers.CharField(max_length=11)
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )


class SendResetOtpSerializer(serializers.Serializer):
    """Request an OTP for password reset."""
    mobile_number = serializers.CharField(max_length=11, validators=[validate_mobile_number])


class VerifyResetOtpSerializer(serializers.Serializer):
    """Verify a password-reset OTP."""
    mobile_number = serializers.CharField(max_length=11, validators=[validate_mobile_number])
    otp = serializers.CharField(max_length=10)


class ResetPasswordSerializer(serializers.Serializer):
    """Set a new password using the token obtained from OTP verification."""
    mobile_number = serializers.CharField(max_length=11, validators=[validate_mobile_number])
    reset_token = serializers.CharField(max_length=128)
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password_strength],
        style={'input_type': 'password'},
    )


class DistrictSerializer(serializers.ModelSerializer):
    """Serializer for Districts."""
    class Meta:
        model = Districts
        fields = ('id', 'name', 'bn_name', 'lat', 'lon', 'url')
        read_only_fields = ('id',)


class UpazilaSerializer(serializers.ModelSerializer):
    """Serializer for Upazilas."""

    class Meta:
        model = Upazilas
        fields = ('id', 'district_id', 'name', 'bn_name', 'url')
        read_only_fields = ('id',)


class DonationsSerializer(serializers.ModelSerializer):
    """
    Serializer for Donations with validation of the donation interval rules.
    """
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_mobile = serializers.CharField(source='user.mobile_number', read_only=True)
    date = serializers.DateField(source='donation_date', required=True)

    class Meta:
        model = Donations
        fields = (
            'id',
            'user',
            'user_name',
            'user_mobile',
            'donation_date',
            'date',
            'amount',
            'note',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'user', 'donation_date', 'created_at', 'updated_at')

    def validate_date(self, value):
        """Validate that donation date is not in the future."""
        if value > timezone.localdate():
            raise serializers.ValidationError("Donation date cannot be in the future.")
        return value

    def validate_amount(self, value):
        """Validate donation amount (in ml, typical range 250-500ml)."""
        if value is None:
            return value
        if value < 100:
            raise serializers.ValidationError("Donation amount must be at least 100ml.")
        if value > 1000:
            raise serializers.ValidationError("Donation amount cannot exceed 1000ml.")
        return value

    def validate(self, data):
        """
        Validate the 120-day interval between donations.
        """
        user = self.context['request'].user
        donation_date = data.get('donation_date')

        # Check for donations on the same date
        if Donations.objects.filter(user=user, donation_date=donation_date).exists():
            raise serializers.ValidationError({
                'date': 'You have already recorded a donation on this date.'
            })

        # Check 120-day interval against the most recent prior donation
        last_donation = (
            Donations.objects
            .filter(user=user, donation_date__lt=donation_date)
            .order_by('-donation_date')
            .first()
        )
        if last_donation:
            next_donation_date = last_donation.donation_date + timedelta(days=120)
            remaining_days = (next_donation_date - donation_date).days
            if remaining_days > 0:
                raise serializers.ValidationError({
                    'date': (
                        f'Donation not allowed within 120 days of the last donation. '
                        f'Next donation allowed on {next_donation_date.strftime("%Y-%m-%d")} '
                        f'({remaining_days} days remaining).'
                    )
                })

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
