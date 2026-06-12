from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    Category,
    Case,
    LawReference,
    CaseTask,
    TaskOption,
    CaseAttempt,
    TaskAnswer,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


class CaseTaskInline(admin.TabularInline):
    model = CaseTask
    extra = 1


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty', 'created_at']
    list_filter = ['difficulty', 'category']
    search_fields = ['title', 'short_description', 'full_description']
    readonly_fields = ['created_at']
    inlines = [CaseTaskInline]


@admin.register(LawReference)
class LawReferenceAdmin(admin.ModelAdmin):
    list_display = ['title', 'article_number', 'created_at']
    search_fields = ['title', 'article_number', 'text']
    readonly_fields = ['created_at']


class TaskOptionInline(admin.TabularInline):
    model = TaskOption
    extra = 2


@admin.register(CaseTask)
class CaseTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'case', 'task_type', 'max_score']
    list_filter = ['task_type', 'case']
    search_fields = ['title', 'instruction', 'ideal_answer']
    filter_horizontal = ['law_references']
    inlines = [TaskOptionInline]


@admin.register(TaskOption)
class TaskOptionAdmin(admin.ModelAdmin):
    list_display = ['task', 'text', 'is_correct', 'correct_order']
    list_filter = ['is_correct', 'task']
    search_fields = ['text']


@admin.register(CaseAttempt)
class CaseAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'case', 'status', 'total_score', 'started_at', 'completed_at']
    list_filter = ['status', 'case']
    search_fields = ['user__email', 'case__title']
    readonly_fields = ['started_at']

@admin.register(TaskAnswer)
class TaskAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt', 'task', 'score', 'is_correct']
    list_filter = ['is_correct', 'task']
    search_fields = ['open_answer', 'ai_feedback']
    filter_horizontal = ['selected_options']