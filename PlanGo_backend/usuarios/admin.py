from django.contrib import admin
from .models import Usuario

# Registrar el modelo Usuario en el admin
admin.site.register(Usuario)