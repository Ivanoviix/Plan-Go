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
    destinations = DestinationSerializer(many=True)
    
    class Meta:
        model = Itinerary
        fields = ['itinerary_name', 'creator_user', 'create_date', 'start_date', 'end_date', 'destinations']
        ready_field = ['creator_user', 'create_date']
        
    def create(self, data):
        destination_data = data.pop('destinations')
        itinerary = Itinerary.objects.create(data)
        self_data = self.context.get('request')
        user = self_data.user if self_data else None
        
        itinerary = Itinerary.objects.create(
            creator_user=user,
            create_date=timezone.now()
            **data
        )
        for destinations in destination_data:     # Desempaqueta un diccionario y así recibir claves y valores.
            Destination.objects.create(itinerary=itinerary, **destinations)