from rest_framework import serializers
from user.models import CustomUser ,HouseownerProfile,Professions,ProfessionalsProfile,Plan,UserPlan
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
class HouseownerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseownerProfile
        fields = '__all__'



class ProfessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professions
        fields = '__all__'

class ProfessionalsProfileSerializer(serializers.ModelSerializer):
    profession = ProfessionsSerializer()

    class Meta:
        model = ProfessionalsProfile
        fields = '__all__'


class GetUserSerializer(serializers.ModelSerializer):
     class Meta:
        model = CustomUser
        fields = '__all__'



class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class UserPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlan
        fields = '__all__'
        read_only_fields = ['user']