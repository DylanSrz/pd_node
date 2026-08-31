/**
 * Error de negocio con el código HTTP que le corresponde.
 *
 * Los services lanzan este error cuando algo no cumple una regla,
 * por ejemplo: throw new HttpError(404, "La clínica no existe").
 *
 * El middleware error-handler lo atrapa y arma la respuesta JSON,
 * así no hay que repetir el mismo res.status(...).json(...)
 * en cada controlador.
 */
export class HttpError extends Error {
    // Código de estado HTTP que se le va a responder al cliente.
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        // super(message) guarda el mensaje en la propiedad "message"
        // que ya trae la clase Error de JavaScript.
        super(message);

        this.statusCode = statusCode;
    }
}
