from django.urls import path
from .views import Signup,login , FacebookLogin,GoogleLogin,UserTypeSelection

urlpatterns = [
    path('select-user-type', UserTypeSelection.as_view(), name='select_user_type'),
    path('signup', Signup.as_view(), name='user-signup'),
    path('login', login.as_view(), name='user-login'),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
]