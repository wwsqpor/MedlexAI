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

    class Meta:
        model = CaseTask
        fields = ["id", "title", "instruction", "task_type", "max_score", "options"]


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
        fields = ["id", "title", "short_description", "category", "difficulty"]