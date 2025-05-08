from django.contrib import admin
from apps.itineraries.models.destination import Destination
from apps.itineraries.models.itinerary import Itinerary
from apps.itineraries.models.participant import Participant

# Registrar los modelos en el admin
admin.site.register(Destination) 
admin.site.register(Itinerary) 
admin.site.register(Participant) 