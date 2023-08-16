import jwt
from datetime import datetime, timedelta
from django.views.decorators.cache import cache_control
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from media.views import CustomJWTAuthentication
from .serializers import UserSerializer, UserProfileImageSerializer
from core.models import RevokedToken

def generate_jwt_token(user):
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token.decode('utf-8')

class registerUser(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message':'User is saved successfully', 'user':serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class loginUser(APIView):
    def post(self, request):
        token = request.data.get('token')
        if RevokedToken.objects.filter(token=token).exists():
            return Response({'error': 'Token has been revoked'}, status=status.HTTP_401_UNAUTHORIZED)
        
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)

        if user:
            token = generate_jwt_token(user)
            return Response({'token':token})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class logoutUser(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        authorization_header = request.headers.get('Authorization')
        token = authorization_header.split(' ')[1]
        RevokedToken.objects.create(token=token)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class viewAccount(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    @method_decorator(cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0))
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class updateProfilePicture(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileImageSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class updateAccount(APIView):
    authentication_classes = []
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
