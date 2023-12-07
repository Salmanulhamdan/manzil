
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostsViewSet,HashtagsViewSet ,LikesViewSet,SharesListCreateView,EditPostView,SavesPostView,LikedPostsView

router = DefaultRouter()
router.register(r'hashtags', HashtagsViewSet,basename='hashtags')
router.register(r'posts', PostsViewSet, basename='posts')
router.register(r'likes', LikesViewSet, basename='likes')
router.register(r'saves', SavesPostView, basename='saves')

urlpatterns = [
    path('', include(router.urls)),
    path('liked-posts/', LikedPostsView.as_view(), name='liked-posts'),
    path('shares/', SharesListCreateView.as_view(), name='shares-list-create'),
    path('edit-post/<int:pk>/', EditPostView.as_view(), name='edit-post'),
]