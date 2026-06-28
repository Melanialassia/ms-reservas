import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasModule } from './reservas/reservas.module';
import { DisponibilidadModule } from './disponibilidad/disponibilidad.module';
import { HealthController } from './health/health.controller';
import { InternalAuthGuard } from './common/internal-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    ReservasModule,
    DisponibilidadModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: InternalAuthGuard }],
})
export class AppModule {}
