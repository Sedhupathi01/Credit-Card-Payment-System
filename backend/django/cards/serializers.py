from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(write_only=True, required=True, min_length=13, max_length=19)
    cvv = serializers.CharField(write_only=True, required=True, min_length=3, max_length=4)
    
    class Meta:
        model = Card
        fields = ['id', 'cardholder_name', 'card_type', 'masked_number', 'last_4_digits', 'expiry_month', 'expiry_year', 'created_at', 'card_number', 'cvv']
        read_only_fields = ['masked_number', 'last_4_digits']

    def validate_card_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Card number must contain only digits.")
        return value

    def create(self, validated_data):
        card_number = validated_data.pop('card_number')
        # We don't store CVV
        validated_data.pop('cvv', None)
        
        last_4 = card_number[-4:]
        masked = '*' * (len(card_number) - 4) + last_4
        # add grouping to masked e.g. **** **** **** 1234
        # simple: just mask and add last 4
        masked = "**** **** **** " + last_4

        validated_data['masked_number'] = masked
        validated_data['last_4_digits'] = last_4
        
        user = self.context['request'].user
        validated_data['user'] = user
        
        return super().create(validated_data)
