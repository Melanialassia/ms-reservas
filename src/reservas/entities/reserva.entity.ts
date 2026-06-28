import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { numericTransformer } from '../../common/numeric.transformer';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cancha_id' })
  canchaId: number;

  @Column({ name: 'cliente_id' })
  clienteId: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column({ name: 'precio_total', type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer })
  precioTotal: number;

  @Column({ name: 'descuento_aplicado', type: 'decimal', precision: 5, scale: 2, default: 0, transformer: numericTransformer })
  descuentoAplicado: number;

  @Column({ name: 'sena_requerida', type: 'decimal', precision: 10, scale: 2, default: 0, transformer: numericTransformer })
  senaRequerida: number;

  // sena_pagada y pago_completo NO se almacenan: el estado de pago es dato derivado
  // de los pagos (dueño: api-pagos). Se obtiene vía GET /pagos?reservaId=.

  @Column({
    type: 'enum',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada', 'no_show'],
    default: 'pendiente',
  })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Column({ name: 'fecha_cancelacion', type: 'timestamp', nullable: true })
  fechaCancelacion: Date;

  @Column({ name: 'razon_cancelacion', type: 'text', nullable: true })
  razonCancelacion: string;
}
