export interface Expenses {
    expense_id: number;
    itinerary_id: number;
    destination: string;
    description: string;
    total_amount: number;
    date: Date;
    paid_by_user: number;
    paid_by_name: string;
    type_expense: string;
    itinerary_name: string;
  }
