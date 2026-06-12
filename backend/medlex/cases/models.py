from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    class Meta:
        ordering = ['name']
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name
class Case(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Легкий'),
        ('medium', 'Средний'),
        ('hard', 'Сложный'),
    ]

    title = models.CharField(max_length=255)
    short_description = models.TextField()
    full_description = models.TextField()
    category = models.ForeignKey(
    Category,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='cases',
    verbose_name="Категория"
)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class LawReference(models.Model):
    title = models.CharField(max_length=255)

    article_number = models.CharField(
        max_length=50,
        blank=True
    )

    text = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.title} ({self.article_number})"

class CaseTask(models.Model):
    TASK_TYPES = [
        ('order', 'Order'),
        ('test', 'Test'),
        ('open', 'Open Question'),
    ]

    case = models.ForeignKey(
        'Case',
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    title = models.CharField(max_length=255)

    instruction = models.TextField()

    task_type = models.CharField(
        max_length=20,
        choices=TASK_TYPES
    )

    ideal_answer = models.TextField(
        blank=True
    )

    max_score = models.PositiveIntegerField(
    default=100,
    validators=[MinValueValidator(0), MaxValueValidator(100)]
)
    law_references = models.ManyToManyField(
    LawReference,
    blank=True
)
    def __str__(self):
        return self.title

class TaskOption(models.Model):
    task = models.ForeignKey(CaseTask, on_delete=models.CASCADE, related_name='options')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    correct_order = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.text[:50]


class CaseAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'В процессе'),
        ('completed', 'Завершен'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='case_attempts')
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='attempts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    total_score = models.PositiveIntegerField(
    default=0,
    validators=[MinValueValidator(0), MaxValueValidator(100)]
)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} — {self.case.title}"


class TaskAnswer(models.Model):
    attempt = models.ForeignKey(CaseAttempt, on_delete=models.CASCADE, related_name='answers')
    task = models.ForeignKey(CaseTask, on_delete=models.CASCADE)
    selected_options = models.ManyToManyField(TaskOption, blank=True)
    open_answer = models.TextField(blank=True)
    score = models.PositiveIntegerField(
    default=0,
    validators=[MinValueValidator(0), MaxValueValidator(100)]
)
    is_correct = models.BooleanField(default=False)
    ai_feedback = models.TextField(blank=True) #Комментарий AI.
    
    ai_correct_answer = models.TextField(blank=True) #Эталонный ответ от AI/системы.
    ai_what_is_correct = models.JSONField(default=list, blank=True)  #Что студент написал правильно.
    ai_what_is_missing = models.JSONField(default=list, blank=True) #Что студент пропустил.

    def __str__(self):
        return f"Answer: {self.task.title}"
    



