from django.shortcuts import render
from user.api.serializers import Custom_user_serializer,Login_serializer_user,GetUserSerializer, PlanSerializer,UserPlanSerializer
from rest_framework.views import APIView
from rest_framework.authentication import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from user.models import CustomUser,HouseownerProfile, Plan,Professions,UserPlan
from rest_framework import status,viewsets
from posts.models import Posts
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import serializers,generics
import logging
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView

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
            # print("hh",request.data)
            # print(serializer,"ended")
            selected_user_type = request.data.get('usertype', None)
            print(selected_user_type)
            place=request.data.get('place',None)

            if serializer.is_valid(raise_exception=True):
                print("serlizr valid")
                """
                If the data is validated, the password is hashed, and a new user is created.
                Return with generated JWT tokens.
                """

                # Creating user and setting the password (save() doesn't hash the password)
                # hashed_password = make_password(serializer.validated_data["password"])
                user = CustomUser.objects.create_user(
                    username=serializer.validated_data["username"],
                    usertype=selected_user_type,
                    email=serializer.validated_data["email"],
                    phonenumber=serializer.validated_data["phonenumber"],
                    password=serializer.validated_data["password"],
                    profile_photo=serializer.validated_data.get("profile_photo"),

                )
                print(user.usertype)
                if selected_user_type=="houseowner":
                    user.houseowner_profile.place = place
                    user.houseowner_profile.save()
                else:
                    profession=request.data.get('profession',None)
                    print(profession)
                    professional_instance,create=Professions.objects.get_or_create(profession_name=profession)
                    experience=request.data.get('experience',None)
                    user.professional_profile.place=place
                    user.professional_profile.profession=professional_instance
                    user.professional_profile.experience=experience
                    user.professional_profile.save()
                response_data = serializer.data

                print("f",user)

                response_data.pop('password')

            

                return Response(response_data, status=201)
        except serializers.ValidationError as e:
            error_messages = []

            for field, errors in e.detail.items():
                field_errors = ', '.join([f"{field}: {str(error)}" for error in errors])
                error_messages.append(field_errors)

            error_message = ', '.join(error_messages)
            print(error_message)

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
        print("request hit.....")
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
            print(username)
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
                print(access_token)
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
        print(request.user)
        user_details = CustomUser.objects.get(email=user_email)
        serializer = GetUserSerializer(instance=user_details)
        print(serializer.data)
        return Response(serializer.data,status=200)

class GetOneUser(APIView):
 
    def get(self,request,userId):
        print(" requested for details of user")
        detail = CustomUser.objects.get(pk=userId)
        print(detail)
        serializer = GetUserSerializer(instance=detail)
        return Response(serializer.data,status=200)
            

#social_login
class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter



class UserPlanCreateView(generics.CreateAPIView):
    queryset = UserPlan.objects.all()
    serializer_class = UserPlanSerializer




#--------------------------------------------------adminside----------------------------------------------#

class RegisteredUsers(APIView):
 
    def get(self,request):
        users = CustomUser.objects.filter(is_superuser=False)
        serializer = GetUserSerializer(instance=users, many=True)
        return Response(serializer.data,status=200)

# get details of user with a  email
class UserDetail(APIView):
 
    def get(self,request,userEmail):
        print(" requested for details of user")
        detail = CustomUser.objects.get(email=userEmail)
        print(detail)
        serializer = GetUserSerializer(instance=detail)
        return Response(serializer.data,status=200)

    
# block user with id
class BlockUser(APIView):
    def patch(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
            print(user.is_active,"in block fun checking user")
            b = user.is_active
            user.is_active = not b
            print(user.is_active,"after change")
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