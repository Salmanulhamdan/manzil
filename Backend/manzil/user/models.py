from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.utils.translation import gettext_lazy as _
import uuid

# overriding usermanager
class CustomUserManager(BaseUserManager):

    # overriding user based authentication methord to email base authentiction
    def _create_user(self, email, password, **extra_fields):

        if not email:
            raise ValueError("The given mail must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)


    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)



# custom customer for user
# extrafields are added to by inheriting the django user
class CustomUser(AbstractUser):

    # User types (choices)
    HOUSE_OWNER = 'houseowner'
    PROFESSIONAL = 'professional'
    USER_TYPE_CHOICES = (
        (HOUSE_OWNER, 'House Owner'),
        (PROFESSIONAL, 'Professional'),
    )

    # Fields
    username = models.CharField(max_length=150,)
    usertype = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    email = models.EmailField(unique=True)
    phonenumber = models.CharField(max_length=12)
    profile_photo = models.ImageField(upload_to="Profile_photos", null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username', 'usertype', 'phonenumber']

    objects = CustomUserManager()
