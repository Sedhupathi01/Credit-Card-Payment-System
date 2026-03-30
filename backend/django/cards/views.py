from rest_framework import viewsets, permissions
from .models import Card
from .serializers import CardSerializer

class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)
