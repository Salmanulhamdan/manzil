from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from .views import FollowUnfollowUserView,  PlanViewSet, ProfilePhotoUpdateAPIView, Signup, MyProfile, UserProfile, UserProfileStatusView,login,FacebookLogin,GoogleLogin,RegisteredUsers,UserDetail,BlockUser,DeletePost,GetUserView,RazorpayOrderView,UserPlanViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'plans', PlanViewSet)
router.register(r'userplans', UserPlanViewSet, basename='userplan')

urlpatterns = [
    path('signup', Signup.as_view(), name='user-signup'),
    path('login', login.as_view(), name='user-login'),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('user',GetUserView.as_view(),name='user'),
    # path('userprofile',GetOneUser.as_view(),name='oneuser'),
    path('myprofile/',MyProfile.as_view(), name='get_my_profile'),
    path('userprofile/<int:userId>/',UserProfile.as_view(), name='get_user_profile'),
    path('userprofile-status/', UserProfileStatusView.as_view(), name='user-profile-status'),
    path('update-profile-photo/', ProfilePhotoUpdateAPIView.as_view(), name='update_profile_photo_api'),
    
    path('follow/<int:user_id>/', FollowUnfollowUserView.as_view(), name='follow-user'),
   
    path('create-razorpay/',RazorpayOrderView.as_view(),name='razorpayorder'),
   
    path('', include(router.urls)),

    path('registeredUsers',RegisteredUsers.as_view(),name='registeredUsers'),
    path('userdetail/<str:userEmail>/',UserDetail.as_view(),name='userdetail'),
    path('blockuser/<int:id>/',BlockUser.as_view(),name='blockuser'),
    path('deletepost/<int:id>/',DeletePost.as_view(),name='deletepost'),
    
    

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)