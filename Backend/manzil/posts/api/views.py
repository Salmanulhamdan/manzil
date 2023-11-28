from django.shortcuts import get_object_or_404
from rest_framework import viewsets,generics,permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from posts.models import Hashtags, Posts,Saves, Likes, Shares
from .serializers import HashtagSerializer, PostSerializer,SavesSerializer, LikesSerializer, SharesSerializer
from django.db.models import Q


from rest_framework.decorators import action


class HashtagsViewSet(viewsets.ModelViewSet):
    queryset = Hashtags.objects.all()
    serializer_class = HashtagSerializer

   

class PostsViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


    def create(self, request, *args, **kwargs):
        # Extract hashtags from the request data
        hashtag_names = request.data.get('hashtag', [])
        user=request.user
        # Create or retrieve existing hashtags
        hashtag_instence=[]
        hashtags = hashtag_names.split(',')
        for hashtag_name in hashtags:
            hashtag, created = Hashtags.objects.get_or_create(hashtag=hashtag_name)
            hashtag_instence.append(hashtag)
        newdata = request.data
        # Update the request data with the hashtag instances
        newdata['hashtag'] = [hashtag.id for hashtag in hashtag_instence]
        newdata['user'] = user.id
        print(newdata)
        serializer = self.get_serializer(data=newdata)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        
        self.perform_create(serializer)
        serializer.instance.hashtag.set(hashtag_instence)
       

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    @action(detail=False, methods=['GET'])
    def recommended_posts(self, request):
        # Get the user who liked the posts
        liked_user = request.user  
        print("user",liked_user)
        # Get the hashtags of posts liked by the user
        liked_post_hashtags = Hashtags.objects.filter(posts__likes__user=liked_user)
        print("likedpost",liked_post_hashtags)

        # Find other posts with similar hashtags
        recommended_posts = (Posts.objects.filter(hashtag__in=liked_post_hashtags).exclude(Q(likes__user=liked_user) | Q(user=liked_user)).distinct())
        print("reccomende",recommended_posts)

        # Serialize all posts excluding liked and own posts
        remaining_posts = Posts.objects.exclude(Q(user=liked_user)| Q(id__in=recommended_posts.values('id')))
        remaining_posts_serializer = self.get_serializer(remaining_posts, many=True)


        # Serialize recommended posts
        recommended_posts_serializer = self.get_serializer(recommended_posts, many=True)
        # Combine the two lists (recommended posts followed by other posts)
        combined_posts = recommended_posts_serializer.data + remaining_posts_serializer.data

        return Response(combined_posts)
    
    @action(detail=False, methods=['GET'])
    def user_posts(self,request):
        print("userpost")
        user=request.user
        posts=Posts.objects.filter(user=user)
        serlized_post=self.get_serializer(posts,many=True)

        return Response(serlized_post.data)
    
    @action(detail=True, methods=['GET'])
    def get_user_posts_by_id(self, request, pk=None):
    
        target_user = get_object_or_404(CustomUser, pk=pk)
        posts = Posts.objects.filter(user=target_user)
        serialized_posts = self.get_serializer(posts, many=True)
        
        return Response(serialized_posts.data)
    
    def delete(self, request, pk=None):
        print("enterdd")
        post = self.get_object()
        print("Before deletion:", post)

        # Check if the user making the request is an admin
        if not request.user.is_staff:
            print("User is not an admin.")
            # If not an admin, check if the user is the owner of the post
            if request.user != post.user:
                return Response({'error': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)
        print("User is an admin or the owner.")

        post.delete()
        print("After deletion:", post)

        return Response({'success': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    




class SavesListCreateView(generics.ListCreateAPIView):
    queryset = Saves.objects.all()
    serializer_class = SavesSerializer
    permission_classes = [IsAuthenticated]

class LikesViewSet(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [permissions.IsAuthenticated]

    # @action(detail=False, methods=['get'])
    # def has_liked(self, request,):
       
    #     post_pk = request.data.get('post')  
    #     post = Posts.objects.get(pk=post_pk)
    #     print(post)
    #     user = request.user
    #     print("likedposts")

    #     has_liked = Likes.objects.filter(post=post, user=user).exists()

    #     return Response({"has_liked": has_liked})
        
    @action(detail=False, methods=['post'])
    def like_post(self, request):
        post_pk = request.data.get('post')  
        post = Posts.objects.get(pk=post_pk)
        print(post)
        print("liked")
        user = request.user

        # Check if the user has already liked the post
        if Likes.objects.filter(post=post, user=user).exists():
            return Response({"detail": "You have already liked this post."}, status=status.HTTP_400_BAD_REQUEST)

        like = Likes(post=post, user=user)
        like.save()

        return Response({"detail": "Post liked successfully."}, status=status.HTTP_201_CREATED)

    # @action(detail=True, methods=['delete'])
    # def unlike_post(self, request):
    #     post_pk = request.data.get('post')  
    #     post = Posts.objects.get(pk=post_pk)
    #     user = request.user
    #     print("deleted")

    #     # Check if the user has liked the post
    #     like = Likes.objects.filter(post=post, user=user).first()
    #     if not like:
    #         return Response({"detail": "You haven't liked this post."}, status=status.HTTP_400_BAD_REQUEST)

    #     like.delete()

    #     return Response({"detail": "Post unliked successfully."}, status=status.HTTP_200_OK)


class SharesListCreateView(generics.ListCreateAPIView):
    queryset = Shares.objects.all()
    serializer_class = SharesSerializer
    permission_classes = [IsAuthenticated]