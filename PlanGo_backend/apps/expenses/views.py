from django.shortcuts import render
from django.http import JsonResponse
from apps.expenses.models.expense import Expense
from apps.expenses.models.user_expense import UserExpense

# Create your views here.
# EXPENSE
def get_expenses(request):
    expenses = Expense.objects.all()
    if not expenses.exists():
        return JsonResponse({'error': 'No hay gastos creados'}, status=404)
    data = [
        {
            'expense_id': i.expense_id,
            'description': i.description,
            'total_amount': i.total_amount,
            'date': i.date,
            'paid_by_user': i.paid_by_user,
            'paid_by_name': i.paid_by_name,
        }
        for i in expenses
    ]
    return JsonResponse({'expenses': data})

def get_expenses_by_destination(request, destination_id):
    destexpenses = Expense.objects.filter(destination_id=destination_id)
    if not destexpenses.exists():
        return JsonResponse({'error' : 'No hay gastos realizados en este destino'}, status=404)
    
    data = [
        {
            'expense_id': i.expense_id,
            'description' : i.description,
            'destination': i.destination.id if i.destination else None,
            'total_amount': i.total_amount,
            'date': i.date,
            'paid_by_user': i.paid_by_user.id if i.paid_by_user else None,
            'paid_by_name': i.paid_by_name,
        }
        for i in destexpenses
    ]
    print(data)
    return JsonResponse({'destination expenses': data})
        
    
# USEREXPENSE
def get_user_expenses(request):
    user_expenses = UserExpense.objects.all()
    if not user_expenses.exists():
        return JsonResponse({'error': 'No hay usuarios con gastos creados'}, status=404)
    data = [
        {
            'user_expense_id': i.user_expense_id,
            'expense_id': i.expense.expense_id if hasattr(i.expense, 'expense_id') else i.expense,
            'user_id': i.user.id if hasattr(i.user, 'id') else i.user,
            'user_name': i.user_name,
            'amount_paid': i.amount_paid,
            'expected_share': i.expected_share,
        }
        for i in user_expenses
    ]
    return JsonResponse({'user expenses': data})
    

def get_user_expenses_by_expense_id(request, expense_id):
    user_expenses = UserExpense.objects.filter(expense_id=expense_id)
    if not user_expenses.exists():
        return JsonResponse({'error': 'No hay usuario con gastos en este gasto.'}, status=404)
    data = [
        {
            'user_expense_id': i.user_expense_id,
            'expense_id': i.expense.expense_id if hasattr(i.expense, 'expense_id') else i.expense,
            'user_id': i.user.id if hasattr(i.user, 'id') else i.user,
            'user_name': i.user_name,
            'amount_paid': i.amount_paid,
            'expected_share': i.expected_share,

        }
        for i in user_expenses
    ]
    return JsonResponse({'user expenses': data})

