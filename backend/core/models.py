from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_kwargs):
        if not email:
            raise(ValueError, 'email is needed')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_kwargs):
        extra_kwargs.setdefault('is_staff', True)
        extra_kwargs.setdefault('is_superuser', True)

        if not extra_kwargs['is_staff']:
            raise (ValueError, 'superuser needs to be a staff')
        if not extra_kwargs['is_superuser']:
            raise (ValueError, 'superuser variable needs to be True')

class User(AbstractBaseUser, PermissionsMixin):
    def default_profile_image():
        return 'profile_images/default.jpeg'
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to = 'profile_images/', default = default_profile_image)
    image_count = models.IntegerField(default=0)
    total_usage = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'

class Image(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    name = models.CharField(max_length=100, default='image')
    file_size = models.FloatField(default=0)
    image = models.ImageField(upload_to = 'images/')
    tags = ArrayField(models.CharField(max_length=50), size=None, default=['orange'])

class RevokedToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
