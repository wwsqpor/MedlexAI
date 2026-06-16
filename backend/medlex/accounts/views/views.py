from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from accounts.serializers import RegisterSerializer, ProfileSerializer, ProfileExtendedSerializer
from cases.serializers import UserCaseSerializer
from accounts.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def completed_cases_view(request):
    qs = request.user.completed_cases.select_related('case').order_by('-completed_at')
    serializer = UserCaseSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)
    serializer = ProfileSerializer(request.user, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_extended_view(request):
    if request.method == 'GET':
        serializer = ProfileExtendedSerializer(request.user)
        return Response(serializer.data)
    serializer = ProfileExtendedSerializer(request.user, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_view(request):
    credential = request.data.get('credential')
    if not credential:
        return Response({"error": "Google credential is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        google_client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        id_info = id_token.verify_oauth2_token(credential, google_requests.Request(), google_client_id)
    except ValueError as e:
        return Response({"error": f"Invalid Google token: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)
    email = id_info.get('email')
    if not email:
        return Response({"error": "Could not retrieve email from Google token."}, status=status.HTTP_400_BAD_REQUEST)
    user, created = User.objects.get_or_create(email=email, defaults={
        'name': id_info.get('given_name', ''),
        'surname': id_info.get('family_name', ''),
        'organization': '',
        'specialization': '',
    })
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "created": created,
        "user": ProfileSerializer(user).data,
    })