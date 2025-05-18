from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import render
from django.http import JsonResponse
from apps.expenses.models.expense import Expense
from apps.expenses.models.user_expense import UserExpense
from .serializer import ExpenseSerializer, UserExpenseSerializer, ExpenseWithNamesSerializer
from apps.expenses.service import calculate_expected_share


# Create your views here.
# EXPENSE
def get_expenses(request):
    expenses = Expense.objects.all()
    if not expenses.exists():
        return JsonResponse({'error': 'No hay gastos creados'}, status=404)
    data = [
        {
            'expense_id': i.expense_id,
            'destination': i.destination.id if i.destination else None,
            'description': i.description,
            'total_amount': i.total_amount,
            'date': i.date,
            'paid_by_user': i.paid_by_user.id if i.paid_by_user else None,
            'paid_by_name': i.paid_by_name,
            'type_expense': i.type_expense,
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
            'type_expense': i.type_expense,
        }
        for i in destexpenses
    ]
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
            'debt': i.debt,
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
            'debt': i.debt,

        }
        for i in user_expenses
    ]
    return JsonResponse({'user expenses': data})


# EXPENSE - USEREXPENSE

def expenses_with_users(request, destination_id):
    expenses = Expense.objects.filter(destination=destination_id)

    if not expenses.exists():
        return JsonResponse({'error' : 'No hay gastos realizados en este destino'}, status=404)
    
    for expense in expenses:
        # Filtrar UserExpenses relacionados a este expense específico
        users_expenses = UserExpense.objects.filter(expense=expense.expense_id)
        
        if not users_expenses.exists():
            return JsonResponse({'error' : 'No hay gastos realizados en este destino'}, status=404)
        
    data = []
    for expense in expenses:
        user_expense_data = [
            {
                'user_expense_id': ue.user_expense_id,
                'expense_id': ue.expense.expense_id,
                'user_id': ue.user.id if hasattr(ue.user, 'id') else ue.user,
                'user_name': ue.user_name,
                'amount_paid': ue.amount_paid,
                'expected_share': ue.expected_share,
                'debt': ue.debt,
            }
            for ue in users_expenses
        ]
    
    user_expenses_calculated = calculate_expected_share(expense.type_expense, user_expense_data, expense.total_amount)
    
    data.append({
            'expense_id': expense.expense_id,
            'destination': expense.destination.id if expense.destination else None,
            'description': expense.description,
            'total_amount': expense.total_amount,
            'date': expense.date,
            'paid_by_user': expense.paid_by_user.id if expense.paid_by_user else None,
            'paid_by_name': expense.paid_by_name,
            'type_expense': expense.type_expense,
            'user_expenses' : user_expenses_calculated
        })
    return JsonResponse({'expenses with user expenses': data})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_expense_with_users(request):
    data = request.data
    user_expenses_data = data.pop('user_expenses', [])
    expense_serializer = ExpenseSerializer(data=data)
    if expense_serializer.is_valid():
        expense = expense_serializer.save()
        for ue_data in user_expenses_data:
            ue_data['expense'] = expense.expense_id
            ue_serializer = UserExpenseSerializer(data=ue_data)
            if ue_serializer.is_valid():
                ue_serializer.save()
            else:
                return Response(ue_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(expense_serializer.data, status=status.HTTP_201_CREATED)
    return Response(expense_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# {
#   "destination": 1,
#   "description": "Cena en restaurante",
#   "total_amount": 120.00,
#   "date": "2025-05-20",
#   "paid_by_user": 2,
#   "paid_by_name": "Tomeu",
#   "user_expenses": [
#     {"user": 2, "user_name": "Tomeu", "amount_paid": 120.00, "expected_share": 40.00, "debt": 00.00},
#     {"user": 3, "user_name": "Ivan", "amount_paid": 0.00, "expected_share": 40.00, "debt": 40.00},
#     {"user": 4, "user_name": "Maria", "amount_paid": 0.00, "expected_share": 40.00, "debt": 40.00}
#   ]
# }


def get_expenses_with_names(request):
    expenses = Expense.objects.all()
    serializer = ExpenseWithNamesSerializer(expenses, many=True)
    return JsonResponse({'expenses': serializer.data})


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_expenses_with_names_by_user(request):
    user = request.user
    if not user or not user.is_authenticated:
        return JsonResponse({'error': 'Usuario no autenticado'}, status=401)
    expenses = Expense.objects.filter(paid_by_user=user)
    serializer = ExpenseWithNamesSerializer(expenses, many=True)
    return JsonResponse({'expenses': serializer.data})