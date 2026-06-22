from rest_framework import serializers
from .models import Case, Category, CaseTask, TaskOption, CaseAttempt, TaskAnswer, LawReference


class LawReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawReference
        fields = ['id', 'title', 'article_number', 'text']


class TaskOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskOption
        fields = ['id', 'text', 'correct_order']
        # is_correct исключено намеренно — не отдаём ответ клиенту


class CaseTaskSerializer(serializers.ModelSerializer):
    options = TaskOptionSerializer(many=True, read_only=True)
    law_references = LawReferenceSerializer(many=True, read_only=True)

    class Meta:
        model = CaseTask
        fields = [
            'id', 'title', 'instruction', 'task_type',
            'max_score', 'options', 'law_references',
        ]
        # ideal_answer исключено намеренно


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class CaseSerializer(serializers.ModelSerializer):
    """Полный кейс с заданиями — используется в case_detail."""
    category = CategorySerializer(read_only=True)
    tasks = CaseTaskSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = [
            'id', 'title', 'short_description', 'full_description',
            'difficulty', 'category', 'tasks', 'created_at',
        ]


class UserCaseSerializer(serializers.ModelSerializer):
    """Лёгкий сериализатор — используется в списке кейсов (case_list)."""
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Case
        fields = ['id', 'title', 'short_description', 'difficulty', 'category', 'created_at']


class TaskAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAnswer
        fields = [
            'id', 'task', 'selected_options', 'open_answer',
            'score', 'is_correct', 'ai_feedback',
            'ai_correct_answer', 'ai_what_is_correct', 'ai_what_is_missing',
        ]
        read_only_fields = [
            'score', 'is_correct', 'ai_feedback',
            'ai_correct_answer', 'ai_what_is_correct', 'ai_what_is_missing',
        ]


class CaseAttemptSerializer(serializers.ModelSerializer):
    """
    Полная информация о попытке.
    Включает `current_task_id` — id первого вопроса без ответа,
    чтобы фронтенд мог вернуть пользователя ровно туда, где он остановился.
    """
    case = UserCaseSerializer(read_only=True)
    answers = TaskAnswerSerializer(many=True, read_only=True)
    current_task_id = serializers.SerializerMethodField()
    total_tasks = serializers.SerializerMethodField()
    answered_tasks = serializers.SerializerMethodField()

    class Meta:
        model = CaseAttempt
        fields = [
            'id', 'case', 'status', 'total_score',
            'started_at', 'completed_at',
            'answers', 'current_task_id',
            'total_tasks', 'answered_tasks',
        ]

    def get_current_task_id(self, attempt):
        if attempt.status == 'completed':
            return None

        answered_task_ids = set(
            attempt.answers.values_list('task_id', flat=True)
        )
        next_task = (
            attempt.case.tasks
            .exclude(id__in=answered_task_ids)
            .order_by('id')
            .first()
        )
        return next_task.id if next_task else None

    def get_total_tasks(self, attempt):
        return attempt.case.tasks.count()

    def get_answered_tasks(self, attempt):
        return attempt.answers.count()