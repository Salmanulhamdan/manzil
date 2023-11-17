from rest_framework import viewsets,generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
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

        print(hashtag_names)

        # Create or retrieve existing hashtags
        hashtag_instence=[]
        hashtags = hashtag_names.split(',')
        for hashtag_name in hashtags:
            print(hashtag_name)
            hashtag, created = Hashtags.objects.get_or_create(hashtag=hashtag_name)
            hashtag_instence.append(hashtag)

            print(hashtag)
        print("id:",hashtag_instence)
        mutable_data = request.data
        # Update the request data with the hashtag instances
        mutable_data['hashtag'] = [hashtag.id for hashtag in hashtag_instence]
        print("kkk",mutable_data['hashtag'])
        print("dataaftercreatinhash:",mutable_data)

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        print("serlizerwithoutdata:",serializer)
        
        self.perform_create(serializer)
        serializer.instance.hashtag.set(hashtag_instence)
        print("serlizerd:",serializer.data)

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
        remaining_posts = Posts.objects.exclude(Q(likes__user=liked_user) | Q(user=liked_user)| Q(id__in=recommended_posts.values('id')))
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



class SavesListCreateView(generics.ListCreateAPIView):
    queryset = Saves.objects.all()
    serializer_class = SavesSerializer
    permission_classes = [IsAuthenticated]

class LikesListCreateView(generics.ListCreateAPIView):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [IsAuthenticated]

class SharesListCreateView(generics.ListCreateAPIView):
    queryset = Shares.objects.all()
    serializer_class = SharesSerializer
    permission_classes = [IsAuthenticated]