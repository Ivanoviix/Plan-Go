from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import render
from django.http import JsonResponse
from apps.places.models.accommodation import Accommodation
from apps.places.models.accommodation_image import AccommodationImage
from apps.places.models.activity import Activity
from apps.places.models.activity_image import ActivityImage
from apps.places.models.restaurant import Restaurant
from apps.places.models.restaurant_image import RestaurantImage
from apps.places.models.saved_place import SavedPlace
from apps.places.models.saved_place_image import SavedPlaceImage
from .serializer import AcommodationSerializer, ActivitySerializer, RestaurantSerializer, SavedPlacesSerializer

# Create your views here.

# ACCOMMODATION
def get_accommodations_from_destination(request, destination_id):
    accommodations = Accommodation.objects.filter(destination_id=destination_id)
    data = []
    for accommodation in accommodations:
        images = AccommodationImage.objects.filter(accommodation=accommodation)
        images_data = [img.uri for img in images]
        accommodation_data = {
            'accommodation': AcommodationSerializer(accommodation).data,
            'images': images_data
        } #    "accommodation": { ...info... },
          #    "images": ["url1", "url2", ...]
        data.append(accommodation_data)
    return JsonResponse({'accommodations': data}, safe=False)

# ACTIVITY
def get_activities_from_destination(request, destination_id):
    activities = Activity.objects.filter(destination_id=destination_id)
    data = []
    for activity in activities:
        images = ActivityImage.objects.filter(activity=activity)
        images_data = [img.uri for img in images]
        activity_data = {
            'activity': ActivitySerializer(activity).data,
            'images': images_data
        }
        data.append(activity_data)
    return JsonResponse({'activities': data}, safe=False)

# RESTAURANT
def get_restaurants_from_destination(request, destination_id):
    restaurants = Restaurant.objects.filter(destination_id=destination_id)
    data = []
    for restaurant in restaurants:
        images = RestaurantImage.objects.filter(restaurant=restaurant)
        images_data = [img.uri for img in images]
        restaurant_data = {
            'restaurant': RestaurantSerializer(restaurant).data,
            'images': images_data
        }
        data.append(restaurant_data)
    return JsonResponse({'restaurants': data}, safe=False)

# SAVED PLACES
# SAVED PLACES - Alojamientos
def get_saved_accommodations(request, user_id):
    accommodation_types = [
        'lodging', 'hotel', 'motel', 'resort_hotel', 'hostel', 'bed_and_breakfast',
        'guest_house', 'campground', 'mobile_home_park', 'cottage', 'extended_stay_hotel',
        'farmstay', 'budget_japanese_inn', 'japanese_inn', 'inn', 'private_guest_room', 'rv_park'
    ]
    saved_places = SavedPlace.objects.filter(user_id=user_id, place_type__in=accommodation_types)
    data = []
    for place in saved_places:
        images = SavedPlaceImage.objects.filter(saved_place=place)
        images_data = [img.uri for img in images]
        data.append({
            'saved_place': SavedPlacesSerializer(place).data,
            'images': images_data
        })
    return JsonResponse({'saved_accommodations': data}, safe=False)


# SAVED PLACES - Restauración / Gastronomía
def get_saved_restaurants(request, user_id):
    restaurant_types = [
        'restaurant', 'bar', 'cafe', 'bakery', 'bagel_shop', 'bar_and_grill', 'barbecue_restaurant',
        'buffet_restaurant', 'brunch_restaurant', 'breakfast_restaurant', 'burger_restaurant',
        'hamburger_restaurant', 'pub', 'fine_dining_restaurant', 'fast_food_restaurant', 'food_court',
        'meal_takeaway', 'meal_delivery', 'deli', 'confectionery', 'candy_store', 'chocolate_shop',
        'chocolate_factory', 'ice_cream_shop', 'dessert_shop', 'dessert_restaurant', 'donut_shop',
        'cafeteria', 'coffee_shop', 'juice_shop', 'wine_bar', 'sushi_restaurant', 'pizza_restaurant',
        'mexican_restaurant', 'italian_restaurant', 'indian_restaurant', 'chinese_restaurant',
        'japanese_restaurant', 'korean_restaurant', 'thai_restaurant', 'greek_restaurant',
        'french_restaurant', 'spanish_restaurant', 'american_restaurant', 'asian_restaurant',
        'african_restaurant', 'brazilian_restaurant', 'lebanese_restaurant', 'middle_eastern_restaurant',
        'mediterranean_restaurant', 'vegan_restaurant', 'vegetarian_restaurant', 'afghani_restaurant',
        'acai_shop', 'cat_cafe', 'dog_cafe'
    ]
    saved_places = SavedPlace.objects.filter(user_id=user_id, place_type__in=restaurant_types)
    data = []
    for place in saved_places:
        images = SavedPlaceImage.objects.filter(saved_place=place)
        images_data = [img.uri for img in images]
        data.append({
            'saved_place': SavedPlacesSerializer(place).data,
            'images': images_data
        })
    return JsonResponse({'saved_restaurants': data}, safe=False)


# SAVED PLACES - Actividades / Turismo
def get_saved_activities(request, user_id):
    activity_types = [
        'tourist_attraction', 'point_of_interest', 'museum', 'art_gallery', 'zoo', 'aquarium', 'park',
        'farm', 'national_park', 'state_park', 'botanical_garden', 'water_park', 'wildlife_park',
        'wildlife_refuge', 'amusement_park', 'amusement_center', 'roller_coaster', 'ferris_wheel',
        'hiking_area', 'camping_cabin', 'playground', 'bowling_alley', 'casino', 'movie_theater',
        'concert_hall', 'theater', 'opera_house', 'philharmonic_hall', 'planetarium', 'marina',
        'picnic_ground', 'off_roading_area', 'adventure_sports_center', 'childrens_camp',
        'community_center', 'visitor_center', 'event_venue', 'wedding_venue', 'monument',
        'historical_place', 'historical_landmark', 'cultural_center', 'cultural_landmark',
        'religious_site', 'church', 'synagogue', 'mosque', 'hindu_temple', 'library', 'art_studio',
        'dance_hall', 'comedy_club', 'karaoke', 'video_arcade', 'internet_cafe', 'banquet_hall',
        'auditorium'
    ]
    saved_places = SavedPlace.objects.filter(user_id=user_id, place_type__in=activity_types)
    data = []
    for place in saved_places:
        images = SavedPlaceImage.objects.filter(saved_place=place)
        images_data = [img.uri for img in images]
        data.append({
            'saved_place': SavedPlacesSerializer(place).data,
            'images': images_data
        })
    return JsonResponse({'saved_activities': data}, safe=False)