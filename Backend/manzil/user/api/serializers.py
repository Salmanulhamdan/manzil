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
class GetUserSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields =  [
            "id",
            "username",
            "usertype",
            "email",
            "phonenumber",
            "profile_photo",
            "password",
            "post_count",
            "followers_count",
            "following_count",
        ]
        
    def get_post_count(self, obj):
        return obj.posts.count()

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    

class Login_serializer_user(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
class HouseownerProfileSerializer(serializers.ModelSerializer):
    user =  GetUserSerializer(read_only=True)
    class Meta:
        model = HouseownerProfile
        fields = '__all__'



class ProfessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professions
        fields = '__all__'

class ProfessionalsProfileSerializer(serializers.ModelSerializer):
    user =  GetUserSerializer(read_only=True)
    profession = ProfessionsSerializer()

    class Meta:
        model = ProfessionalsProfile
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



class UserProfileStatusSerializer(serializers.Serializer):
    upgraded = serializers.BooleanField()


class ProfilePhotoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_photo']