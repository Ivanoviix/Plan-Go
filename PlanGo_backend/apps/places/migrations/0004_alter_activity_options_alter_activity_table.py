# Generated by Django 5.2 on 2025-05-08 21:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0003_alter_activity_table'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='activity',
            options={'verbose_name': 'Activity', 'verbose_name_plural': 'Activity'},
        ),
        migrations.AlterModelTable(
            name='activity',
            table=None,
        ),
    ]
