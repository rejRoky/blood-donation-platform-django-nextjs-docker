"""
Custom validators for the users app.
"""

import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class MobileNumberValidator:
    """
    Validates Bangladesh mobile numbers.
    Format: 11 digits starting with 01
    """
    message = _('Enter a valid Bangladesh mobile number (11 digits starting with 01).')
    code = 'invalid_mobile_number'

    def __call__(self, value):
        if not value:
            raise ValidationError(self.message, code=self.code)

        # Remove any whitespace
        value = str(value).strip()

        # Check if it's 11 digits
        if len(value) != 11:
            raise ValidationError(self.message, code=self.code)

        # Check if it starts with 01
        if not value.startswith('01'):
            raise ValidationError(self.message, code=self.code)

        # Check if all characters are digits
        if not value.isdigit():
            raise ValidationError(self.message, code=self.code)


class PasswordStrengthValidator:
    """
    Validates password strength requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """

    def __init__(self):
        self.special_characters = ['@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=']

    def __call__(self, value):
        if not value:
            raise ValidationError(
                _('Password is required.'),
                code='password_required'
            )

        if len(value) < 8:
            raise ValidationError(
                _('Password must be at least 8 characters long.'),
                code='password_too_short'
            )

        if not any(char.isdigit() for char in value):
            raise ValidationError(
                _('Password must contain at least one digit.'),
                code='password_no_digit'
            )

        if not any(char.isupper() for char in value):
            raise ValidationError(
                _('Password must contain at least one uppercase letter.'),
                code='password_no_upper'
            )

        if not any(char.islower() for char in value):
            raise ValidationError(
                _('Password must contain at least one lowercase letter.'),
                code='password_no_lower'
            )

        if not any(char in self.special_characters for char in value):
            raise ValidationError(
                _(f'Password must contain at least one special character: {", ".join(self.special_characters)}'),
                code='password_no_special'
            )


class BloodGroupValidator:
    """
    Validates blood group values.
    Valid blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-
    """
    VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

    message = _('Enter a valid blood group. Valid options are: %(blood_groups)s')
    code = 'invalid_blood_group'

    def __call__(self, value):
        if not value:
            return  # Allow empty values (optional field)

        if value not in self.VALID_BLOOD_GROUPS:
            raise ValidationError(
                self.message % {'blood_groups': ', '.join(self.VALID_BLOOD_GROUPS)},
                code=self.code
            )


def validate_mobile_number(value):
    """
    Function-based validator for mobile numbers.
    """
    validator = MobileNumberValidator()
    validator(value)


def validate_password_strength(value):
    """
    Function-based validator for password strength.
    """
    validator = PasswordStrengthValidator()
    validator(value)


def validate_blood_group(value):
    """
    Function-based validator for blood groups.
    """
    validator = BloodGroupValidator()
    validator(value)
