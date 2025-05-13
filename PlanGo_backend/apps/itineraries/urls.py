from django.urls import path
from .views import get_itineraries, get_itineraries_by_user, get_destinations, get_destinations_by_itinerary

urlpatterns = [
    # ITINERARIES
    path('itinerary/', get_itineraries, name='get_itineraries'),
    path('itinerary/<int:user_id>/', get_itineraries_by_user, name='get_itineraries_by_user'),
    
    # DESTINATIONS
    path('destination/', get_destinations, name='get_destinations'),
    path('destination/<int:itinerary_id>/', get_destinations_by_itinerary, name='get_destinations_by_itinerary'),
]
