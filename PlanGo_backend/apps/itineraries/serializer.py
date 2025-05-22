import json
from rest_framework import serializers
from .models.itinerary import Itinerary
from .models.destination import Destination
from django.utils import timezone

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = '__all__'
        
        
class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'
      

class FormItinerarySerializer(serializers.ModelSerializer):
    destinations = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = Itinerary
        fields = ['itinerary_name', 'creator_user', 'creation_date', 'start_date', 'end_date', 'destinations']

    def create(self, validated_data):
        destinations = validated_data.pop('destinations', [])
        validated_data['destinations'] = ','.join(destinations)  # Convertir a string separado por comas
        itinerary = Itinerary.objects.create(**validated_data)
        return itinerary