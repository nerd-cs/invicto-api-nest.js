import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessGroup } from './user-access-group.model';
import { UserAccessGroupService } from './user-access-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccessGroup])],
  providers: [UserAccessGroupService],
  exports: [UserAccessGroupService],
})
export class UserAccessGroupModule {}
