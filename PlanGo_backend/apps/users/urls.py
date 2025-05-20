from django.urls import path
from apps.users.views import RegisterView, LoginWithGoogleView, LoginWithEmailView, get_userId_by_userUid, create_participant

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login-with-google/', LoginWithGoogleView.as_view(), name='login-with-google'),
    path('login-with-email/', LoginWithEmailView.as_view(), name='login-with-email'),
    path('user/get_id/', get_userId_by_userUid, name='get_userId_by_userUid'),
    
    # PARTICIPANT
    path('participant/create/', create_participant, name='create_participant'),
]