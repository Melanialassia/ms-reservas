import { IsOptional, IsIn, IsInt, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

const ESTADOS = ['pendiente', 'confirmada', 'cancelada', 'completada', 'no_show'];

export class QueryReservasDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe ser YYYY-MM-DD' })
  fecha?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  canchaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clienteId?: number;

  @IsOptional()
  @IsIn(ESTADOS)
  estado?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limite?: number;
}
