from rest_framework import serializers
from user.api.serializers import GetUserSerializer
from posts.models import Posts, Hashtags,Saves, Likes, Shares

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtags
        fields = '__all__'
        extra_kwargs = {'posts': {'required': False}}

class PostSerializer(serializers.ModelSerializer):
    hashtag = HashtagSerializer(many=True, read_only=True)
    user =  GetUserSerializer()
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Posts
        fields = ['id', 'user', 'media', 'caption', 'hashtag', 'created_at', 'updated_at', 'like_count']
        extra_kwargs = {'hashtag': {'required': False}}

    def get_user(self, obj):
        user_instance = obj.user
        user_serializer = GetUserSerializer(user_instance)
        return user_serializer.data

    def get_like_count(self, obj):
        return obj.like_count()

  





class SavesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saves
        fields = '__all__'

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'

class SharesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shares
        fields = '__all__'