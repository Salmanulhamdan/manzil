from rest_framework import serializers
from posts.models import Posts, Hashtags

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtags
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    hashtags = HashtagSerializer(many=True, read_only=True)

    class Meta:
        model = Posts
        fields = '__all__'