from django.contrib.auth.backends import ModelBackend

from .models import User


class MobileNumberBackend(ModelBackend):
    """Authenticate with mobile_number + password."""

    def authenticate(self, request, mobile_number=None, password=None, **kwargs):
        if mobile_number is None:
            mobile_number = kwargs.get('username')
        if mobile_number is None or password is None:
            return None
        try:
            user = User.objects.get(mobile_number=mobile_number)
        except User.DoesNotExist:
            # Run the password hasher anyway so a missing account takes the
            # same time as a wrong password (timing-based enumeration).
            User().set_password(password)
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
