import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { AccessGroupModule } from '../access-group/access-group.module';
import { CardModule } from '../card/card.module';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { LocationModule } from '../location/location.module';
import { UserAccessGroupModule } from '../user-access-group/user-access-group.module';
import { UserCompanyModule } from '../user-company/user-company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RolesModule,
    AccessGroupModule,
    CardModule,
    MailModule,
    TokenModule,
    LocationModule,
    UserAccessGroupModule,
    UserCompanyModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
