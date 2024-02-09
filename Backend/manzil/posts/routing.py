from django.urls import path
from posts.api import consumers


websocket_urlpatterns = [
    path('ws/notification/', consumers.NotificationConsumer.as_asgi()),
]