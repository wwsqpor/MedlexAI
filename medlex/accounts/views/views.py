from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from django.conf import settings

from accounts.serializers import RegisterSerializer, ProfileSerializer
from accounts.models import User


# ──────────────────────────────────────────────
# Register
# ──────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    POST /api/accounts/register/
    Body: { email, name, surname, phone_number, organization, specialization, password }
    Returns: { message } on success, or validation errors.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Account created successfully!"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────────────────────────
# Profile (GET)
# ──────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    GET /api/accounts/profile/
    Header: Authorization: Bearer <access_token>
    Returns: user profile fields as JSON.
    """
    serializer = ProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# Profile (PATCH / PUT)
# ──────────────────────────────────────────────
@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_update_view(request):
    """
    PATCH /api/accounts/profile/update/
    Header: Authorization: Bearer <access_token>
    Body: any subset of { name, surname, phone_number, organization, specialization }
    Returns: updated profile fields.
    """
    serializer = ProfileSerializer(
        request.user,
        data=request.data,
        partial=(request.method == 'PATCH')
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────────────────────────
# Google OAuth token exchange
# ──────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_view(request):
    """
    POST /api/accounts/auth/google/
    Body: { credential: "<Google ID token>" }

    Angular (or any SPA) sends the raw Google ID token it received from
    Google Sign-In.  Django verifies it, creates or retrieves the user,
    and returns a JWT pair so the frontend can authenticate future requests.
    """
    credential = request.data.get('credential')
    if not credential:
        return Response(
            {"error": "Google credential (id_token) is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        google_client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        id_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id
        )
    except ValueError as e:
        return Response(
            {"error": f"Invalid Google token: {str(e)}"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    email = id_info.get('email')
    if not email:
        return Response(
            {"error": "Could not retrieve email from Google token."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get or create the user
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'name': id_info.get('given_name', ''),
            'surname': id_info.get('family_name', ''),
            'organization': '',
            'specialization': '',
        }
    )

    # Issue JWT tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "created": created,
        "user": ProfileSerializer(user).data,
    }, status=status.HTTP_200_OK)
