from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('register/', views.registerUser.as_view(), name='register'),
    path('login/', views.loginUser.as_view(), name='login'),
    path('logout/', views.logoutUser.as_view(), name='logout'),
    path('account/', views.viewAccount.as_view(), name='view-account'),
    path('update/', views.updateAccount.as_view(), name='update-account'),
    path('update_picture/', views.updateProfilePicture.as_view(), name='update-picture'),
]
