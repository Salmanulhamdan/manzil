from django.shortcuts import render
from user.api.serializers import Custom_user_serializer,Login_serializer_user
from rest_framework.views import APIView
from rest_framework.authentication import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from user.models import CustomUser


# Create your views here.
# user creation
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

        if serializer.is_valid(raise_exception=True):
            """
            If the data is validated, the password is hashed, and a new user is created.
            Return with generated JWT tokens.
            """

            # Creating user and setting the password (save() doesn't hash the password)
            hashed_password = make_password(serializer.validated_data["password"])
            user = CustomUser.objects.create_user(
                username=serializer.validated_data["username"],
                usertype=serializer.validated_data["usertype"],
                email=serializer.validated_data["email"],
                phonenumber=serializer.validated_data["phonenumber"],
                password=hashed_password,
                profile_photo=serializer.validated_data.get("profile_photo"),
            )

           
            # Remove password from the response and send the response
            response_data = serializer.data
            response_data.pop("password")

           

            return Response(response_data, status=201)
        
# login
class login(APIView):
  
    serializer_class = Login_serializer_user
    permission_classes = [AllowAny]

    def post(self, reuqest, format=None):
        """
        validating the user credencials and generating access and regresh
        jwt tocken if the user is validated otherwise return error message
        """
        print("request hit")
        # serializing data
        seriazed_data = self.serializer_class(data=reuqest.data)

        # validating credencians, if credencials invalied error message
        # automatically send to frond end
        if seriazed_data.is_valid(raise_exception=True):
  
            # fetching credencials for validation
            email = seriazed_data.validated_data["email"]
            password = seriazed_data.validated_data["password"]

            # authenticate func returns user instence if authenticated
            user = authenticate(email=email, password=password)

            # if user is authenticated generate jwt
            if user is not None:
  
                print("login success")
                # generating jwt tocken
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token

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