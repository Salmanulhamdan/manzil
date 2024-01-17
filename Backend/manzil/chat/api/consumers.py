import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.utils.timesince import timesince

from user.api.serializers import Custom_user_serializer
from chat.models import Message, ChatRoom
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connectedasgiww")
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"chat_{self.room_id}"
        # Add the channel to the room's group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Accept the WebSocket connection
        await self.accept()
        # Send a connection message to the client

    async def disconnect(self, close_code):
        # Remove the channel from the room's group upon disconnect
        print("disconnectedasgiww")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def async_custom_user_serializer(self, user):
        user_serializer = Custom_user_serializer(user)
        return user_serializer.data

    async def receive(self, text_data):
        print("recived")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print(message,"messagefrom reciver")
        user = self.scope["user"]
        print(user,"userfom recivwer")
        user_serializer_data = await self.async_custom_user_serializer(user)
        print(user_serializer_data,"userserlizerfrom reciver")
        email = user_serializer_data['email']
        print(email,"emailfromreciver")

        new_message = await self.create_message(self.room_id, message, email)
        
        # Send the received message to the room's group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'room_id': self.room_id,
                'sender_email': email,
                'created': timesince(new_message.timestamp),
            }
        )

    async def chat_message(self, event):
        print("chatmessage")
        message = event['message']
        room_id = event['room_id']
        email = event['sender_email']
        created = event['created']

        # Send the chat message to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'room_id': room_id,
            'sender_email': email,
            'created': created,
        }))

    @database_sync_to_async
    def create_message(self, room_id, message, email):
        print("creating message")
        user = User.objects.get(email=email)
        room = ChatRoom.objects.get(id=room_id) 
        message = Message.objects.create(content=message, room=room, sender=user)
        message.save()
        return message