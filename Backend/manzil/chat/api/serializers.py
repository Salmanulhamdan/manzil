from rest_framework import serializers
from chat.models import ChatRoom, Message
from django.utils.timesince import timesince
# from user.models import CustomUser
from user.api.serializers import Custom_user_serializer



# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['id', 'email', 'first_name', 'last_name','username', 'profile_pic']


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    sender_profile_pic = serializers.SerializerMethodField(read_only=True)
    created = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'
    
    def get_sender_profile_pic(self, obj):
        return obj.sender.profile_pic.url if obj.sender.profile_pic else None

    def get_created(self, obj):
        return timesince(obj.timestamp)

    




class ChatRoomListSerializer(serializers.ModelSerializer):
    unseen_message_count = serializers.SerializerMethodField()
    members = Custom_user_serializer(many=True)

    class Meta:
        model = ChatRoom
        fields = '__all__'

    def get_unseen_message_count(self, obj):
        user = self.context['request'].user
        return Message.objects.filter(room=obj, is_seen=False).exclude(sender=user).count()

    def to_representation(self, instance):
        user = self.context['request'].user
        members = instance.members.exclude(id=user.id)
        data = super(ChatRoomListSerializer, self).to_representation(instance)
        data['members'] = Custom_user_serializer(members, many=True).data
        return data
    