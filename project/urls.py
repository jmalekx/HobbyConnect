
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.http import HttpResponse
from django.views.generic import TemplateView
from api.views import signup_view, login_view  # Import the signup view


urlpatterns = [
    # Admin check
    path('admin/', admin.site.urls),

    # API routes (namespaced under /api/)
    path('api/', include('api.urls')),

    # Frontend routes
    path('signup/', signup_view, name='signup'),  # Signup page
    path('login/', login_view, name='login'),  # Signup page
    path('', TemplateView.as_view(template_name="index.html"), name='home'),  # Vue app served at root
]