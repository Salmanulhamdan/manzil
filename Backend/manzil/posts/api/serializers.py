from rest_framework import serializers
from user.models import Follow
from user.api.serializers import Custom_user_serializer, GetUserSerializer, ProfessionsSerializer
from posts.models import AnswerReply, Answers, Notification, Posts, Hashtags, Qustions, Report, Requirment,Saves, Likes, Shares, intrests

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtags
        fields = '__all__'
        extra_kwargs = {'posts': {'required': False}}

class ReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Report
        fields = '__all__'

class ReportItemSerializer(serializers.Serializer):
    report_type = serializers.CharField()
    reported_item_id = serializers.IntegerField()
    report_count = serializers.IntegerField()

    class Meta:
        fields = ['report_type', 'reported_item_id', 'report_count']


class PostSerializer(serializers.ModelSerializer):
    hashtag = HashtagSerializer(many=True, read_only=True)
    user =  GetUserSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    is_following_author = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    is_reported=serializers.SerializerMethodField()


    class Meta:
        model = Posts
        fields = ['id', 'user', 'media', 'caption', 'hashtag', 'created_at', 'updated_at', 'like_count','is_following_author', 'is_liked','is_saved','is_reported']
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
    

    def get_is_reported(self,obj):
        user = self.context['request'].user
        if user.is_authenticated:
            try: 
                report_instance=Report.objects.get(reported_item_id=obj.id,user=user)
                return True
            except Report.DoesNotExist:
                return False
        return False


  
class PostSerializer_for_Report(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ('id', 'user', 'media', 'caption', 'hashtag', 'created_at', 'updated_at', 'is_blocked')




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

class RequirmentSerializer(serializers.ModelSerializer):
    is_following_author = serializers.SerializerMethodField()
    is_intrested = serializers.SerializerMethodField()
    user =  Custom_user_serializer(read_only=True)
    profession=ProfessionsSerializer(read_only=True)
   

    class Meta:
        model = Requirment
        fields = ('id','profession','description','time','user','is_following_author', 'is_intrested')


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
    
    def get_is_intrested(self, obj):
        user = self.context['request'].user
        try:
            interest_instance = intrests.objects.get(user=user, requirment=obj)
            return True
        except intrests.DoesNotExist:
            return False
        except Exception as e:
            print(f"Error in get_is_intrested: {e}")
            return False

        


class IntrestsSerializer(serializers.ModelSerializer):
    user = Custom_user_serializer(read_only=True)
    class Meta:
        model = intrests
        fields = ('id','user','requirment','conformation','time')




class QuestionSerializer(serializers.ModelSerializer):
    is_following_author = serializers.SerializerMethodField()
    user =  Custom_user_serializer(read_only=True)
    class Meta:
        model = Qustions
        fields = ['id','user','qustion','is_following_author']

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
    


class AnswerReplySerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user =  Custom_user_serializer(read_only=True)

    class Meta:
        model = AnswerReply
        fields = ['id', 'user', 'reply_text', 'replies']

    def get_replies(self, obj):
        serializer = AnswerReplySerializer(obj.replies_to_reply.all(), many=True)
        return serializer.data if serializer.data else None

class AnswersSerializer(serializers.ModelSerializer):
    replies = AnswerReplySerializer(many=True, read_only=True)
    user =  Custom_user_serializer(read_only=True)

    class Meta:
        model = Answers
        fields = ['id', 'user', 'qustion', 'answer', 'replies']
        read_only_fields = ['user']




class NotificationSerializer(serializers.ModelSerializer):
    from_user = Custom_user_serializer(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('notification_type',)

    def validate_notification_type(self, value):
        choices = dict(Notification.NOTIFICATION_TYPES)
        if value not in choices:
            raise serializers.ValidationError("Invalid notification type.")
        return value