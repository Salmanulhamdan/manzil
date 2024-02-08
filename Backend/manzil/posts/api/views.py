from django.shortcuts import get_object_or_404
from rest_framework import viewsets,generics,permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from user.models import CustomUser, Professions
from posts.models import Answers, Hashtags, Posts, Qustions, Report,Saves, Likes, Shares,Requirment, intrests
from .serializers import AnswersSerializer, HashtagSerializer, IntrestsSerializer, PostSerializer, PostSerializer_for_Report, QuestionSerializer, ReportItemSerializer, ReportSerializer, RequirmentSerializer,SavesSerializer, LikesSerializer, SharesSerializer
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
        # newdata['hashtag'] = [hashtag.id for hashtag in hashtag_instence]
        newdata['user'] = user.id
        print(newdata,"hh")
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
        print(post_pk,"saaa")  
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
        profession_id = newdata.get('profession')
        print(f"Profession ID from request data: {profession_id}")

        if not profession_id:
            return Response({'error': 'Profession is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Assuming your 'Professions' model has an 'id' field
        try:
            profession = Professions.objects.get(id=profession_id)
        except Professions.DoesNotExist:
            return Response({'error': 'Invalid profession ID.'}, status=status.HTTP_400_BAD_REQUEST)
        newdata['user'] = user.id
        newdata['profession']=profession.id
        print(f"New data before serializer: {newdata}")
        serializer = self.get_serializer(data=newdata)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['profession'] = profession
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
        
    def destroy(self, request, pk=None):
        try:
            print(pk,"pk")
            user=request.user
            print(user,"ggg")
            instance = Requirment.objects.get(pk=pk)
            print(instance.user,"ggg")
            if user==instance.user:
                instance.delete()
                return Response({"detail": "Deleted"},status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "you are not the owner of the Requirment."}, status=status.HTTP_400_BAD_REQUEST)

        except Requirment.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        


class EditRequirment(generics.UpdateAPIView):
    queryset = Requirment.objects.all()
    serializer_class = RequirmentSerializer
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
    
    @action(detail=False, methods=['GET'])
    def get_inrests(self, request):
        try:
            requirment=request.data.get('requirment')
            all_intrests=intrests.objects.filter(requirment=requirment)
            serlized_data=self.get_serializer(all_intrests,many=True)

            return Response(serlized_data.data, status=status.HTTP_200_OK)
        
        except intrests.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        

    





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
        
    def destroy(self, request, pk=None):
        try:
            print(pk,"pk")
            user=request.user
            print(user,"ggg")
            instance = Qustions.objects.get(pk=pk)
            print(instance.user,"ggg")
            if user==instance.user:
                instance.delete()
                return Response({"detail": "Deleted"},status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "you are not the owner of the qustion."}, status=status.HTTP_400_BAD_REQUEST)

        except Qustions.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        

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
        
    def destroy(self, request, pk=None):
        try:
            print(pk,"pk")
            user=request.user
            print(user,"ggg")
            instance = Answers.objects.get(pk=pk)
            print(instance.user,"ggg")
            if user==instance.user:
                instance.delete()
                return Response({"detail": "Deleted"},status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "you are not the owner of the Answers."}, status=status.HTTP_400_BAD_REQUEST)

        except Answers.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        


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


  



    
class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes=[IsAuthenticated]

    @action(detail=False, methods=['post'])
    def report_item(self, request):
        print("kk")
        user = request.user
        reason = request.data.get('reason', '')
        report_type=request.data.get('report_type')
        item_id=request.data.get('item_id')
        print(item_id,"idd")

        if report_type in ['requirement', 'question', 'post']:
            model_mapping = {
                'requirement': Requirment,
                'question': Qustions,
                'post': Posts,
            }

            model = model_mapping[report_type]
            item = model.objects.get(pk=item_id)
            existing_report = Report.objects.filter(
                user=user,
                reported_item_id=item_id,
                report_type=report_type
            ).first()

            if existing_report:
                existing_report.delete()
                return Response({"detail": "Deleted"},status=status.HTTP_204_NO_CONTENT)

            Report.objects.create(
                user=user,
                reported_item_id=item_id,
                report_type=report_type,
                reason=reason,
            )

            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': 'Invalid report type'}, status=status.HTTP_400_BAD_REQUEST)
        
   

class DeleteReportsByItemAndType(APIView):
    

    def post(self, request, *args, **kwargs):
        reported_item_id = request.data.get('reported_item_id')
        report_type = request.data.get('report_type')

        if not reported_item_id or not report_type:
            return Response({'error': 'reported_item_id and report_type are required fields.'},
                            status=status.HTTP_400_BAD_REQUEST)

        reports_to_delete = Report.objects.filter(reported_item_id=reported_item_id, report_type=report_type)

        if not reports_to_delete.exists():
            return Response({'message': 'No reports found for the specified criteria.'},
                            status=status.HTTP_404_NOT_FOUND)

        reports_to_delete.delete()

        return Response({'message': 'Reports deleted successfully.'}, status=status.HTTP_200_OK)
    

class BlockItembyAdmin(APIView):

    def patch(self, request, *args, **kwargs):
        reported_item_id = request.data.get('reported_item_id')
        report_type = request.data.get('report_type')

        if not reported_item_id or not report_type:
            return Response({'detail': 'Missing reported_item_id or report_type in the request.'}, status=status.HTTP_400_BAD_REQUEST)

        if report_type == 'post':
            try:
                post_to_block = Posts.objects.get(pk=reported_item_id)
                post_to_block.is_blocked = True
                post_to_block.save()
                return Response({'detail': 'Post blocked successfully.'}, status=status.HTTP_200_OK)
            except Posts.DoesNotExist:
                return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'detail': 'Invalid report type.'}, status=status.HTTP_400_BAD_REQUEST)






        



class ReportedItemsView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request, *args, **kwargs):
        reported_items = Report.objects.values('report_type', 'reported_item_id').annotate(report_count=Count('id'))
        print(reported_items,"kkk")
        serialized_reported_items = []

        for item in reported_items:
            report_serializer = ReportItemSerializer(data=item)
            print(report_serializer,"serlizwe")
            if report_serializer.is_valid():
                print("valid")
                report_data = report_serializer.validated_data
                print(report_data,"rrrrrrrrrrrrrrrrrrrrrrrr")
                report_data['report_count'] = item['report_count']
                report_data['reasons'] = self.get_report_reasons(item['report_type'], item['reported_item_id'])
                report_data['item_details'] = self.get_item_details(item['report_type'], item['reported_item_id'])
                serialized_reported_items.append(report_data)

                print(serialized_reported_items,"kkkddd")
            else:
                print("notvalid")

        return Response({'reported_items': serialized_reported_items}, status=status.HTTP_200_OK)

    def get_report_reasons(self, report_type, reported_item_id):
        reasons = Report.objects.filter(report_type=report_type, reported_item_id=reported_item_id).values_list('reason', flat=True)
        print(reasons,"reasonss")
        return list(reasons)

    def get_item_details(self, report_type, reported_item_id):
        print("itemdetailll")
        # Customize this based on your actual models and relationships
        if report_type == 'post':
            try:
                post = Posts.objects.get(id=reported_item_id)
                print(post,"poosssst")
                post_serializer = PostSerializer_for_Report(post)
                return post_serializer.data
            except Posts.DoesNotExist:
                return None
        # Add more conditions for other report types if needed
        return None
