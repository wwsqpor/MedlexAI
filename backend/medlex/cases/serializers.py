from rest_framework import serializers
from .models import Case, CaseTask, TaskOption, CaseAttempt, TaskAnswer, Category, LawReference


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class LawReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawReference
        fields = "__all__"


class TaskOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskOption
        fields = ["id", "text", "is_correct", "correct_order"]


class CaseTaskSerializer(serializers.ModelSerializer):
    options = TaskOptionSerializer(many=True, read_only=True)
    law_references = LawReferenceSerializer(many=True, read_only=True)

    class Meta:
        model = CaseTask
        fields = ["id", "title", "instruction", "task_type", "max_score", "options", "law_references"]


class CaseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tasks = CaseTaskSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = "__all__"


class UserCaseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Case
        fields = ["id", "title", "short_description", "category", "difficulty", "created_at"]


class TaskAnswerSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = TaskAnswer
        fields = [
            "id", "task", "task_title", "open_answer", "score", "is_correct",
            "ai_feedback", "ai_correct_answer", "ai_what_is_correct", "ai_what_is_missing",
        ]


class CaseAttemptSerializer(serializers.ModelSerializer):
    case_title = serializers.CharField(source='case.title', read_only=True)
    answers = TaskAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = CaseAttempt
        fields = [
            "id", "case", "case_title", "status", "total_score",
            "started_at", "completed_at", "answers",
        ]