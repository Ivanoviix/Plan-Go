from django.shortcuts import render
from django.http import JsonResponse
from core.auth.firebase_authentication import firebase_login_required
from apps.users.models.user import User

# Create your views here.
# El endpoint user_profile está diseñado para 
# devolver los datos del usuario autenticado que realiza la solicitud. 
@firebase_login_required
def user_profile(request):
    user = request.user
    return JsonResponse({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'user_image': user.user_image,
        'countries_visited': user.countries_visited,
    })

def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_image': user.user_image,
            'countries_visited': user.countries_visited,
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)