from django.shortcuts import render
from django.http import JsonResponse
from .serializer import ItinerarySerializer, DestinationSerializer
from apps.itineraries.models.itinerary import Itinerary
from apps.itineraries.models.destination import Destination
from apps.places.models.accommodation import Accommodation
from apps.places.models.activity import Activity
from apps.places.models.restaurant import Restaurant
from apps.expenses.models.expense import Expense
from apps.users.models.user import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.db.models import Sum
from django.db import models
import json
# Create your views here.
        
# ITINERARIOS
def get_itineraries(request):
    itineraries = Itinerary.objects.all()
    if not itineraries.exists():
        return JsonResponse({'error': 'No hay itinerarios creados'}, status=404)
    data = [
        {
            'itinerary_id': i.itinerary_id,
            'itinerary_name': i.itinerary_name,
            'creator_user': i.creator_user.id if hasattr(i.creator_user, 'id') else i.creator_user,
            'creation_date': i.creation_date,
            'start_date': i.start_date,
            'end_date': i.end_date,
            'destinations_count': i.destinations.count(),
        }
        for i in itineraries
    ]
    print("PEPITO", data)
    return JsonResponse({'itineraries': data})
    
    
def get_itineraries_by_user(request, user_id):
    itineraries = Itinerary.objects.filter(creator_user=user_id)
    if not itineraries.exists():
        return JsonResponse({'error': 'No hay itinerarios creados con este usuario.'}, status=404)
    data = [
        {
            'itinerary_id': i.itinerary_id,
            'itinerary_name': i.itinerary_name, # creator_user: Usará 'id' si es una instancia del modelo User, si no usará el string o el valor directo.
            'creator_user': i.creator_user.id if hasattr(i.creator_user, 'id') else i.creator_user,
            'creation_date': i.creation_date,
            'start_date': i.start_date,
            'end_date': i.end_date,
            'destinations_count': i.destinations.count(),
        }
        for i in itineraries
    ]
    print("PEPITA", data)
    return JsonResponse({'itineraries': data})


# Un decorador que indica que una vista no requiere validación CSRF (Cross-Site Request Forgery).
@csrf_exempt
@require_POST
def create_itinerary2(request):
    data = json.loads(request.body)
    itinerary_name = data.get('itinerary_name')
    creator_user_id = data.get('creator_user_id')
    creation_date = data.get('creation_date')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    
    try:
        creator_user = User.objects.get(id=creator_user_id)
        itinerary = Itinerary.objects.create(
            itinerary_name=itinerary_name,
            creator_user=creator_user,
            creation_date=creation_date,
            start_date=start_date,
            end_date=end_date
        )
        return JsonResponse({'success': True, 'itinerary_id': itinerary.itinerary_id})
    except User.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
        
# OTRA OPCIÓN (MAS SEGURA CON SERIALIZER)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_itinerary(request):
    serializer = ItinerarySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# DESTINOS
def get_destinations(request):
    destination = Destination.objects.all()
    if not destination.exists():
        return JsonResponse({'error': 'No hay destinos creados'}, status=404)
    data = [
        {
            'destination_id': i.id,
            'itinerary_id': i.itinerary.itinerary_id if hasattr(i.itinerary, 'itinerary_id') else i.itinerary,            
            'country': i.country,
            'city_name': i.city_name,
            'start_date': i.start_date,
            'end_date': i.end_date,
        }
        for i in destination
    ]
    return JsonResponse({'destination': data})
    
    
def get_destinations_by_itinerary(request, itinerary_id):
    destination = Destination.objects.filter(itinerary=itinerary_id)
    if not destination.exists():
        return JsonResponse({'error': 'No hay destinos creados con este usuario.'}, status=404)
    data = [
        {
            'destination_id': i.id,
            'itinerary_id': i.itinerary.itinerary_id if hasattr(i.itinerary, 'itinerary_id') else i.itinerary,            
            'country': i.country,
            'city_name': i.city_name,
            'start_date': i.start_date,
            'end_date': i.end_date,
        }
        for i in destination

    ]
    return JsonResponse({'User destinations': data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_destination(request):
    serializer = DestinationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_destination(request, destination_id):
    try:
        destination = Destination.objects.get(pk=destination_id)
    except Destination.DoesNotExist:
        return Response({'error': 'Destino no encontrado'}, status=status.HTTP_404_NOT_FOUND)
                                                                    # Actualizar un dato parcialmente (fechas del destino)
    serializer = DestinationSerializer(destination, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def destination_summary(request, destination_id):
    accommodations_count = Accommodation.objects.filter(destination_id=destination_id).count()
    activities_count = Activity.objects.filter(destination_id=destination_id).count()
    restaurants_count = Restaurant.objects.filter(destination_id=destination_id).count()
    expenses = Expense.objects.filter(destination_id=destination_id)
    total_expenses = expenses.aggregate(total=models.Sum('total_amount'))['total'] or 0

    return JsonResponse({
        'accommodations_count': accommodations_count,
        'activities_count': activities_count,
        'restaurants_count': restaurants_count,
        'total_expenses': float(total_expenses),
    })