from django.contrib import admin
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_id', 'user', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('transaction_id', 'user__email')

class DailyPaymentSummary(Transaction):
    class Meta:
        proxy = True
        verbose_name = 'Daily Payment Summary'
        verbose_name_plural = 'Daily Payment Summaries'

@admin.register(DailyPaymentSummary)
class DailyPaymentSummaryAdmin(admin.ModelAdmin):
    change_list_template = 'admin/daily_summary_change_list.html'
    date_hierarchy = 'created_at'

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(
            request,
            extra_context=extra_context,
        )
        try:
            qs = response.context_data['cl'].queryset.filter(status='SUCCESS')
        except (AttributeError, KeyError):
            return response

        metrics = qs.annotate(date=TruncDate('created_at')).values('date').annotate(
            total_sales=Sum('amount'),
            total_transactions=Count('id')
        ).order_by('-date')

        response.context_data['summary'] = list(metrics)
        return response
