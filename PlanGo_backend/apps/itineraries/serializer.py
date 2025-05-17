from rest_framework import serializers
from .models.itinerary import Itinerary
from .models.destination import Destination

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = '__all__'
        
        
class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'
      