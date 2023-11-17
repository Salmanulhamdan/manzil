from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import Signup,login , FacebookLogin,GoogleLogin,RegisteredUsers,UserDetail,BlockUser,DeletePost,GetUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup', Signup.as_view(), name='user-signup'),
    path('login', login.as_view(), name='user-login'),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('user',GetUserView.as_view(),name='user'),

    path('registeredUsers',RegisteredUsers.as_view(),name='registeredUsers'),
    path('userdetail/<str:userEmail>/',UserDetail.as_view(),name='userdetail'),
    path('blockuser/<int:id>/',BlockUser.as_view(),name='blockuser'),
    path('deletepost/<int:id>/',DeletePost.as_view(),name='deletepost'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)