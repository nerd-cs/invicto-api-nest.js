import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.model';
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

  async linkCompanyToUsers(company: Company, users: User[]) {
    const mappings = users.map((user) => {
      return {
        userId: user.id,
        companyId: company.id,
        isMain: false,
      };
    });

    return await this.userCompanyRepository.save(mappings);
  }

  async unlinkCompany(company: Company, admin: Express.User) {
    await this.userCompanyRepository.delete({
      companyId: company.id,
      isMain: false,
    });
    await this.userCompanyRepository.update(
      {
        companyId: company.id,
        isMain: true,
      },
      {
        companyId: admin['companies'].find(
          (wrapper: UserCompany) => wrapper.isMain,
        ).companyId,
      },
    );
  }
}
