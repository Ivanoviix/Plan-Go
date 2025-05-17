from apps.expenses.models.user_expense import UserExpense
from django.http import JsonResponse
from decimal import Decimal
# USER EXPENSES

def calculate_expected_share(expense_type, users_expenses_data, amount_expense):
    data = []
    participants = len(users_expenses_data)
    total_amount = sum(Decimal(users['amount_paid']) for users in users_expenses_data)
    # CAMBIAR LO DE FLOAT A OTRA COSA Y TENER EN CUENTA EL GASTO QUE NO SE COMA LAS DECIMALES PARA NO RESTAR EL DINERO TOTAL (Descuadre de expenses)
    match expense_type:
        case 'Equalitarian':
            share = round(amount_expense / participants, 2)
            for u in users_expenses_data:
                debt = Decimal(u['amount_paid']) - share

                data.append({
                    'user_expense_id': u.get('user_expense_id'),
                    'user_name': u.get('user_name'),
                    'amount_paid': u.get('amount_paid'),
                    'expected_share': share,
                    'debt': debt,
                })
        case 'Personalized':
            for u in users_expenses_data:
                real_spent = Decimal(u.get('expected_share', 0))
                debt = Decimal(u['amount_paid']) - real_spent
                data.append({
                    'user_expense_id': u.get('user_expense_id'),
                    'user_name': u.get('user_name'),
                    'amount_paid': u.get('amount_paid'),
                    'expected_share': real_spent,
                    'debt': debt,
                })
        case _:
            share = round(amount_expense / participants, 2)
            for u in users_expenses_data:
                debt = Decimal(u['amount_paid']) - share
                data.append({
                    'user_expense_id': u.get('user_expense_id'),
                    'user_name': u.get('user_name'),
                    'amount_paid': u.get('amount_paid'),
                    'expected_share': share,
                    'debt': debt,
                })           
    return data

     

  # [
        #     'user_expense_id',
        #     'expense',
        #     'user',
        #     'user_name',
        #     'amount_paid', 0
        #     'expected_share', 30
        #     'debt', 30
        # ]