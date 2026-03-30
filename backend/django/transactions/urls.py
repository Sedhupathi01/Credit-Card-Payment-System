from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, ExportTransactionsCSVView

router = DefaultRouter()
router.register(r'', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('export/', ExportTransactionsCSVView.as_view(), name='export-transactions'),
    path('', include(router.urls)),
]
