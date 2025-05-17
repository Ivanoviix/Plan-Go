from django.urls import path
from apps.users.views import RegisterView, LoginWithGoogleView, get_userId_by_userUid

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login-with-google/', LoginWithGoogleView.as_view(), name='login-with-google'),
    path('user/get_id', get_userId_by_userUid, name='get_userId_by_userUid'),
]