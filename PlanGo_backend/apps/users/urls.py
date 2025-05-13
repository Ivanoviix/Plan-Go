from django.urls import path
from apps.users.views import RegisterView, LoginWithGoogleView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login-with-google/', LoginWithGoogleView.as_view(), name='login-with-google'),
]