from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
# Create your models here.


class Survey(models.Model):
    survey = models.JSONField(default=dict)
    def __str__(self):
        return self.survey