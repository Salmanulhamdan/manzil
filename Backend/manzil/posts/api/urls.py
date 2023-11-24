
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostsViewSet,HashtagsViewSet,SavesListCreateView, LikesViewSet, SharesListCreateView

router = DefaultRouter()
router.register(r'hashtags', HashtagsViewSet,basename='hashtags')
router.register(r'posts', PostsViewSet, basename='posts')
router.register(r'likes', LikesViewSet, basename='likes')

urlpatterns = [
    path('', include(router.urls)),
    path('saves/', SavesListCreateView.as_view(), name='saves-list-create'),
    path('shares/', SharesListCreateView.as_view(), name='shares-list-create'),
]