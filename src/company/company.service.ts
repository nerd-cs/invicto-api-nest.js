import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypeRole } from '../roles/roles.model';
import { Company } from './company.model';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getAllCompanies(user: Express.User) {
    if (user['roles'].includes(TypeRole.SUPER_ADMIN)) {
      return await this.companyRepository.find();
    }

    return user['companies'].map((wrapper) => wrapper.company);
  }

  async getCompanyPage(paginationDto: PaginationRequestDto) {
    return [];
  }
}
