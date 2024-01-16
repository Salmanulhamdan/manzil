"""
ASGI config for manzil project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'manzil.settings')
django.setup()

from django.core.asgi import get_asgi_application
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from .channelsmiddleware import JwtAuthMiddleware
from channels.routing import ProtocolTypeRouter,URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
# from chat.routing import websocket_urlpatterns
# from posts.api import routing as  postrouting
from django.urls import path
from chat.api import consumers

# application = get_asgi_application()



django_asgi_application = get_asgi_application()
websocket_urlpatterns = [
    path('/chat/<int:room_id>/', consumers.ChatConsumer.as_asgi()),
]


application = ProtocolTypeRouter(
    {
        'http': django_asgi_application,
        'websocket': JWTAuthMiddlewareStack(
            AllowedHostsOriginValidator(
                JwtAuthMiddleware(URLRouter(websocket_urlpatterns))
            ),
        ),
    }
)








