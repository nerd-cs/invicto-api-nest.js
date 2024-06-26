import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.model';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
})
export class PermissionModule {}
