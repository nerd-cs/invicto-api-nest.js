import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessGroup } from './user-access-group.model';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccessGroup])],
})
export class UserAccessGroupModule {}
