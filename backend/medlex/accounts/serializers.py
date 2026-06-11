from rest_framework import serializers
from django.db.models import Max, Avg
from accounts.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'name', 'surname',
            'phone_number',
            'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['email', 'name', 'surname', 'phone_number',
                  'organization', 'specialization']
        read_only_fields = ['email']


class ProfileExtendedSerializer(serializers.ModelSerializer):
    """Profile + aggregated case statistics."""
    cases_completed = serializers.SerializerMethodField()
    best_score      = serializers.SerializerMethodField()
    average_score   = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['email', 'name', 'surname', 'phone_number',
                  'organization', 'specialization',
                  'cases_completed', 'best_score', 'average_score']

    def get_cases_completed(self, user):
        return user.completed_cases.count()

    def get_best_score(self, user):
        result = user.completed_cases.aggregate(best=Max('score'))
        return result['best']  # None if no cases completed yet

    def get_average_score(self, user):
        result = user.completed_cases.aggregate(avg=Avg('score'))
        avg = result['avg']
        return round(avg, 1) if avg is not None else None