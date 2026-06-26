import { IsString, IsOptional, IsIn } from 'class-validator';

export class CancelarReservaDto {
  @IsOptional()
  @IsString()
  razonCancelacion?: string;
}

export class UpdateEstadoReservaDto {
  @IsIn(['confirmada', 'cancelada', 'completada', 'no_show'])
  estado: string;

  @IsOptional()
  @IsString()
  razonCancelacion?: string;
}
