from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from django.db import models


class Case(models.Model):
    class Difficulty(models.TextChoices):
        EASY   = 'E', 'Easy'
        MEDIUM = 'M', 'Medium'
        HARD   = 'H', 'Hard'

    title            = models.CharField(max_length=200, verbose_name="Название")
    description      = models.TextField(verbose_name="Описание")
    difficulty_level = models.CharField(
        max_length=1, choices=Difficulty.choices,
        default=Difficulty.EASY, verbose_name="Уровень сложности"
    )
    score = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Баллы за кейс"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True,     verbose_name="Дата обновления")

    class Meta:
        ordering     = ['-created_at']
        verbose_name = "Кейс"
        verbose_name_plural = "Кейсы"

    def __str__(self):
        return self.title


class Category(models.Model):
    name        = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")

    class Meta:
        ordering     = ['name']
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class CaseCategory(models.Model):
    case     = models.ForeignKey(Case,     on_delete=models.CASCADE, related_name='categories')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='cases')

    class Meta:
        verbose_name = "Связь Кейс-Категория"
        verbose_name_plural = "Связи Кейс-Категория"


class UserCase(models.Model):
    """Records a single completion of a case by a user."""
    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='completed_cases'
    )
    case       = models.ForeignKey(
        Case,
        on_delete=models.CASCADE,
        related_name='completions'
    )
    score      = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Полученный балл"
    )
    completed_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата прохождения")

    class Meta:
        # one row per attempt — remove unique_together if you want multiple attempts
        unique_together = ('user', 'case')
        ordering        = ['-completed_at']
        verbose_name    = "Пройденный кейс"
        verbose_name_plural = "Пройденные кейсы"

    def __str__(self):
        return f"{self.user} — {self.case} ({self.score}%)"