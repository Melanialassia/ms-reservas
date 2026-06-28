import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

// Filtro global: garantiza que NINGÚN error se escape como 500 cuando en realidad es un
// error del cliente. Traduce los errores de PostgreSQL (TypeORM QueryFailedError) al código
// HTTP correcto y normaliza el cuerpo de la respuesta a { statusCode, error, message }.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  // Mapa de códigos de error de PostgreSQL → [status HTTP, mensaje]
  private static readonly PG_ERRORS: Record<string, [number, string]> = {
    '23505': [HttpStatus.CONFLICT, 'El registro ya existe (valor duplicado)'],
    '23503': [HttpStatus.BAD_REQUEST, 'Referencia inexistente (clave foránea)'],
    '23502': [HttpStatus.BAD_REQUEST, 'Falta un campo obligatorio'],
    '23514': [HttpStatus.BAD_REQUEST, 'Un valor está fuera de los permitidos'],
    '22P02': [HttpStatus.BAD_REQUEST, 'Formato de dato inválido'],
    '22007': [HttpStatus.BAD_REQUEST, 'Formato de fecha/hora inválido'],
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        message = (body as any).message ?? message;
        error = (body as any).error ?? HttpStatus[status] ?? error;
      }
    } else if (exception instanceof QueryFailedError) {
      const code = (exception as any).code;
      const [mappedStatus, mappedMessage] =
        AllExceptionsFilter.PG_ERRORS[code] ??
        [HttpStatus.INTERNAL_SERVER_ERROR, 'Error de base de datos'];
      status = mappedStatus;
      message = mappedMessage;
      error = HttpStatus[status] as string;
    }

    // Solo logueamos los 5xx reales (errores inesperados del servidor), no los 4xx esperados.
    if (status >= 500) {
      this.logger.error(`${req.method} ${req.url} → ${status}`, (exception as any)?.stack);
    }

    res.status(status).json({ statusCode: status, error, message });
  }
}
