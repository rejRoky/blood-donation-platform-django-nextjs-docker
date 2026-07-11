from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from import_export.admin import ImportExportModelAdmin

from .models import User, UserActionLog, Districts, Upazilas, UserAddress, Donations

admin.site.site_header = 'Blood Donation Administration'
admin.site.site_title = 'Blood Donation Admin'
admin.site.index_title = 'Dashboard'


class AdminUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('mobile_number',)


class AdminUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = '__all__'


class UserAddressInline(admin.StackedInline):
    model = UserAddress
    extra = 0
    max_num = 1
    autocomplete_fields = ('district', 'upazila')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin for the custom mobile-number user model. Uses the auth admin's
    hashed-password handling — the default ModelAdmin would display the raw
    hash and save plaintext passwords for users added through the admin.
    """
    form = AdminUserChangeForm
    add_form = AdminUserCreationForm

    list_display = ('mobile_number', 'first_name', 'last_name', 'blood_group',
                    'role', 'is_donate', 'is_active', 'is_staff', 'created_at')
    list_filter = ('blood_group', 'role', 'is_active', 'is_donate', 'is_staff')
    search_fields = ('mobile_number', 'first_name', 'last_name', 'email')
    ordering = ('-created_at',)
    readonly_fields = ('last_login', 'created_at', 'updated_at')
    inlines = (UserAddressInline,)

    fieldsets = (
        (None, {'fields': ('mobile_number', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email',
                                      'profile_picture', 'blood_group')}),
        ('Donor status', {'fields': ('is_donate', 'is_donate_first', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                    'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('mobile_number', 'password1', 'password2'),
        }),
    )


@admin.register(UserActionLog)
class UserActionLogAdmin(admin.ModelAdmin):
    """Read-only audit trail — entries are created by the application."""
    list_display = ('user', 'action_type', 'timestamp', 'ip_address')
    search_fields = ('user__mobile_number', 'action_type', 'action_description')
    list_filter = ('action_type', 'timestamp')
    date_hierarchy = 'timestamp'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'district', 'upazila')
    search_fields = ('user__mobile_number', 'district__name', 'upazila__name')
    list_filter = ('district',)
    autocomplete_fields = ('user', 'district', 'upazila')


@admin.register(Districts)
class DistrictsAdmin(ImportExportModelAdmin):
    list_display = ('id', 'name', 'bn_name')
    search_fields = ('name', 'bn_name')
    ordering = ('name',)


@admin.register(Upazilas)
class UpazilasAdmin(ImportExportModelAdmin):
    list_display = ('id', 'name', 'bn_name', 'district_id')
    search_fields = ('name', 'bn_name')
    list_filter = ('district_id',)
    ordering = ('name',)


@admin.register(Donations)
class DonationsAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'donation_date', 'created_at')
    search_fields = ('user__mobile_number', 'user__first_name', 'user__last_name')
    list_filter = ('donation_date',)
    date_hierarchy = 'donation_date'
    autocomplete_fields = ('user',)
