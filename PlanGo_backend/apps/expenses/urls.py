from django.urls import path
from .views import get_expenses, get_user_expenses, get_user_expenses_by_expense_id

urlpatterns = [
    #EXPENSES
    path('expenses/', get_expenses, name='get_expenses'),
    
    # USER EXPENSES
    path('user-expenses/', get_user_expenses, name='get_user_expenses'),
    path('user-expenses/<int:expense_id>/', get_user_expenses_by_expense_id, name='get_user_expenses_by_expense_id'),
]
