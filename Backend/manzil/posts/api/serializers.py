from rest_framework import serializers
from posts.models import Posts, Hashtags,Saves, Likes, Shares

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtags
        fields = '__all__'
        extra_kwargs = {'posts': {'required': False}}

class PostSerializer(serializers.ModelSerializer):
    hashtag = HashtagSerializer(many=True, read_only=True)

    class Meta:
        model = Posts
        fields = '__all__'
        extra_kwargs = {'hashtag': {'required': False}}

  





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