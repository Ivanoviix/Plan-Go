from django.urls import path
from .views import get_accommodations_from_destination, get_activities_from_destination, get_restaurants_from_destination, get_saved_accommodations, get_saved_activities, get_saved_restaurants, google_places_search_nearby

urlpatterns = [
    # ITINERARY
    path('accommodations/<int:destination_id>/', get_accommodations_from_destination, name='get_accommodations_from_destination'),
    path('activities/<int:destination_id>/', get_activities_from_destination, name='get_activities_from_destination'),
    path('restaurants/<int:destination_id>/', get_restaurants_from_destination, name='get_restaurants_from_destination'),

    # SAVED PLACES
    path('saved_accommodations/<int:user_id>/', get_saved_accommodations, name='get_saved_accommodations'),
    path('saved_restaurants/<int:user_id>/', get_saved_restaurants, name='get_saved_restaurants'),
    path('saved_activities/<int:user_id>/', get_saved_activities, name='get_saved_activities'),
    
    # API PLACES 
    path('google_places_search_nearby/', google_places_search_nearby, name='google_places_search_nearby')
]