
from . import database
import os

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = False

ALLOWED_HOSTS = [
    "django-psql-persistent-my-django-app.apps.a.comp-teach.qmul.ac.uk",
    "localhost",  # if you're testing locally
    "127.0.0.1:8000",
    "127.0.0.1",
    "*",
]

# cookies settings:
CSRF_COOKIE_NAME = 'csrftoken'  # Default name for the CSRF cookie
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False   
CSRF_USE_SESSIONS = False      # Store the CSRF token in cookies, not the session
CSRF_TRUSTED_ORIGINS = [
    'https://django-psql-persistent-web-apps-ec221134.apps.a.comp-teach.qmul.ac.uk',
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Explicitly allow your frontend's origin
    "http://localhost:8000",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Explicitly allow your frontend's origin
    "http://localhost:8000",
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',  
    'api',
    'rest_framework', 
    'corsheaders'
]

# Django REST Framework Authentication Classes
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',  # Enables session-based auth
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Restricts access to authenticated users
    ],
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'api.temporaryMiddleware.DisableCSRF',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]


AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'

# Database
# -------------------------------------------------------------------


# DATABASE FOR LOCAL HOSTING
DATABASES = {
    'default': database.config()
}

AUTH_USER_MODEL = "api.MyUser"

# DATABASE FOR DEPLOYMENT 
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'default',        # Changed from 'postgresql' to 'default'
#         'USER': 'django',         # POSTGRESQL_USER
#         'PASSWORD': 'm6itqvvKIl2SRpfC',  # POSTGRESQL_PASSWORD
#         'HOST': 'postgresql.web-apps-ec221134.svc.cluster.local', # PostgreSQL service name in OpenShift
#         'PORT': '5432',           # Default PostgreSQL port
#     }
# }

SECRET_KEY = os.getenv(
    'HFZQEnIf5isqEsi0nVtQlj7fVwBewklq_LbiVA8x5V1NJYKEen',
    'django-insecure-8^fq+a!kh-4pm8#y(urc^&zum$01nvb69$s=vnif(#gn6o7)_!',
)



# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    '/Users/catrionaanderson/Documents/OneDrive - Queen Mary, University of London/Documents/Creative Computing/Y3/Web dev/web-group/static',
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Not required for development


# Default primary key field type

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

INTERNAL_IPS = ['127.0.0.1']





