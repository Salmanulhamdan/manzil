"""
ASGI config for manzil project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'manzil.settings')

application = get_asgi_application()
# 


# django_asgi_application = get_asgi_application()

# application = ProtocolTypeRouter(
#     {
#         'http': django_asgi_application,
#         'websocket': JwtAuthMiddleware(URLRouter(routing.websocket_urlpatterns + postrouting.websocket_urlpatterns)
#         )
#     }
# )
