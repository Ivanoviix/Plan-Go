from django.urls import path
from .views import get_expenses, get_user_expenses, get_user_expenses_by_expense_id, get_expenses_by_destination, create_expense_with_users, expenses_with_users, get_expenses_with_names, get_expenses_with_names_by_user

urlpatterns = [
    # EXPENSES
    path('expenses/', get_expenses, name='get_expenses'),
    path('expense/destination/<int:destination_id>/', get_expenses_by_destination, name='get_expenses_by_destination'),
    path('expenses/expense/', get_expenses_with_names, name='get_expenses_with_names'),
    path('expenses/expense/user/', get_expenses_with_names_by_user, name='get_expenses_with_names_by_user'),

    # USER EXPENSES
    path('user-expenses/', get_user_expenses, name='get_user_expenses'),
    path('user-expenses/<int:expense_id>/', get_user_expenses_by_expense_id, name='get_user_expenses_by_expense_id'),

    # EXPENSES - USER EXPENSES
    path('create_expense/', create_expense_with_users, name='create_expense_with_users'),
    path('expenses_with_users/<int:destination_id>', expenses_with_users, name='expenses_with_users'),
]
