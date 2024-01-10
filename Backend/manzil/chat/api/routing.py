# from django.urls import path

# from chat.api import consumers

# websocket_urlpatterns = [
#     path('ws/chat/api/<int:room_id>/', consumers.ChatConsumer.as_asgi()),
# ]





# # routing.py

# from channels.routing import ProtocolTypeRouter, URLRouter

# from django.urls import path

# from chat.api.consumers import ChatConsumer

# application = ProtocolTypeRouter({

#     "websocket": URLRouter([

#         path('ws/chat/', ChatConsumer.as_asgi()),

#     ]),

# })