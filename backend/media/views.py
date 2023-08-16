import os
import jwt
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.cache import cache_control
from django.utils.decorators import method_decorator
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication
from .serializers import ImageSerializer
from core.models import Image
from core.models import User

def validate_jwt_token(request):
    token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(pk=user_id)
        return user
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired')
    except (jwt.DecodeError, User.DoesNotExist):
        raise AuthenticationFailed('Invalid token')
    
class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            user = validate_jwt_token(request)
            return (user, None)
        except AuthenticationFailed:
            return None


class GetImages(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    @method_decorator(cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0))
    def get(self, request, *args, **kwargs):
        tag = request.query_params.get('search')
        user = request.user
        if tag == '':
            queryset = Image.objects.filter(user=user)
        else:
            queryset = Image.objects.filter(user=user, tags__contains=[tag])
        serializer = ImageSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteImage(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        image_id = request.query_params.get('id')
        try:
            user = request.user
            image = Image.objects.filter(user=user, id=image_id)[0]
            image.delete()
            user.image_count -= 1
            user.total_usage -= image.file_size/1000000
            user.save()
            
            return JsonResponse({'message': 'Image deleted successfully'}, status=204)
        except Image.DoesNotExist:
            return JsonResponse({'error': 'Image not found'}, status=404)

class UploadImages(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            image = serializer.save(user=user)
            user.image_count += 1
            user.total_usage += image.file_size/1000000
            user.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

class DownloadImages(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, image_name):
        image_path = os.path.join(settings.MEDIA_ROOT, 'images', image_name)
        user = request.user
        try:
            image = Image.objects.get(user = user, name=image_name)
        except Image.DoesNotExist:
            return HttpResponse("Image not Found or Access Denied", status=404)

        if os.path.exists(image_path):
            with open(image_path, 'rb') as image_file:
                response = HttpResponse(image_file.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{image_name}"'
                return response
        else:
            return HttpResponse("Image not Found", status=404)
