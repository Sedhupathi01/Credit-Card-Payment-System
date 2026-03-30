from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator

class Card(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cards')
    cardholder_name = models.CharField(max_length=100)
    card_type = models.CharField(max_length=20, choices=[('CREDIT', 'Credit'), ('DEBIT', 'Debit')], default='CREDIT')
    masked_number = models.CharField(max_length=19) # e.g. **** **** **** 1234
    last_4_digits = models.CharField(max_length=4, validators=[MinLengthValidator(4)])
    expiry_month = models.CharField(max_length=2)
    expiry_year = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'last_4_digits', 'expiry_month', 'expiry_year')

    def __str__(self):
        return f"{self.card_type} - {self.masked_number}"
