from rest_framework import serializers
from user.models import CustomUser ,HouseownerProfile,Professions,ProfessionalsProfile,Plan,UserPlan




class Houseowner_Profile_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HouseownerProfile
        fields = ['place', 'upgraded']

class Professionals_Profile_Serializer(serializers.ModelSerializer):
    profession = serializers.StringRelatedField()
    
    class Meta:
        model = ProfessionalsProfile
        fields = ['place', 'profession', 'experience', 'bio', 'upgraded']

class Custom_user_serializer(serializers.ModelSerializer):
    houseowner_profile = Houseowner_Profile_Serializer( read_only=True)
    professional_profile = Professionals_Profile_Serializer( read_only=True)
    is_upgraded = serializers.SerializerMethodField()
    place = serializers.SerializerMethodField()

    def get_is_upgraded(self, obj):
        houseowner_upgraded = obj.houseowner_profile.upgraded if hasattr(obj, 'houseowner_profile') else False
        professional_upgraded = obj.professional_profile.upgraded if hasattr(obj, 'professional_profile') else False
        return houseowner_upgraded or professional_upgraded
    
    def get_place(self, obj):
        houseowner_place = obj.houseowner_profile.place if hasattr(obj, 'houseowner_profile') else None
        professional_place = obj.professional_profile.place if hasattr(obj, 'professional_profile') else None
        return houseowner_place or professional_place


    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'phonenumber', 'profile_photo', 'houseowner_profile', 'professional_profile','is_active','is_staff','usertype','is_upgraded','place']


class Customuser_serializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

        
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

class UserUpdateSerializer(serializers.ModelSerializer):
    houseowner_profile = HouseownerProfileSerializer(required=False)
    professional_profile = ProfessionalsProfileSerializer(required=False)

    class Meta:
        model = CustomUser
        fields = [ 'username', 'usertype', 'email', 'phonenumber', 'houseowner_profile', 'professional_profile']

    def update(self, instance, validated_data):
        print(validated_data,"validated dta")
        houseowner_profile_data = validated_data.pop('houseowner_profile', None)
        print(houseowner_profile_data,"lllssasa")
        professional_profile_data = validated_data.pop('professional_profile', None)

        instance = super().update(instance, validated_data)
        print(instance)

        print(instance.usertype,"lll")

        if instance.usertype == CustomUser.HOUSE_OWNER and houseowner_profile_data:
            print("kkinstance")
            houseowner_profile, created = HouseownerProfile.objects.get_or_create(user=instance)
            HouseownerProfileSerializer().update(houseowner_profile, houseowner_profile_data)
           

        elif instance.usertype == CustomUser.PROFESSIONAL and professional_profile_data:
            professional_profile, created = ProfessionalsProfile.objects.get_or_create(user=instance)
            ProfessionalsProfileSerializer().update(professional_profile, professional_profile_data)
            print("kkinstance")

        return instance