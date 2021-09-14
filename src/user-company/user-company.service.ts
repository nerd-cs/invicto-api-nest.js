import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';
import { UserCompany } from './user-company.model';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>,
  ) {}

  async updateUserCompany(user: User, companyId: number) {
    return await this.userCompanyRepository.update(
      {
        userId: user.id,
        isMain: true,
      },
      {
        companyId,
      },
    );
  }
}
