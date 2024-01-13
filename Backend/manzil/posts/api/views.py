from django.shortcuts import get_object_or_404
from rest_framework import viewsets,generics,permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from user.models import CustomUser
from posts.models import Answers, Hashtags, Posts, Qustions,Saves, Likes, Shares,Requirment, intrests
from .serializers import AnswersSerializer, HashtagSerializer, IntrestsSerializer, PostSerializer, QuestionSerializer, RequirmentSerializer,SavesSerializer, LikesSerializer, SharesSerializer
from django.db.models import Q
from rest_framework.views import APIView
from django.db.models import Subquery

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
        serializer = self.get_serializer(data=newdata)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        serializer.instance.hashtag.set(hashtag_instence)

        
       

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    @action(detail=False, methods=['GET'])
    def recommended_posts(self, request):
        # Get the user who liked the posts
        liked_user = request.user  

        # Get the hashtags of posts liked by the user
        liked_post_hashtags = Hashtags.objects.filter(posts__likes__user=liked_user)
  

        # Find other posts with similar hashtags
        recommended_posts = (Posts.objects.filter(hashtag__in=liked_post_hashtags).exclude(Q(likes__user=liked_user) | Q(user=liked_user)).distinct())
        print("recomende",recommended_posts)
        


        # Serialize all posts excluding liked and own posts
        remaining_posts = Posts.objects.exclude(Q(user=liked_user)| Q(id__in=recommended_posts.values('id')))
        print("remainif",remaining_posts)
        remaining_posts_serializer = self.get_serializer(remaining_posts, many=True)



        # Serialize recommended posts
        recommended_posts_serializer = self.get_serializer(recommended_posts, many=True)
        # Combine the two lists (recommended posts followed by other posts)
        combined_posts = recommended_posts_serializer.data + remaining_posts_serializer.data

        
        

        return Response(combined_posts)
    
    @action(detail=False, methods=['GET'])
    def user_posts(self,request):
        user=request.user
        posts=Posts.objects.filter(user=user)
        posts_count = posts.count()
        serlized_post=self.get_serializer(posts,many=True)
        response_data = {
            'posts': serlized_post.data,
            'posts_count': posts_count,
        }

        return Response(response_data)
    
    @action(detail=True, methods=['GET'])
    def get_user_posts_by_id(self, request, pk=None):
            
        target_user = get_object_or_404(CustomUser, pk=pk)
        print(target_user,"jjj")
        posts = Posts.objects.filter(user=target_user)
        serialized_posts = self.get_serializer(posts, many=True)
        
        return Response(serialized_posts.data)
    
    def delete(self, request, pk=None):
        post = self.get_object()
        # Check if the user making the request is an admin
        if not request.user.is_staff:
            # If not an admin, check if the user is the owner of the post
            if request.user != post.user:
                return Response({'error': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()

        return Response({'success': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    
class EditPostView(generics.UpdateAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Check if hashtags are provided in the request
        hashtags_data = request.data.get('hashtag', [])
        hashtagssplit = hashtags_data.split(',')
        if hashtagssplit:
            # Assuming 'hashtag' is a list of strings representing hashtags
            hashtags = []
            for hashtag_text in hashtagssplit:
                hashtag, created = Hashtags.objects.get_or_create(hashtag=hashtag_text)
                hashtags.append(hashtag)

            # Update the post's hashtags
            instance.hashtag.set(hashtags)

        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)



class SavesPostView(viewsets.ModelViewSet):
    queryset = Saves.objects.all()
    serializer_class = SavesSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def save_post(self, request):
        post_pk = request.data.get('post')  
        post = Posts.objects.get(pk=post_pk)
        user = request.user

        # Check if the user has already liked the post
        existing_savedpost=Saves.objects.filter(post=post, user=user).first()
        if existing_savedpost:
            # User has already liked the post, unlike it
            existing_savedpost.delete()
            return Response({"detail": "Post unsaved successfully."}, status=status.HTTP_200_OK)

        Save_post = Saves(post=post, user=user)
        Save_post.save()

        return Response({"detail": "Post saved successfully."}, status=status.HTTP_201_CREATED)



class LikesViewSet(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def like_post(self, request):
        post_pk = request.data.get('post')  
        post = Posts.objects.get(pk=post_pk)
        user = request.user

        # Check if the user has already liked the post
        existing_like=Likes.objects.filter(post=post, user=user).first()
        if existing_like:
            # User has already liked the post, unlike it
            existing_like.delete()
            return Response({"detail": "Post unliked successfully."}, status=status.HTTP_200_OK)

        like = Likes(post=post, user=user)
        like.save()
        total_likes = Likes.objects.filter(post=post).count()

        return Response({"detail": "Post liked successfully.","total_likes": total_likes}, status=status.HTTP_201_CREATED)
    

class LikedPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        # Retrieve liked posts for the logged-in user
        user = request.user
        userliked=Likes.objects.filter(user=user)
        post_serializer = PostSerializer([liked_post.post for liked_post in userliked], many=True,context={'request':request})
        return Response(post_serializer.data, status=status.HTTP_200_OK)
    



class SavedPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_saved_posts = Saves.objects.filter(user=request.user)
        post_serializer = PostSerializer([saved_post.post for saved_post in user_saved_posts], many=True,context={'request':request})
    
        return Response(post_serializer.data, status=status.HTTP_200_OK)

   


class SharesListCreateView(generics.ListCreateAPIView):
    queryset = Shares.objects.all()
    serializer_class = SharesSerializer
    permission_classes = [IsAuthenticated]




class RequirmentViewset(viewsets.ModelViewSet):
    queryset=Requirment.objects.all()
    serializer_class = RequirmentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user=request.user
        newdata=request.data.copy()
        newdata['user'] = user.id
        serializer = self.get_serializer(data=newdata)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    @action(detail=False, methods=['GET'])
    def get_requirments(self, request):
        try:
            user = request.user
            if hasattr(user, 'professional_profile'):
                profession = user.professional_profile.profession

                # Get the requirements excluding those the user has shown interest in
                requirements_not_intrested = Requirment.objects.exclude(intrested__user=user).exclude(user=user).exclude(profession=profession)

                serializer = self.get_serializer(requirements_not_intrested, many=True)
                return Response(serializer.data, status=200)

            return Response({"detail": "User is not a professional."}, status=403)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)
    
    @action(detail=False, methods=['GET'])
    def get_myrequirments(self,request):
        try:
            user =request.user
            requirments=Requirment.objects.filter(user=user)
            serlizer=self.get_serializer(requirments,many=True)
            return Response(serlizer.data,status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)
        
    


class IntrestsViewset(viewsets.ModelViewSet):
    queryset=intrests.objects.all()
    serializer_class=IntrestsSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user=request.user
        requirment=request.data.get('requirment')
        existing_interest = intrests.objects.filter(user=user,requirment=requirment).first()
        if existing_interest:
            return Response({"detail": "User already has an interest."}, status=status.HTTP_400_BAD_REQUEST)

        newdata=request.data.copy()
        newdata['user'] = user.id
        serializer = self.get_serializer(data=newdata)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
 
        return Response(serializer.data, status=status.HTTP_201_CREATED)





class QustionViewset(viewsets.ModelViewSet):
    queryset=Qustions.objects.all()
    serializer_class=QuestionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("gglll")
        user=request.user
        newdata=request.data.copy()
        print(newdata,"newdata")
        newdata['user'] = user.id
        serializer = self.get_serializer(data=newdata)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        print(serializer,"daata")
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        # Get the logged-in user
        logged_in_user = self.request.user

        # Exclude questions asked by the logged-in user and questions they have answered
        return Qustions.objects.exclude(user=logged_in_user) \
                               .exclude(answers_to_question__user=logged_in_user) \
                               .annotate(num_answers=Count('answers_to_question')) \
                               .order_by('-num_answers')
    

    @action(detail=False, methods=['GET'])
    def get_myqustions(self,request):
        try:
            user=request.user
            qustions=Qustions.objects.filter(user=user)
            serlizer=self.get_serializer(qustions,many=True)
            return Response(serlizer.data,status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)
        

class EditQustionView(generics.UpdateAPIView):
    queryset = Qustions.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user=request.user
        instance = self.get_object()
        if user==instance.user:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            print(instance.user.username,"instance")

            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "you are not the owner of the qustion."}, status=status.HTTP_400_BAD_REQUEST)


  

    


class AnswersViewSet(viewsets.ModelViewSet):
    queryset = Answers.objects.all()
    serializer_class = AnswersSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Associate the logged-in user with the answer
        serializer.save(user=self.request.user)

    def get_queryset(self):
        print("answere")
        # Retrieve answers based on the specific question
        question_id = self.request.query_params.get('question')
        print(question_id)
        print(Answers.objects.filter(qustion=question_id))
        if question_id:
            return Answers.objects.filter(qustion=question_id)
        


class AnswerEditView(generics.UpdateAPIView):
    queryset=Answers.objects.all()
    serializer_class=AnswersSerializer
    permission_classes=[IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user=request.user
        instance = self.get_object()
        if user==instance.user:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            print(instance.user.username,"instance")

            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "you are not the owner of the answer."}, status=status.HTTP_400_BAD_REQUEST)


  



    
