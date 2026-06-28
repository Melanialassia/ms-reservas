import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

/**
 * Garantiza que la petición llega a través del gateway (o de otro microservicio).
 * El gateway inyecta el header `x-internal-secret` (valor de INTERNAL_SECRET) en cada
 * request que proxea, y las llamadas internas entre microservicios también lo mandan.
 * Toda request directa a la URL pública del microservicio (sin el secreto) recibe 403.
 *
 * Excepciones: `OPTIONS` (preflight CORS) y `/health` (el health check de Render pega
 * directo al microservicio, sin pasar por el gateway, así que no lleva el secreto).
 */
@Injectable()
export class InternalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.method === 'OPTIONS' || req.path === '/health') return true;

    const secret = req.headers['x-internal-secret'];
    if (!secret || secret !== process.env.INTERNAL_SECRET) {
      throw new ForbiddenException('Acceso solo a través del gateway');
    }
    return true;
  }
}
