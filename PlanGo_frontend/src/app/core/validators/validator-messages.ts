// MENSAJES DE ERROR REUTILIZABLES PARA MOSTRAR EN 
// LOS FORMULARIOS POR EJEMPLO (EL TIPO DE MENSAJE A MANDAR)

// CREATE EXPENSE.
export const ValidatorMessages: { [key: string]: string } = {
    itineraryRequired: 'Debe añadir el itinerario.',
    destinationRequired: 'Debe añadir el destino.',
    payerRequired: 'Debe añadir el pagador.',
    payerAmountRequired: 'Debe añadir un valor mayor a 0',
    debtorsExceedTotal: 'La suma del importe del deudor no puede superar el total pagado.',
    debtorsAmountRequired: 'Debe añadir un valor mayor a 0',
    debtorsSelectRequired: 'Este campo no puede estar vacío.',
    itineraryendDateAfterstartDate: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
    itineraryDatesRequired: 'Selecciona ambas fechas',
    participantDuplicate: 'Ya existe un participante con ese nombre en este destino.',
    participantAddError: 'Algo falló, no se han creado los participantes.',
};


