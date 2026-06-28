import { Controller, Get, Query } from '@nestjs/common';
import { ReservasService } from '../reservas/reservas.service';
import { QueryDisponibilidadDto } from './dto/query-disponibilidad.dto';

@Controller('disponibilidad')
export class DisponibilidadController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get()
  getDisponibilidad(@Query() query: QueryDisponibilidadDto) {
    return this.reservasService.getDisponibilidad(query.canchaId, query.fecha);
  }
}
