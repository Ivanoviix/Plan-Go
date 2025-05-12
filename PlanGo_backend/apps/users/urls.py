from django.urls import path
from .views import get_user_by_id, user_profile

urlpatterns = [
    # Ejemplo: http://127.0.0.1:8000/users/user/1/
    path('user/<int:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('user/profile/', user_profile, name='user_profile'),
]