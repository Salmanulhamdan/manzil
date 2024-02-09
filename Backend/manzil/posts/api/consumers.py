import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("WebSocket connect")
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
        else:
            self.room_group_name = f"notify_{self.user.id}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            await self.send(text_data=json.dumps({
                'status': 'connected'
            }))
            
    async def receive(self, text_data):
        logger.info("WebSocket received data: %s", text_data)
        await self.send(text_data=json.dumps({'status': 'OK,recieved'}))
        
    async def disconnect(self, close_code):
        logger.info("WebSocket disconnect")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    async def send_notification(self, event):
        logger.info("Sending notification: %s", event)
        data = json.loads(event.get('value'))
        await self.send(text_data=json.dumps({
                'type' : 'notification',
                'payload': data
            }))