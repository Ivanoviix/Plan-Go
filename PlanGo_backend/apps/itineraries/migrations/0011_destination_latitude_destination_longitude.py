# Generated by Django 5.2 on 2025-06-01 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itineraries', '0010_alter_destination_itinerary'),
    ]

    operations = [
        migrations.AddField(
            model_name='destination',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=20, max_digits=30, null=True),
        ),
        migrations.AddField(
            model_name='destination',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=20, max_digits=30, null=True),
        ),
    ]
