import { format } from 'date-fns';

export const getGreeting = () => {
    const horaActual = new Date();
    const hora = parseInt(format(horaActual, 'HH'));
    let saludo: string = "Hola que tal";

    if (hora >= 6 && hora < 12) {
        saludo = '¡Buenos días! consulta los resultados';
    } else if (hora >= 12 && hora < 18) {
        saludo = '¡Buenas tardes! consulta los resultados';
    } else {
        saludo = '¡Buenas noches! consulta los resultados';
    }
    return saludo;
};