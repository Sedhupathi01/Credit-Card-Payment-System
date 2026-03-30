from rest_framework import viewsets, permissions, views
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Transaction
from .serializers import TransactionSerializer
import csv
from datetime import datetime

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            qs = Transaction.objects.all()
        else:
            qs = Transaction.objects.filter(user=user)
        
        # Filtering
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
            
        min_amount = self.request.query_params.get('min_amount')
        if min_amount:
            qs = qs.filter(amount__gte=min_amount)
            
        max_amount = self.request.query_params.get('max_amount')
        if max_amount:
            qs = qs.filter(amount__lte=max_amount)
            
        date_from = self.request.query_params.get('date_from')
        if date_from:
            qs = qs.filter(created_at__gte=date_from)
            
        date_to = self.request.query_params.get('date_to')
        if date_to:
            qs = qs.filter(created_at__lte=date_to)
            
        return qs.order_by('-created_at')

class ExportTransactionsCSVView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        today = datetime.now().strftime('%Y-%m-%d')
        response['Content-Disposition'] = f'attachment; filename="transactions_{today}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Transaction ID', 'User Email', 'Amount', 'Currency', 'Status', 'Date'])

        transactions = Transaction.objects.all().order_by('-created_at')
        for txn in transactions:
            writer.writerow([txn.transaction_id, txn.user.email, txn.amount, txn.currency, txn.status, txn.created_at])

        return response
