from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

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
    REQUIRED_FIELDS = []

    objects = CustomUserManager()


class HouseownerProfile(models.Model):
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name="houseowner_profile")
    place=models.CharField(max_length=200,null=True)
    upgraded=models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    
    
class Professions(models.Model):
    profession_name=models.CharField(max_length=200,)

    def __str__(self):
        return self.profession_name

    
class ProfessionalsProfile(models.Model):
    user=models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name="professional_profile")
    place=models.CharField(max_length=200,null=True)
    profession=models.ForeignKey(Professions,on_delete=models.CASCADE,null=True)
    experience=models.IntegerField(null=True)
    bio=models.TextField(null=True)
    upgraded=models.BooleanField(default=False)


    def __str__(self):
        return self.user.username

    
#modls for upgrade a user 

class Plan(models.Model):

    name = models.CharField(max_length=100)

    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    duration=models.DurationField()

    


class UserPlan(models.Model):

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,related_name="userplan")

    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)

    start_date = models.DateTimeField(default=timezone.now)

    end_date = models.DateTimeField(null=True, blank=True)


    def save(self, *args, **kwargs):

        if not self.end_date:

            self.end_date = self.start_date + self.plan.duration

        super(UserPlan, self).save(*args, **kwargs)



class Follow(models.Model):
    follower = models.ForeignKey( CustomUser, related_name="following", on_delete=models.CASCADE)
    following = models.ForeignKey(CustomUser, related_name="followers", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"

    def followers_count(self):
        return self.followers.count()

    def following_count(self):
        return self.following.count()




    