from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.

class User(AbstractUser):
    pass

class Setting(models.Model):
    place = models.CharField(max_length=128)
    character = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    picture = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.place} - {self.character}"

class Message(models.Model):
    number = models.IntegerField()
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="messages")
    text = models.CharField(max_length=256)
    timestamp = models.CharField(max_length=128)

class Language(models.Model):
    name = models.CharField(max_length=128)
    tag = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name} - {self.tag}"

