"""
Serializers for the users app with comprehensive validation.
"""

from rest_framework import serializers
from .models import User, Districts, Upazilas, Donations, UserAddress
from .validators import validate_mobile_number, validate_password_strength, validate_blood_group
from datetime import timedelta, date


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
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'is_donate_first', 'is_donate', 'created_at', 'updated_at')

    def validate_email(self, value):
        """Validate email uniqueness if provided."""
        if value:
            user_id = self.instance.id if self.instance else None
            if User.objects.filter(email=value).exclude(id=user_id).exists():
                raise serializers.ValidationError("This email is already in use.")
        return value


class UserRegistrationSerializer(serializers.Serializer):
    """
    Serializer for user registration with password validation.
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
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    blood_group = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[validate_blood_group]
    )
    district = serializers.IntegerField(required=False, allow_null=True)
    upazila = serializers.IntegerField(required=False, allow_null=True)
    role = serializers.ChoiceField(
        choices=['Admin', 'Manager', 'Donar'],
        default='Donar'
    )

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
        """Validate district and upazila together."""
        district = data.get('district')
        upazila = data.get('upazila')

        # Both must be provided together or both must be None
        if (district is not None and upazila is None) or (district is None and upazila is not None):
            raise serializers.ValidationError("Both district and upazila must be provided together.")

        # Validate district exists
        if district is not None:
            if not Districts.objects.filter(id=district).exists():
                raise serializers.ValidationError({"district": "Invalid district ID."})

        # Validate upazila exists and belongs to district
        if upazila is not None:
            if not Upazilas.objects.filter(id=upazila, district_id=district).exists():
                raise serializers.ValidationError({"upazila": "Invalid upazila ID or upazila does not belong to the selected district."})

        return data


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    mobile_number = serializers.CharField(
        max_length=11,
        validators=[validate_mobile_number]
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )


class DistrictSerializer(serializers.ModelSerializer):
    """Serializer for Districts."""
    class Meta:
        model = Districts
        fields = ('id', 'name', 'bn_name', 'lat', 'lon', 'url')
        read_only_fields = ('id',)


class UpazilaSerializer(serializers.ModelSerializer):
    """Serializer for Upazilas."""
    district_name = serializers.CharField(source='district.name', read_only=True)

    class Meta:
        model = Upazilas
        fields = ('id', 'district', 'district_name', 'name', 'bn_name', 'url')
        read_only_fields = ('id',)


class DonationsSerializer(serializers.ModelSerializer):
    """
    Serializer for Donations with validation.
    """
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_mobile = serializers.CharField(source='user.mobile_number', read_only=True)

    class Meta:
        model = Donations
        fields = (
            'id',
            'user',
            'user_name',
            'user_mobile',
            'donation_date',
            'amount',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def validate_donation_date(self, value):
        """Validate that donation date is not in the future."""
        if value > date.today():
            raise serializers.ValidationError("Donation date cannot be in the future.")
        return value

    def validate_amount(self, value):
        """Validate donation amount (in ml, typical range 250-500ml)."""
        if value < 100:
            raise serializers.ValidationError("Donation amount must be at least 100ml.")
        if value > 1000:
            raise serializers.ValidationError("Donation amount cannot exceed 1000ml.")
        return value

    def validate(self, data):
        """
        Validate 120-day interval between donations.
        """
        user = self.context['request'].user
        donation_date = data.get('donation_date', date.today())

        # Check for donations on the same date
        if Donations.objects.filter(user=user, donation_date=donation_date).exists():
            raise serializers.ValidationError({
                'donation_date': 'You have already recorded a donation on this date.'
            })

        # Check 120-day interval
        last_donation = Donations.objects.filter(user=user).order_by('-donation_date').first()
        if last_donation:
            days_since_last = (donation_date - last_donation.donation_date).days
            if days_since_last < 120:
                next_donation_date = last_donation.donation_date + timedelta(days=120)
                remaining_days = (next_donation_date - donation_date).days
                raise serializers.ValidationError({
                    'donation_date': f'Donation not allowed within 120 days. Next donation allowed on {next_donation_date.strftime("%Y-%m-%d")}. {remaining_days} days remaining.'
                })

        return data
