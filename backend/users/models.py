import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, mobile_number, password=None, **extra_fields):
        if not mobile_number:
            raise ValueError('The Mobile Number field must be set')
        user = self.model(mobile_number=mobile_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(mobile_number, password, **extra_fields)


Roles = (
    ('Admin', 'Admin'),
    ('Manager', 'Manager'),
    ('Donar', 'Donar'),

)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    mobile_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    blood_group = models.CharField(max_length=10, blank=True, null=True)

    # donation related fields
    is_donate_first = models.BooleanField(default=False)
    is_donate = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    address = models.ForeignKey('UserAddress', on_delete=models.CASCADE, blank=True, null=True, related_name='user_address')


    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=10, choices=Roles, default='Donar', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False, null=True, blank=True)
    objects = UserManager()

    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'{self.mobile_number} - {self.first_name} {self.last_name}'


class UserActionLog(models.Model):
    ACTION_TYPES = (
        ('LOGIN', 'Login'),
        ('REGISTER', 'Register'),
        ('UPDATE', 'Profile Update'),
        ('LOGOUT', 'Logout'),
        ('REQUEST', 'Request'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=200, null=True, blank=True)
    action_description = models.TextField(null=True, blank=True)
    ip_address = models.CharField(max_length=45, null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.user.mobile_number} - {self.action_type} - {self.timestamp}'

class UserAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    district = models.ForeignKey('Districts', on_delete=models.CASCADE, blank=True, null=True, related_name='district')
    upazila = models.ForeignKey('Upazilas', on_delete=models.CASCADE, blank=True, null=True, related_name='upazila')

    created_at = models.DateTimeField(auto_now_add=True, editable=False, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False, null=True, blank=True)

    def __str__(self):
        return f'{self.user.mobile_number} - {self.address}'

class Districts(models.Model):
    id = models.IntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    bn_name = models.CharField(max_length=50, null=True, blank=True)
    lat = models.CharField(max_length=50, null=True, blank=True)
    lon = models.CharField(max_length=50, null=True, blank=True)
    url = models.CharField(max_length=50, null=True, blank=True)


    def __str__(self):
        return self.name


class Upazilas(models.Model):
    id = models.IntegerField(unique=True, primary_key=True)
    district_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    bn_name = models.CharField(max_length=50, null=True, blank=True)
    url = models.CharField(max_length=50, null=True, blank=True)


    def __str__(self):
        return self.name

class Donations(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    donation_date = models.DateTimeField(null=True, blank=True)
    amount = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'donation_date']),
            models.Index(fields=['donation_date']),
        ]
        ordering = ['-donation_date']


    def __str__(self):
        return f'{self.user.mobile_number} - {self.amount} - {self.donation_date}'