
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostsViewSet,HashtagsViewSet,SavesListCreateView, LikesListCreateView, SharesListCreateView

router = DefaultRouter()
router.register(r'hashtags', HashtagsViewSet,basename='hashtags')
router.register(r'posts', PostsViewSet, basename='posts')

urlpatterns = [
    path('', include(router.urls)),
    path('saves/', SavesListCreateView.as_view(), name='saves-list-create'),
    path('likes/', LikesListCreateView.as_view(), name='likes-list-create'),
    path('shares/', SharesListCreateView.as_view(), name='shares-list-create'),
]