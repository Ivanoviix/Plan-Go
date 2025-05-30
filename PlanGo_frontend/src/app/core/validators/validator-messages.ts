// MENSAJES DE ERROR REUTILIZABLES PARA MOSTRAR EN 
// LOS FORMULARIOS POR EJEMPLO (EL TIPO DE MENSAJE A MANDAR)

// CREATE EXPENSE.
export const ValidatorMessages: { [key: string]: string } = {
    itineraryRequired: 'Debe añadir el itinerario.',
    destinationRequired: 'Debe añadir el destino.',
    payerRequired: 'Debe añadir el pagador para poder crear el gasto.',
    payerAmountRequired: 'El importe del pagador debe ser mayor que 0.',
    debtorsExceedTotal: 'La suma de los importes de los deudores no puede superar el total pagado.',
};


