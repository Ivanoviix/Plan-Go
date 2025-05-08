from django.contrib import admin
from apps.users.models import User

# Registrar el modelo Usuario en el admin
admin.site.register(User)