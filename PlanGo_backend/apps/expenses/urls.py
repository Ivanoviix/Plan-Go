from django.urls import path
from .views import get_expenses, get_user_expenses, get_user_expenses_by_expense_id, get_expenses_by_destination

urlpatterns = [
    #EXPENSES
    path('expenses/', get_expenses, name='get_expenses'),
    path('expense/destination/<int:destination_id>/', get_expenses_by_destination, name='get_expenses_by_destination'),

    # USER EXPENSES
    path('user-expenses/', get_user_expenses, name='get_user_expenses'),
    path('user-expenses/<int:expense_id>/', get_user_expenses_by_expense_id, name='get_user_expenses_by_expense_id'),
]
