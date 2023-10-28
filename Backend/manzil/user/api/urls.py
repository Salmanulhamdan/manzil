from django.urls import path
from .views import Signup ,login

urlpatterns = [
    path('signup/', Signup.as_view(), name='user-signup'),
    path('login/', login.as_view(), name='user-login'),
]