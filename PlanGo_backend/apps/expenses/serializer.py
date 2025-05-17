from rest_framework import serializers
from apps.expenses.models.expense import Expense
from apps.expenses.models.user_expense import UserExpense

class ExpenseSerializer(serializers.ModelSerializer):
        class Meta: 
            model = Expense
            fields = '__all__'
            
            # [
            #     'expense_id',
            #     'destination',
            #     'description',
            #     'total_amount',
            #     'date',
            #     'paid_by_user', 
            #     'paid_by_name',
            #      'category'
            # ]

class UserExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExpense
        fields = '__all__'
        
        # [
        #     'user_expense_id',
        #     'expense',
        #     'user',
        #     'user_name',
        #     'amount_paid',
        #     'expected_share',
        # ]