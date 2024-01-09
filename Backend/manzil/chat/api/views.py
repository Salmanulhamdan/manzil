from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions, status, generics
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from chat.models import ChatRoom, Message
from . serializers import ChatRoomListSerializer, ChatRoomSerializer, MessageSerializer

from django.db.models import Q
User = get_user_model()

# Create your views here.


class CreateChatRoom(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatRoomSerializer
 
    def post(self, request, pk):
        current_user = request.user
        other_user = User.objects.get(pk=pk)

        # Check if a chat room already exists between the users
        existing_chat_rooms = ChatRoom.objects.filter(members=current_user).filter(members=other_user)
        if existing_chat_rooms.exists():
            serializer = ChatRoomSerializer(existing_chat_rooms.first())
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create a new chat room
        chat_room = ChatRoom()
        chat_room.save()
        chat_room.members.add(current_user, other_user)
        
        serializer = ChatRoomSerializer(chat_room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RoomMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer
 
    def get(self, request, pk):
        try:
            room = ChatRoom.objects.get(pk=pk)
            messages = Message.objects.filter(room=room)
            serialized_messages = self.serializer_class(messages, many=True).data
            return Response(serialized_messages, status=status.HTTP_200_OK)
        except ChatRoom.DoesNotExist:
            return Response("Room not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


        
class MesageSeenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer
 
    def get(self, request, pk):
        current_user = request.user
        other_user = User.objects.get(pk=pk)
        if ChatRoom.objects.filter(members=current_user).filter(members=other_user).exists():
            chat_room = ChatRoom.objects.filter(members=current_user).filter(members=other_user).first()
            messages_to_update = Message.objects.filter(Q(room=chat_room) & ~Q(sender=current_user))            
            messages_to_update.update(is_seen=True)            
            return Response({'sucess': 'Chat room found.'},status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Chat room not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class ChatRoomListView(generics.ListAPIView):
    serializer_class = ChatRoomListSerializer

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(members=user)
    


class UnseenChatsCount(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        current_user = request.user
        unseen_chat_rooms = ChatRoom.objects.filter(
            members=current_user,
            message__is_seen=False 
        ).distinct()  
        total_unseen_chats_count = unseen_chat_rooms.count()
        return Response({'count': total_unseen_chats_count}, status=status.HTTP_200_OK)
