from rest_framework import serializers
from accounts.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'name', 'surname',
            'phone_number', 'organization', 'specialization',
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
        model = User
        fields = [
            'email', 'name', 'surname',
            'phone_number', 'organization', 'specialization',
        ]
        # Email is read-only — users change it via a dedicated flow
        read_only_fields = ['email']
