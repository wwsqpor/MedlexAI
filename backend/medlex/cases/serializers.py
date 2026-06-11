from rest_framework import serializers
from .models import Case, Category, CaseCategory, UserCase


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'description']


class CaseCategorySerializer(serializers.ModelSerializer):
    category    = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model  = CaseCategory
        fields = ['id', 'category', 'category_id']


class CaseListSerializer(serializers.ModelSerializer):
    difficulty_level_display = serializers.CharField(
        source='get_difficulty_level_display',
        read_only=True
    )

    class Meta:
        model  = Case
        fields = ['id', 'title', 'difficulty_level', 'difficulty_level_display', 'score', 'created_at']


class CaseSerializer(serializers.ModelSerializer):
    categories               = CaseCategorySerializer(many=True, read_only=True)
    category_ids             = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True,
        write_only=True, required=False
    )
    difficulty_level_display = serializers.CharField(
        source='get_difficulty_level_display', read_only=True
    )

    class Meta:
        model  = Case
        fields = [
            'id', 'title', 'description',
            'difficulty_level', 'difficulty_level_display',
            'score', 'categories', 'category_ids',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        case = Case.objects.create(**validated_data)
        CaseCategory.objects.bulk_create([
            CaseCategory(case=case, category=cat) for cat in category_ids
        ])
        return case

    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if category_ids is not None:
            instance.categories.all().delete()
            CaseCategory.objects.bulk_create([
                CaseCategory(case=instance, category=cat) for cat in category_ids
            ])
        return instance


class UserCaseSerializer(serializers.ModelSerializer):
    case = CaseListSerializer(read_only=True)

    class Meta:
        model  = UserCase
        fields = ['id', 'case', 'score', 'completed_at']