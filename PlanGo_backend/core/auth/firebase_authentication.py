from functools import wraps
from config.firebase_config import firebase_admin, auth
from django.http import JsonResponse
from django.contrib.auth import get_user_model

User = get_user_model()

def firebase_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Token no proporcionado'}, status=401)

        token = auth_header.split(' ')[1]

        try:
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')
            name = decoded_token.get('name', '')
            picture = decoded_token.get('picture', '')

            # Buscar o crear el usuario en la base de datos
            user, created = User.objects.get_or_create(email=email, defaults={
                'first_name': name.split()[0] if name else '',
                'last_name': name.split()[1] if len(name.split()) > 1 else '',
                'user_image': picture,
            })

            request.user = user
            return view_func(request, *args, **kwargs)

        except Exception as e:
            return JsonResponse({'error': 'Token inválido o expirado', 'detail': str(e)}, status=401)

    return wrapper