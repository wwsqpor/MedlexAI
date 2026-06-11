from django.contrib import admin
from .models import Case, Category, CaseCategory, UserCase


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'description']
    search_fields = ['name']


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display   = ['title', 'difficulty_level', 'score', 'created_at']
    list_filter    = ['difficulty_level']
    search_fields  = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CaseCategory)
class CaseCategoryAdmin(admin.ModelAdmin):
    list_display  = ['case', 'category']
    list_filter   = ['category']
    search_fields = ['case__title', 'category__name']


@admin.register(UserCase)
class UserCaseAdmin(admin.ModelAdmin):
    list_display  = ['user', 'case', 'score', 'completed_at']
    list_filter   = ['case']
    search_fields = ['user__email', 'case__title']
    readonly_fields = ['completed_at']