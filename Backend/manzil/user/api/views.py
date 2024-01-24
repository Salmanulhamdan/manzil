from django.shortcuts import render
import razorpay
from user.api.serializers import Custom_user_serializer, HouseownerProfileSerializer,Login_serializer_user,GetUserSerializer, PlanSerializer, ProfessionalsProfileSerializer, ProfilePhotoUpdateSerializer, UserUpdateSerializer,UserPlanSerializer, UserProfileStatusSerializer,ProfessionsSerializer
from rest_framework.views import APIView
from rest_framework.authentication import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from user.models import CustomUser, Follow,HouseownerProfile, Plan, ProfessionalsProfile,Professions,UserPlan
from rest_framework import status,viewsets
from posts.models import Posts
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import serializers,generics
import logging
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from decouple import config 
from rest_framework.decorators import api_view, permission_classes
from chat.models import Message

# Create your views here.
# user creation
# user typeselection
logger = logging.getLogger(__name__)

class Signup(APIView):
    permission_classes = [AllowAny]
    serializer_class = Custom_user_serializer

    def post(self, request, format=None):
        try:
            """
            Create a new user, receive request.data and serialize it. If validated,
            create a new user and return newly generated JWT access and refresh tokens.
            """
            # Serializing request.data
            serializer = self.serializer_class(data=request.data)
            selected_user_type = request.data.get('usertype', None)
            place=request.data.get('place',None)

            if serializer.is_valid(raise_exception=True):
                
                """
                If the data is validated, the password is hashed, and a new user is created.
                Return with generated JWT tokens.
                """

                user = CustomUser.objects.create_user(
                    username=serializer.validated_data["username"],
                    usertype=selected_user_type,
                    email=serializer.validated_data["email"],
                    phonenumber=serializer.validated_data["phonenumber"],
                    password=serializer.validated_data["password"],
                    profile_photo=serializer.validated_data.get("profile_photo"),

                )
       
                if selected_user_type=="houseowner":
                    user.houseowner_profile.place = place
                    user.houseowner_profile.save()
                else:
                    profession=request.data.get('profession',None)
               
                    professional_instance = Professions.objects.get(profession_name=profession)
                    experience=request.data.get('experience',None)
                    user.professional_profile.place=place
                    user.professional_profile.profession=professional_instance
                    user.professional_profile.experience=experience
                    user.professional_profile.save()
                response_data = serializer.data
                response_data.pop('password')
                
                return Response(response_data, status=201)
        except serializers.ValidationError as e:
            error_messages = []

            for field, errors in e.detail.items():
                field_errors = ', '.join([f"{field}: {str(error)}" for error in errors])
                error_messages.append(field_errors)

            error_message = ', '.join(error_messages)
     

            logger.error(f"Validation error: {error_message}")
                    
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
    
            
# login
class login(APIView):
  
    serializer_class = Login_serializer_user
    permission_classes = [AllowAny]

    def post(self, reuqest, format=None):
        """
        validating the user credencials and generating access and refresh
        jwt tocken if the user is validated otherwise return error message
        """

        # serializing data
        seriazed_data = self.serializer_class(data=reuqest.data)

        # validating credencians, if credencials invalied error message
        # automatically send to frond end
        if seriazed_data.is_valid(raise_exception=True):
  
            # fetching credencials for validation
            email = seriazed_data.validated_data['email']
            password = seriazed_data.validated_data['password']
            user1=CustomUser.objects.get(email=email)
            username=user1.username
    
            # authenticate func returns user instence if authenticated
            user = authenticate(email=email, password=password)
            # if user is authenticated generate jwt
            if user is not None:
                # generating jwt tocken
                refresh = RefreshToken.for_user(user)
                refresh['email'] = user.email
                refresh['is_superuser'] = user.is_superuser
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
         
                # returning response with access and refresh tocken
                # refresh tocken used to generate new tocken before tockens session expired
                return Response(
                    {
                        "email": email,
                        "password": password,
                        "access": access_token,
                        "refresh": refresh_token,
                        "username":username,
                    },
                    status=201,
                )

            # if user none, wrong email or passord
            else:
                return Response({"details": "wrong email or password"}, status=401)


# get details of logged in user
class GetUserView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
 
    def get(self,request):

    
        user_email = request.user
      
        user_details = CustomUser.objects.get(email=user_email)
        serializer = GetUserSerializer(instance=user_details)

        return Response(serializer.data,status=200)
    

#social_login
class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter








#--------------------------------------------------adminside----------------------------------------------#

class RegisteredUsers(APIView):
 
    def get(self,request):
        users = CustomUser.objects.filter(is_superuser=False)
        serializer = Custom_user_serializer(instance=users, many=True)
        return Response(serializer.data,status=200)

# get details of user with a  email
class UserDetail(APIView):
 
    def get(self,request,userEmail):
        detail = CustomUser.objects.get(email=userEmail)
        serializer = Custom_user_serializer(instance=detail)
        return Response(serializer.data,status=200)

    
# block user with id
class BlockUser(APIView):
    def patch(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
            b = user.is_active
            user.is_active = not b
 
            user.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


        
#deletepostbyadmin
class DeletePost(APIView):
    def delete(self,request,id):
        try:
            p = Posts.objects.get(id=id)
            p.delete()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            print("post not found")
            return Response({"message": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        



#plancrudoperations

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class UserPlanViewSet(viewsets.ModelViewSet):
    queryset = UserPlan.objects.all()
    serializer_class = UserPlanSerializer
    permission_classes = [IsAuthenticated]
   
    def create(self,request,*args, **kwargs):
        user = request.user
        print(user)
        print(request.data)
        serializer=self.get_serializer(data=request.data)

        # Check if a UserPlan already exists for the user
        existing_user_plan = UserPlan.objects.filter(user=user).first()

        if existing_user_plan:
           return Response(existing_user_plan,status=200)
        else:
            # Create a new UserPlan
            serializer.is_valid(raise_exception=True)
            serializer.validated_data['user'] = user
            serializer.save()

        # Update the user profile's upgraded field based on the plan type
        if hasattr(user, 'professional_profile'):
            user.professional_profile.upgraded = True
            user.professional_profile.save()
        elif hasattr(user, 'houseowner_profile'):
            user.houseowner_profile.upgraded = True
            user.houseowner_profile.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)





class RazorpayOrderView(APIView):

    # @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            plan_id = request.data.get('planId')
            amount = request.data.get('amount')


            # Initialize Razorpay client with environment variables
            client = razorpay.Client(auth=(config('RAZORPAY_KEY_ID'), config('RAZORPAY_KEY_SECRET')))
            # Create a Razorpay order
            order_params = {
                'amount': float(amount) * 100,  # Amount in paise
                'currency': 'INR',
                'receipt': 'receipt_id',  # Replace with a unique identifier for the order
                'payment_capture': 1,
                'notes': {
                    'plan_id': plan_id,
                    'key':config('RAZORPAY_KEY_ID'),
                },
            }
            

            order = client.order.create(data=order_params)

            return Response(order, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class MyProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        if user.usertype == 'professional':
            profile = ProfessionalsProfile.objects.get(user=user)
            serializer = ProfessionalsProfileSerializer(profile)
        elif user.usertype == 'houseowner':
            profile = HouseownerProfile.objects.get(user=user)
            serializer = HouseownerProfileSerializer(profile)
        else:
            # Handle other user types as needed
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
       

        if user.usertype == 'professional':
            profile = ProfessionalsProfile.objects.get(user=user)
            serializer = ProfessionalsProfileSerializer(profile, data=request.data)
        elif user.usertype == 'houseowner':
            profile = HouseownerProfile.objects.get(user=user)
            serializer = HouseownerProfileSerializer(profile, data=request.data)
        else:
            # Handle other user types as needed
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class FollowUnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        logged_in_user = request.user
        try:
            user_to_follow = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if logged_in_user == user_to_follow:
            return Response({"detail": "You cannot follow/unfollow yourself."},status=status.HTTP_400_BAD_REQUEST,)

        try:
            follow_instance = Follow.objects.get(follower=logged_in_user, following=user_to_follow)
            follow_instance.delete()
            return Response({"detail": "You have unfollowed this user."}, status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            follow_instance = Follow(follower=logged_in_user, following=user_to_follow)
            follow_instance.save()
           
            return Response({"detail": "You are now following this user."},status=status.HTTP_201_CREATED,)
class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,userId,*args, **kwargs):
         
        user=CustomUser.objects.get(pk=userId)

        if user.usertype == 'professional':
            profile = ProfessionalsProfile.objects.get(user=user)
            serializer = ProfessionalsProfileSerializer(profile)
        elif user.usertype == 'houseowner':
            profile = HouseownerProfile.objects.get(user=user)
            serializer = HouseownerProfileSerializer(profile)
        else:
            # Handle other user types as needed
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)
    


class UserProfileStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user

        if hasattr(user, 'houseowner_profile'):
            upgraded = user.houseowner_profile.upgraded
        elif hasattr(user, 'professional_profile'):
            upgraded = user.professional_profile.upgraded
        else:
            upgraded = False

        serializer = UserProfileStatusSerializer({'upgraded': upgraded})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProfilePhotoUpdateAPIView(generics.UpdateAPIView):
    serializer_class = ProfilePhotoUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    


class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        print(self.request.user,"kkksadq")
        return self.request.user
    
    def put(self, request, *args, **kwargs):
        print("put enabled")
        user = self.request.user
        print(user, "killlo")
        print(request.data)

        # Extract nested data for houseowner_profile
        if user.usertype == "houseowner":
            print("houseowner")
            houseowner_profile_data = {
                'place': request.data.get('place', None),
            }
            combined_data = {
                **request.data,
                'houseowner_profile': houseowner_profile_data
            }
        else:
            # Extract nested data for professional_profile
            professional_profile_data = {
                'place': request.data.get('place', None),
                'profession': request.data.get('profession', None),
                'experience': request.data.get('experience', None),
                'bio': request.data.get('bio', None),
            }
            combined_data = {
                **request.data,
                'professional_profile': professional_profile_data,
            }

        # Create a combined data dictionary
        serializer = UserUpdateSerializer(user, data=combined_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ProfessionsViewSet(viewsets.ModelViewSet):
    queryset = Professions.objects.all()
    serializer_class = ProfessionsSerializer





class ContactListvView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        user = self.request.user
        print(user)
        followers = user.followers.all()
        following = user.following.all()
        unique_user_ids = set()
        response_data = []
        
        for follower in followers:
            if follower.follower.id not in unique_user_ids and follower.follower != user:
                follower_data = {
                    "id": follower.follower.id,
                    "username": follower.follower.username,
                    "profile_pic": follower.follower.profile_photo.url
                        if follower.follower.profile_photo else None,
                    # "last_login": follower.follower.last_login,
                }
                # Count unread messages for this follower
                unread_message_count = Message.objects.filter(
                    room__members=user, sender=follower.follower, is_seen=False
                ).count()
                follower_data["unseen_message_count"] = unread_message_count
                response_data.append(follower_data)
                unique_user_ids.add(follower.follower.id)
        
        for followed in following:
            if followed.following.id not in unique_user_ids and followed.following != user:
                following_data = {
                    "id": followed.following.id,
                    "username": followed.following.username,
                    "profile_pic": followed.following.profile_photo.url
                        if followed.following.profile_photo else None,
                    # "last_login": followed.following.last_login,
                }
                # Count unread messages for this followed user
                unread_message_count = Message.objects.filter(
                    room__members=user, sender=followed.following, is_seen=False
                ).count()
                following_data["unread_message_count"] = unread_message_count
                response_data.append(following_data)
                unique_user_ids.add(followed.following.id)

        return Response(response_data)
