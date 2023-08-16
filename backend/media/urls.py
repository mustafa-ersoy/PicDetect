from django.urls import path
from .views import GetImages, UploadImages, DeleteImage, DownloadImages

urlpatterns = [
    path('upload/', UploadImages.as_view(), name='upload'),
    path('getImages/', GetImages.as_view(), name='GetImages'),
    path('delete/', DeleteImage.as_view(), name='delete'),
    path('download/<str:image_name>/', DownloadImages.as_view(), name='download'),
]