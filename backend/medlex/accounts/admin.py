from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ['email', 'name', 'surname', 'organization', 'specialization', 'is_staff']
    list_filter    = ['is_staff', 'is_active', 'specialization']
    search_fields  = ['email', 'name', 'surname', 'organization']
    ordering       = ['email']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Учётные данные',  {'fields': ('email', 'password')}),
        ('Личные данные',   {'fields': ('name', 'surname', 'phone_number')}),
        ('Работа',          {'fields': ('organization', 'specialization')}),
        ('Права доступа',   {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Даты',            {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields':  ('email', 'name', 'surname', 'organization', 'specialization', 'password1', 'password2'),
        }),
    )