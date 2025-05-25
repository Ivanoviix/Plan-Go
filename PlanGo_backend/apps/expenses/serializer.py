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
        

class ExpenseWithNamesSerializer(serializers.ModelSerializer):
    itinerary_name = serializers.SerializerMethodField()
    destination_name = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = ['expense_id', 'description', 'total_amount', 'date', 'paid_by_user', 'paid_by_name', 'type_expense', 'itinerary_name', 'destination_name']

    def get_itinerary_name(self, obj):
        if obj.destination and obj.destination.itinerary:
            return obj.destination.itinerary.itinerary_name
        return None

    def get_destination_name(self, obj):
        if obj.destination:
            return obj.destination.city_name
        return None
    
    
class InsertExpenseSerializer(serializers.ModelSerializer):
    user_Expense = serializers.SerializerMethodField()
    
    class Meta: 
        model = Expense
        fields = ['expense_id', 'description', 'total_amount', 'date', 'paid_by_user', 'paid_by_name', 'type_expense', 'itinerary_name', 'destination_name', 'user_expense_id', 'user', 'user_name', 'amount_paid', 'expected_share', 'debt']

    def get_User_Expenses(self, obj):
        if obj.userexpense:
            return obj
        return None
    
# resultado = {
#     expense_id: auto,
#     date: today,
#     itinerary_name: string,
#     destination_name: string,
#     paid_by_user: number,
#     paid_by_name: string,
#     total_amount: float,
#     description: string,
#     user: number maybe null, 
#     user_name: string maybe null,
#     expected_share: float, 
#     debt: float,
      
# }