# Generated by Django 5.2 on 2025-05-14 19:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0003_alter_expense_options_alter_userexpense_options'),
        ('itineraries', '0007_rename_creator_first_name_itinerary_itinerary_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expense',
            name='description',
        ),
        migrations.AddField(
            model_name='expense',
            name='destination',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='expenses', to='itineraries.destination'),
        ),
    ]
