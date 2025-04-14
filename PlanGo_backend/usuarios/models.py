from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    firebase_email = models.EmailField(max_length=254, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    paises_visitados = models.TextField(blank=True)

    class Meta:
        db_table = 'Users'

    def __str__(self):
        return f"{self.username} ({self.nombre} {self.apellidos})"