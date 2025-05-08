from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    paises_visitados = models.TextField(blank=True)

    class Meta:
            verbose_name = 'User'
            verbose_name_plural = 'User'

    def __str__(self):
        return f"{self.username}"
    