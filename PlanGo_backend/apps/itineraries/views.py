from django.shortcuts import render
from django.http import JsonResponse
from apps.itineraries.models.itinerary import Itinerary
from apps.itineraries.models.destination import Destination

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
        }
        for i in itineraries
    ]
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
        }
        for i in itineraries
    ]
    return JsonResponse({'itineraries': data})



# DESTINOS
def get_destinations(request):
    destination = Destination.objects.all()
    if not destination.exists():
        return JsonResponse({'error': 'No hay destinos creados'}, status=404)
    data = [
        {
            'itinerary_id': i.itinerary.itinerary_id if hasattr(i.itinerary, 'itinerary_id') else i.itinerary,            'country': i.country,
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
'itinerary_id': i.itinerary.itinerary_id if hasattr(i.itinerary, 'itinerary_id') else i.itinerary,            'country': i.country,
            'city_name': i.city_name,
            'start_date': i.start_date,
            'end_date': i.end_date,
        }
        for i in destination
    ]
    return JsonResponse({'User destinations': data})