from django.shortcuts import render
from user.api.serializers import Custom_user_serializer,Login_serializer_user,UserTypeSelectionSerializer,HouseownerProfileSerializer
from rest_framework.views import APIView
from rest_framework.authentication import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from user.models import CustomUser,HouseownerProfile

from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView

# Create your views here.
# user creation
# user typeselection
class UserTypeSelection(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserTypeSelectionSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # Return the selected user type
            user_type = serializer.validated_data['usertype']
            return Response({'usertype': user_type}, status=201)



class Signup(APIView):
    permission_classes = [AllowAny]
    serializer_class = Custom_user_serializer

    def post(self, request, format=None):
        """
        Create a new user, receive request.data and serialize it. If validated,
        create a new user and return newly generated JWT access and refresh tokens.
        """
        # Serializing request.data
        serializer = self.serializer_class(data=request.data)
        print("hh",request.data)
        print(serializer,"ended")
        selected_user_type = request.data.get('usertype', None)

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
            # print(user.usertype)
            # if selected_user_type=="houseowner":
            #     print(request.data.get('place',None))
            #     # print(place)
            #     profile_serilizer=HouseownerProfileSerializer(data="kkk")
            #     if profile_serilizer.is_valid(raise_exception=True):
            #         print("validated")


            #         houseowner=HouseownerProfile.objects.create(
            #         user=user,
            #         place=profile_serilizer.validated_data["place"]
            #     )

            
            # Remove password from the response and send the response
            response_data = serializer.data

            print("f",user)

            response_data.pop('password')

           

            return Response(response_data, status=201)
        
# login
class login(APIView):
  
    serializer_class = Login_serializer_user
    permission_classes = [AllowAny]

    def post(self, reuqest, format=None):
        """
        validating the user credencials and generating access and refresh
        jwt tocken if the user is validated otherwise return error message
        """
        print("request hit")
        # serializing data
        seriazed_data = self.serializer_class(data=reuqest.data)

        # validating credencians, if credencials invalied error message
        # automatically send to frond end
        if seriazed_data.is_valid(raise_exception=True):
  
            # fetching credencials for validation
            email = seriazed_data.validated_data['email']
            password = seriazed_data.validated_data['password']
            user1=CustomUser.objects.get(email=email)
            # authenticate func returns user instence if authenticated
            user = authenticate(email=email, password=password)
            # if user is authenticated generate jwt
            if user is not None:
                # generating jwt tocken
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token
                print(access)

                # returning response with access and refresh tocken
                # refresh tocken used to generate new tocken before tockens session expired
                return Response(
                    {
                        "email": email,
                        "password": password,
                        "access": str(access),
                        "refresh": str(refresh),
                    },
                    status=201,
                )

            # if user none, wrong email or passord
            else:
                return Response({"details": "wrong email or password"}, status=401)
            

#social_login
class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter



#--------------------------------------------------adminside----------------------------------------------#

#adminlogin
# class AdminLogin(APIView):
    
    