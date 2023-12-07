from rest_framework import serializers
from user.models import Follow
from user.api.serializers import GetUserSerializer
from posts.models import Posts, Hashtags,Saves, Likes, Shares

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtags
        fields = '__all__'
        extra_kwargs = {'posts': {'required': False}}

class PostSerializer(serializers.ModelSerializer):
    hashtag = HashtagSerializer(many=True, read_only=True)
    user =  GetUserSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    is_following_author = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()


    class Meta:
        model = Posts
        fields = ['id', 'user', 'media', 'caption', 'hashtag', 'created_at', 'updated_at', 'like_count','is_following_author', 'is_liked','is_saved']
        extra_kwargs = {'hashtag': {'required': False}}        

   
    
    def get_is_following_author(self, obj):
        user = self.context['request'].user
        author = obj.user
        if user.is_authenticated:
            try:
                follow_instance = Follow.objects.get(follower=user, following=author)
                return True
            except Follow.DoesNotExist:
                return False
        return False
    
    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            try:
                like_instance = Likes.objects.get(post=obj, user=user)
                return True
            except Likes.DoesNotExist:
                return False
        return False
    
    def get_is_saved(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            try:
                like_instance = Saves.objects.get(post=obj, user=user)
                return True
            except Saves.DoesNotExist:
                return False
        return False


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