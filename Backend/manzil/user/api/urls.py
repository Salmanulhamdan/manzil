from django.urls import path
from .views import Signup,login , FacebookLogin,GoogleLogin

urlpatterns = [
    path('signup', Signup.as_view(), name='user-signup'),
    path('login', login.as_view(), name='user-login'),
     path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
]