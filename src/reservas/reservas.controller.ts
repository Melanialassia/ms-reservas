import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, Headers, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateEstadoReservaDto } from './dto/update-reserva.dto';
import { QueryReservasDto } from './dto/query-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get()
  findAll(
    @Query() query: QueryReservasDto,
    @Headers('x-user-rol') rol?: string,
    @Headers('x-cliente-id') clienteId?: string,
  ) {
    // Un cliente solo puede ver SUS reservas: forzamos el filtro con el cliente_id del
    // token (inyectado por el gateway), ignorando cualquier clienteId que venga en la query.
    if (rol === 'cliente' && clienteId) {
      query.clienteId = +clienteId;
    }
    return this.reservasService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-rol') rol?: string,
    @Headers('x-cliente-id') clienteId?: string,
  ) {
    return this.reservasService.findOne(id, this.ownerId(rol, clienteId));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReservaDto) {
    return this.reservasService.create(dto);
  }

  // PATCH /reservas/:id — actualizar estado (confirmar, cancelar, completar, no-show)
  @Patch(':id')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoReservaDto,
    @Headers('x-user-rol') rol?: string,
    @Headers('x-cliente-id') clienteId?: string,
  ) {
    return this.reservasService.updateEstado(id, dto, this.ownerId(rol, clienteId));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-rol') rol?: string,
    @Headers('x-cliente-id') clienteId?: string,
  ) {
    return this.reservasService.remove(id, this.ownerId(rol, clienteId));
  }

  // Devuelve el cliente_id (del token) solo si el rol es cliente; para admin → undefined
  // (sin restricción de dueño). Centraliza la regla usada por los endpoints por-id.
  private ownerId(rol?: string, clienteId?: string): number | undefined {
    return rol === 'cliente' && clienteId ? +clienteId : undefined;
  }
}
