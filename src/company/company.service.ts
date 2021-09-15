import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { UserCompany } from '../user-company/user-company.model';
import { Company } from './company.model';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getAllCompanies(user: Express.User) {
    return user['companies']
      .map((wrapper: UserCompany) => wrapper.company)
      .map((company: Company) => {
        return {
          id: company.id,
          name: company.name,
        };
      });
  }

  async getCompanyPage(dto: PaginationRequestDto) {
    const offset = dto.page ? (dto.page - 1) * dto.limit : undefined;

    const [page, total] = await this.companyRepository
      .createQueryBuilder('company')
      .select('company')
      .addSelect('count(users.userId)', 'company_members')
      .leftJoin('company.users', 'users')
      .orderBy('company.name', 'ASC')
      .groupBy('company.id')
      .addGroupBy('users.companyId')
      .skip(offset)
      .take(dto.limit)
      .getManyAndCount();

    return {
      companies: page,
      total,
    };
  }
}
