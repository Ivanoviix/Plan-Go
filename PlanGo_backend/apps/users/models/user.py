from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password

class User(AbstractUser):
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    user_image = models.TextField(null=True, blank=True)
    countries_visited = models.IntegerField(default=0)
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'User'

    def __str__(self):
        return f"{self.email}"
    