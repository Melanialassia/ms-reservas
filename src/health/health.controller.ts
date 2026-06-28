import { Controller, Get } from '@nestjs/common';

/**
 * Endpoint público (exento del InternalAuthGuard) para el health check de Render,
 * que consulta al microservicio directo, sin pasar por el gateway.
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
