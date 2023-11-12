from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from posts.models import Hashtags, Posts
from .serializers import HashtagSerializer, PostSerializer
from rest_framework.decorators import action


class HashtagsViewSet(viewsets.ModelViewSet):
    queryset = Hashtags.objects.all()
    serializer_class = HashtagSerializer

   

class PostsViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    

    @action(detail=False, methods=['GET'])
    def recommended_posts(self, request):
        # Get the user who liked the posts
        liked_user = request.user  # Assuming you are using authentication and each request has a user

        # Get the hashtags of posts liked by the user
        liked_post_hashtags = Hashtags.objects.filter(posts__likes__user=liked_user)

        # Find other posts with similar hashtags
        recommended_posts = Posts.objects.filter(hashtag__in=liked_post_hashtags).distinct()

        # Serialize the recommended posts
        serializer = self.get_serializer(recommended_posts, many=True)

        return Response(serializer.data)