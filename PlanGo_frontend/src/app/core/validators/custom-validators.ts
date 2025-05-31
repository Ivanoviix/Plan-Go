// VALIDADORES PERSONALIZADOS (QUE QUEREMOS QUE HAYA EN LOS INPUTS (LA LÓGICA))
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators {
    addDebtorError: string = '';
    
    static payerAndAmountRequired(): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
        const group = form as FormGroup;
        const payer = group.get('payer')?.value;
        const totalAmount = Number(group.get('total_amount')?.value);

        const errors: ValidationErrors = {};

        if (!payer) {
            errors['payerRequired'] = true;
            
        }
        // Solo muestra payerAmountRequired si hay pagador seleccionado
        if (payer && (!totalAmount || totalAmount <= 0)) {
            errors['payerAmountRequired'] = true;
        }

        return Object.keys(errors).length ? errors : null;
        }
    }

    static debtorsNotExceedTotalAmount(): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
            const group = form as FormGroup;
            const totalAmount = Number(group.get('total_amount')?.value);
            const debtors = group.get('debtors')?.value || [];
            const debtorsTotal = debtors.reduce(
            (sum: number, debtor: any) => sum + Number(debtor.amount || 0), 0
            );
            return debtorsTotal > totalAmount ? { debtorsExceedTotal: true } : null;
        };
    }

    static itineraryAndDestinationRequired(): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
            const group = form as FormGroup;
            const itinerary = group.get('itinerary')?.value;
            const destination = group.get('destination')?.value;
            const errors: ValidationErrors = {};
            if (!itinerary) {
                errors['itineraryRequired'] = true;
            }
            if (!destination) {
                errors['destinationRequired'] = true;
            }
            return Object.keys(errors).length ? errors : null; 
        }
    }

    static debtorsAmountRequiredPersonalized(): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
            const group = form as FormGroup;
            const typeExpense = group.get('type_expense')?.value;
            const debtors = group.get('debtors')?.value || [];
            const hasDebtorAmount = debtors.some((debtor: any) => Number(debtor.amount) > 0);
            const errors: ValidationErrors = {};
            if (typeExpense === 'Personalized' && debtors.length > 0 && !hasDebtorAmount) {
                errors['debtorsAmountRequired'] = true;
            }
            return Object.keys(errors).length ? errors : null;
        }
    }

    static debtorsSelectRequired(): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
            const group = form as FormGroup;
            console.log(group)
            const debtors = group.get('debtors')?.value || [];
            const noDebtorSelected = debtors.some((debtor: any) => !debtor.id);
            const errors: ValidationErrors = {};
            if (noDebtorSelected) {
                errors['debtorsSelectRequired'] = true;
            }
            return Object.keys(errors).length ? errors : null;
        }
    }
}

