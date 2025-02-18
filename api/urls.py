from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    HobbyViewSet,
    signup_view,
    login_view,
    logout_view,
    current_user,
    ProfileAPI,
    SimilarUsersAPI,
    check_session_view,
    RemoveHobbyView,
    FriendListView,
    SendFriendRequestView,
    FriendRequestsView,
    AcceptFriendRequestView,
    RejectFriendRequestView,
    UpdateUserHobbiesView,
)

# Define router and register viewsets
router = DefaultRouter()
router.register(r'hobbies', HobbyViewSet, basename='hobby')

# URL Patterns
urlpatterns = [
    # Vue SPA served at root
    path('', include(router.urls)),

    # API routes
    path('api/', include(router.urls)),
    path('current_user/', current_user, name='current_user'),
    path('profile/', ProfileAPI.as_view(), name='profile_api'),
    path('similar-users/', SimilarUsersAPI.as_view(), name='similar_users'),
    path('check_session/', check_session_view, name='check_session'),

    # Authentication routes
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('signup/', signup_view, name='signup'),

    # Friends and hobbies management
    path('friends/', FriendListView.as_view(), name="friend_list"),
    path("friend-requests/send/", SendFriendRequestView.as_view(), name="send_friend_request"),
    path("friend-requests/", FriendRequestsView.as_view(), name="friend_requests"),
    path("friend-requests/accept/<int:pk>/", AcceptFriendRequestView.as_view(), name="accept_friend_request"),
    path("friend-requests/reject/<int:pk>/", RejectFriendRequestView.as_view(), name="reject_friend_request"),
    path('users/<int:user_id>/remove_hobby/', RemoveHobbyView.as_view(), name="remove_hobby"),
    path('users/<int:user_id>/update_hobbies/', UpdateUserHobbiesView.as_view(), name='update_user_hobbies'),
]

# Custom error handlers
handler404 = "your_project.urls.handle_404"