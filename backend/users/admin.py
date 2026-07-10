from django.contrib import admin
from .models import User, UserActionLog, Districts, Upazilas, UserAddress, Donations
from import_export.admin import ImportExportModelAdmin


admin.site.register(User)

class UserActionLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action_type', 'timestamp', 'ip_address']
    search_fields = ['user__mobile_number', 'action_type', 'action_description']
    list_filter = ['action_type', 'timestamp']

admin.site.register(UserActionLog, UserActionLogAdmin)

class UserAddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'district', 'upazila']
    search_fields = ['user__mobile_number', 'district', 'upazila']
    list_filter = ['district', 'upazila']

admin.site.register(UserAddress, UserAddressAdmin)

class DistrictsAdmin(ImportExportModelAdmin):
    list_display = ['name', 'bn_name']
    search_fields = ['name', 'bn_name']
    list_filter = ['name']

admin.site.register(Districts, DistrictsAdmin)

class UpazilasAdmin(ImportExportModelAdmin):
    list_display = ['name', 'bn_name']
    search_fields = ['name', 'bn_name']
    list_filter = ['name']

admin.site.register(Upazilas, UpazilasAdmin)


class DonationsAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount','donation_date']
    search_fields = ['user__mobile_number', 'amount']
    list_filter = ['donation_date']

admin.site.register(Donations, DonationsAdmin)