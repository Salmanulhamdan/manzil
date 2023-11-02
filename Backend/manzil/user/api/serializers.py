from rest_framework import serializers
from user.models import CustomUser 
class Custom_user_serializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "usertype",
            "email",
            "phonenumber",
            "profile_photo",
            "password",
        ]

class Login_serializer_user(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

class UserTypeSelectionSerializer(serializers.Serializer):
    usertype = serializers.ChoiceField(choices=CustomUser.USER_TYPE_CHOICES)