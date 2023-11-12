
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostsViewSet

router = DefaultRouter()
router.register(r'posts', PostsViewSet, basename='posts')

urlpatterns = [
    path('', include(router.urls)),
]