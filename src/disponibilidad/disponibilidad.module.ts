import { Module } from '@nestjs/common';
import { ReservasModule } from '../reservas/reservas.module';
import { DisponibilidadController } from './disponibilidad.controller';

@Module({
  imports: [ReservasModule],
  controllers: [DisponibilidadController],
})
export class DisponibilidadModule {}
