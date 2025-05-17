from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from apps.users.models.user import User
import json
from firebase_admin import auth
from config.firebase_config import *
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from apps.users.service import split_full_name

# USERS
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Token no proporcionado'}, status=401)

            token = auth_header.split(' ')[1]

            # Verifica el token de Firebase
            try:
                decoded_token = auth.verify_id_token(token)
                uid = decoded_token['uid']
                print("Token válido. UID:", uid)
            except Exception as e:
                return JsonResponse({'error': 'Token inválido o expirado'}, status=401)

            # Procesa los datos del cuerpo de la solicitud
            data = json.loads(request.body)
            email = data.get('email')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            firebase_user = auth.get_user(uid)
            profile_image = firebase_user.photo_url
            
            # Crea un nuevo usuario en la base de datos de Django
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'firebase_uid': uid,
                    'user_image': profile_image
                }
            )

            if not created:
                return JsonResponse({'error': 'El usuario ya existe'}, status=400)

            return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)
        except Exception as e:
            print("Error en el backend:", str(e))
            return JsonResponse({'error': str(e)}, status=400)
       
        
@method_decorator(csrf_exempt, name='dispatch')
class LoginWithGoogleView(View):
    def post(self, request, *args, **kwargs):
        try:
            # Obtén el token del encabezado Authorization
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Token no proporcionado'}, status=401)

            token = auth_header.split(' ')[1]

            # Verifica el token de Firebase
            try:
                decoded_token = auth.verify_id_token(token)
                uid = decoded_token['uid']
                print("Token válido. UID:", uid)
            except Exception as e:
                return JsonResponse({'error': 'Token inválido o expirado'}, status=401)

            # Si faltan nombre o apellidos, extraerlos desde Firebase
            firebase_user = auth.get_user(uid)
            full_name = firebase_user.display_name or ""
            profile_image = firebase_user.photo_url
            first_name, last_name = split_full_name(full_name)
            username = f"{first_name[0]}{last_name.split(" ")[0]}".lower()
            email = decoded_token['email']
            print("HOLAAA", email)
            # Busca o crea el usuario en la base de datos de Django
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'firebase_uid': uid,
                    'user_image': profile_image,
                    'username': username
                }
            )

            if created:
                print("Usuario creado en Django:", user.email)
            else:
                print("Usuario ya existente en Django:", user.email)

            return JsonResponse({'message': 'Usuario autenticado exitosamente'}, status=200)
        except Exception as e:
            print("Error en el backend:", str(e))
            return JsonResponse({'error': str(e)}, status=400)
       

@csrf_exempt
def get_userId_by_userUid(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        uid = data.get('uid')
        try:
            user = User.objects.get(firebase_uid=uid)
            return JsonResponse({'id': user.id})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


# PARTICIPANTS