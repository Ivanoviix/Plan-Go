from django.urls import path
from .views import get_itineraries, get_itineraries_by_user, get_destinations, get_destinations_by_itinerary, create_destination, update_destination, create_itinerary, destination_summary, get_itinerary_by_id, get_countries_by_destination, get_countries_by_itinerary, google_places_autocomplete, get_csrf_token

urlpatterns = [
    path('csrf-token/', get_csrf_token, name='get_csrf_token'),
    # ITINERARIES
    path('itinerary/', get_itineraries, name='get_itineraries'),
    path('itinerary/user/<int:user_id>/', get_itineraries_by_user, name='get_itineraries_by_user'),
    path('itinerary/<int:itinerary_id>/', get_itinerary_by_id, name='get_itinerary_by_id'),
    path('itinerary/create/', create_itinerary, name='create_itinerary'),
    path('itinerary/<int:itinerary_id>/countries/', get_countries_by_itinerary, name='get_countries_by_itinerary'),
    
    # DESTINATIONS
    path('destination/', get_destinations, name='get_destinations'),
    path('destination/<int:itinerary_id>/', get_destinations_by_itinerary, name='get_destinations_by_itinerary'),
    path('destination/create/', create_destination, name='create_destination'),
    path('destination/update/<int:destination_id>/', update_destination, name='update_destination'),
    path('destination/<int:destination_id>/summary/', destination_summary, name='destination_summary'),
    path('destination/<int:destination_id>/countries/', get_countries_by_destination, name='get_countries_by_destination'),


    # API 
    path('google-places-autocomplete/', google_places_autocomplete, name='google_places_autocomplete'),

]
