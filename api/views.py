from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.db.models import Q, Count, Case, When, IntegerField, F
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.db.models.functions import ExtractYear, ExtractMonth, ExtractDay
from django.utils.timezone import now

from rest_framework import status, viewsets, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .forms import UserCreationForm
from .models import MyUser, FriendRequest, Friend, Hobby, Friend
from .serializers import HobbySerializer, MyUserSerializer

from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import SessionAuthentication


# ==============================
# Main SPA View
# ==============================

def main_spa(request: HttpRequest) -> HttpResponse:
    return render(request, 'api/spa/signup.html', {})

# ==============================
# User Authentication Views
# ==============================


def login_view(request):
    """Handles user login."""
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect("http://localhost:5173/")  # Send to the vue app
        else:
            messages.error(request, "Invalid login credentials. Please try again.")
            return render(request, 'login.html', {'form': form})  # Stay on the login page and show errors

    # render the empty form
    form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def check_session_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'message': 'User is authenticated', 'user': request.user.email})
    return JsonResponse({'message': 'User is not authenticated'})


def signup_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.name = form.cleaned_data.get("name")
            user.date_of_birth = form.cleaned_data.get("date_of_birth")
            user.save()

            # Log the user in
            login(request, user)
            messages.success(request, "Signup successful! You are now logged in.")
            return redirect("/")
        else:
            messages.error(request, "Signup failed. Please correct the errors below.")
    else:
        form = UserCreationForm()

    login_form = AuthenticationForm()

    return render(
        request,
        "signup.html",
        {"signup_form": form, "login_form": login_form},
    )


@login_required
def logout_view(request):
    """Logs out the current user and redirects to the home page."""
    logout(request)  # Logs out the user and clears the session
    return redirect('/')  # redirect


@login_required
def current_user(request):
    """Returns the current logged-in user's details."""
    user = request.user
    data = {
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'date_of_birth': user.date_of_birth,
            'hobbies': [{'id': hobby.id, 'name': hobby.name, 'description': hobby.description} for hobby in user.hobbies.all()]
        }
    }
    return JsonResponse(data)

# ==============================
# Profile Management Views
# ==============================


class ProfileAPI(APIView):
    """Handles profile data for the authenticated user."""
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]  # Ensures the user is authenticated

    def get(self, request):
        """Retrieve the logged-in user's profile."""
        serializer = MyUserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Update the logged-in user's profile."""
        serializer = MyUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ProfileView(APIView):
    """Returns a profile of the first user (for testing purposes)."""
    def get(self, request):
        
        user = MyUser.objects.first()
        serializer = MyUserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user  # Get the current logged-in user
        data = request.data

        # Update user profile fields
        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.date_of_birth = data.get("date_of_birth", user.date_of_birth)

        # Update hobbies
        hobby_ids = [hobby["id"] for hobby in data.get("hobbies", [])]  # Extract hobby IDs from the request
        user.hobbies.set(Hobby.objects.filter(id__in=hobby_ids))  # Update hobbies only for the current user

        user.save()

        return JsonResponse({"message": "Profile updated successfully"})

    
    def post(self, request, hobby_name):
        user = request.user
        hobby = Hobby.objects.filter(name=hobby_name).first()
        if hobby:
            user.hobbies.remove(hobby)  # Remove hobby from current user's list
            return JsonResponse({"message": "Hobby removed successfully"})
        else:
            return JsonResponse({"error": "Hobby not found"}, status=404)


# ==============================
# Friend Request Views
# ==============================

class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            # Fetch the pending friend request
            friend_request = FriendRequest.objects.get(id=pk, receiver=request.user, is_accepted=False)

            # Mark the request as accepted
            friend_request.is_accepted = True
            friend_request.save()

            # Create a new friendship
            Friend.objects.create(user1=friend_request.sender, user2=friend_request.receiver)

            # Get the updated friends list
            friends = Friend.objects.filter(user1=request.user) | Friend.objects.filter(user2=request.user)
            friend_data = [
                {
                    "id": friend.id,
                    "friend_id": friend.user2.id if friend.user1 == request.user else friend.user1.id,
                    "friend_name": friend.user2.name if friend.user1 == request.user else friend.user1.name,
                    "created_at": friend.created_at,
                }
                for friend in friends
            ]

            return Response({"detail": "Friend request accepted.", "friends": friend_data}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({"detail": "Friend request not found or already accepted."}, status=status.HTTP_404_NOT_FOUND)

class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all friendships involving the user
        friends = Friend.objects.filter(user1=request.user) | Friend.objects.filter(user2=request.user)
        
       # Serialize the friend data
        serializer = FriendSerializer(friends, many=True, context={"request": request})
        return Response(serializer.data)
    
class FriendSerializer(serializers.ModelSerializer):
    friend_id = serializers.SerializerMethodField()
    friend_name = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ('id', 'friend_id', 'friend_name', 'created_at')

    def get_friend_id(self, obj):
        # Return the other user's ID
        request_user = self.context['request'].user
        return obj.user2.id if obj.user1 == request_user else obj.user1.id

    def get_friend_name(self, obj):
        # Return the other user's name
        request_user = self.context['request'].user
        return obj.user2.name if obj.user1 == request_user else obj.user1.name

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_email = request.data.get("email")
        if not receiver_email:
            # Missing email
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            receiver = MyUser.objects.get(email=receiver_email)
            if receiver == request.user:
                # Sending request to yourself
                return Response(
                    {"detail": "You cannot send a friend request to yourself."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check for existing friend request
            if FriendRequest.objects.filter(sender=request.user, receiver=receiver).exists():
                return Response(
                    {"detail": "Friend request already sent."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Send the friend request
            FriendRequest.objects.create(sender=request.user, receiver=receiver)
            return Response(
                {"detail": "Friend request sent successfully."},
                status=status.HTTP_201_CREATED
            )

        except MyUser.DoesNotExist:
            # User not found
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            # Other error handling
            return Response(
                {"detail": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# View of recieved friend requests
class FriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        received_requests = FriendRequest.objects.filter(receiver=request.user, is_accepted=False)

        data = {
            "received_requests": [
                {"id": req.id, "email": req.sender.email, "name": req.sender.name} for req in received_requests
            ],
        }
        return Response(data, status=status.HTTP_200_OK)

# Accept a friend request
class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            friend_request = FriendRequest.objects.get(id=pk, receiver=request.user, is_accepted=False)
            friend_request.is_accepted = True
            friend_request.save()

            # Create a new Friend record
            Friend.objects.create(user1=friend_request.sender, user2=friend_request.receiver)

            return Response({"detail": "Friend request accepted."}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({"detail": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)

# Reject a friend request
class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            friend_request = FriendRequest.objects.get(id=pk, receiver=request.user, is_accepted=False)
            friend_request.delete()
            return Response({"detail": "Friend request rejected."}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({"detail": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)

# ==============================
# Hobby Views
# ==============================

class HobbyViewSet(viewsets.ModelViewSet):
    """Manages CRUD operations for hobbies."""
    queryset = Hobby.objects.all()
    serializer_class = HobbySerializer

    def create(self, request, *args, **kwargs):
        """Allow users to add hobbies globally."""
        name = request.data.get('name')
        description = request.data.get('description', '')

        # Check if the hobby already exists
        if Hobby.objects.filter(name=name).exists():
            return Response({'error': 'Hobby already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the hobby
        hobby = Hobby.objects.create(name=name, description=description)
        return Response(HobbySerializer(hobby).data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """Retrieve all hobbies."""
        hobbies = self.queryset.order_by("id")  # Order by ID for consistent display
        return Response(HobbySerializer(hobbies, many=True).data)
    

def calculate_shared_hobbies(user1, user2):
    """Calculate the number of shared hobbies between two users."""
    shared_hobbies = user1.hobbies.filter(id__in=user2.hobbies.values_list('id', flat=True))
    return shared_hobbies.count()

class AddHobby(APIView):
    """Allows users to add a new hobby."""
    def post(self, request):
        hobby_name = request.data.get("name")
        user = request.user
        hobby = Hobby.objects.create(name=hobby_name, created_by=user)
        return Response(HobbySerializer(hobby).data)

class SimilarUsersPagination(PageNumberPagination):
    page_size = 10  # Limit results to 10 users per page

class SimilarUserSerializer(serializers.ModelSerializer):
    shared_hobbies_count = serializers.IntegerField()

    class Meta:
        model = MyUser
        fields = ['id', 'name', 'email', 'shared_hobbies_count']

class SimilarUsersAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Fetch users with shared hobbies, filtered by age."""
        current_user = request.user
        user_hobbies = current_user.hobbies.all()

        today = now().date()

        similar_users = MyUser.objects.annotate(
            birth_year=ExtractYear('date_of_birth'),
            birth_month=ExtractMonth('date_of_birth'),
            birth_day=ExtractDay('date_of_birth'),
        ).annotate(
            # Calculate age considering if birthday has passed this year
            age=Case(
                When(
                    Q(birth_month__lt=today.month) |
                    (Q(birth_month=today.month) & Q(birth_day__lte=today.day)),
                    then=today.year - F('birth_year'),
                ),
                default=today.year - F('birth_year') - 1,
                output_field=IntegerField(),
            )
        ).exclude(id=current_user.id).exclude(date_of_birth__isnull=True)

        # Apply age range filters
        min_age = request.query_params.get('min_age')
        max_age = request.query_params.get('max_age')

        if min_age is not None:
            similar_users = similar_users.filter(age__gte=int(min_age))  # Inclusive
        if max_age is not None:
            similar_users = similar_users.filter(age__lte=int(max_age))  # Inclusive

        # Annotate with shared hobbies count and order by it
        similar_users = similar_users.annotate(
            shared_hobbies_count=Count('hobbies', filter=Q(hobbies__in=user_hobbies))
        ).order_by('-shared_hobbies_count')

        # Paginate results
        paginator = SimilarUsersPagination()
        paginated_users = paginator.paginate_queryset(similar_users, request)
        serializer = SimilarUserSerializer(paginated_users, many=True)

        return paginator.get_paginated_response(serializer.data)

class HobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobby
        fields = ['id', 'name', 'description']

class MyUserSerializer(serializers.ModelSerializer):
    hobbies = HobbySerializer(many=True)

    class Meta:
        model = MyUser
        fields = ['id', 'email', 'name', 'date_of_birth', 'hobbies', 'testing_field']

def calculate_shared_hobbies(user1, user2):
    """Calculate the number of shared hobbies between two users."""
    shared_hobbies = user1.hobbies.filter(id__in=user2.hobbies.values_list('id', flat=True))
    return shared_hobbies.count()

# ==============================
# Helper Classes
# ==============================

class RemoveHobbyView(APIView):
    permission_classes = [IsAuthenticated] # Ensure the user is authenticated
    def post(self, request, user_id):
        hobby_name = request.data.get("hobby_name")

        if not hobby_name:
            return JsonResponse({"error": "Hobby name is required"}, status=400)

        user = get_object_or_404(MyUser, pk=user_id)

        try:
            # Call the remove_hobby method defined on the MyUser model
            user.remove_hobby(hobby_name)
            return JsonResponse({"message": "Hobby removed successfully"})
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)

class UpdateUserHobbiesView(APIView):
    def put(self, request, user_id):
        try:
            # Get the user object
            user = MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Extract hobbies from the request body
        hobbies_data = request.data.get('hobbies', [])

        # Update the user's hobbies
        hobbies = []
        for hobby_data in hobbies_data:
            # Assuming hobby data contains only name or id
            hobby, created = Hobby.objects.get_or_create(name=hobby_data.get('name'))
            hobbies.append(hobby)

        # Update user's hobbies
        user.hobbies.set(hobbies)
        user.save()

        # Serialize the updated user data and send it in the response
        user_serializer = MyUserSerializer(user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)

# ==============================
# Error control
# ==============================
def custom_404_view(request):
    """
    Render a custom 404 error page.
    """
    return render(request, "404.html", status=404)