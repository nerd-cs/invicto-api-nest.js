import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { UserCompany } from '../user-company/user-company.model';
import { UsersService } from '../users/users.service';
import { Company } from './company.model';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UsersService,
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

  async createCompany(dto: CreateCompanyDto, admin: Express.User) {
    await this.throwIfNameAlreadyTaken(dto.name);

    const company = await this.companyRepository.save(dto);

    await this.userService.linkNewCompany(company);

    admin['companies'].push({ companyId: company.id, company: company });

    return company;
  }

  async updateCompany(dto: UpdateCompanyDto, admin: Express.User) {
    const company = await this.getById(dto.id);

    if (dto.name && dto.name !== company.name) {
      await this.throwIfNameAlreadyTaken(dto.name);
      company.name = dto.name;
    }

    company.address = dto.address || company.address;
    company.city = dto.city || company.city;
    company.postalCode = dto.postalCode || company.postalCode;
    company.country = dto.country || company.country;

    const updated = await this.companyRepository.save(company);

    admin['companies'].find(
      (wrapper: UserCompany) => wrapper.companyId === company.id,
    ).company = updated;

    return updated;
  }

  async deleteCompany(companyId: number, admin: Express.User) {
    if (
      admin['companies'].find(
        (wrapper: UserCompany) => wrapper.companyId === companyId,
      )?.isMain
    ) {
      throw new ConstraintViolationException(
        'Impossible to remove your own company',
      );
    }

    const company = await this.getById(companyId);

    await this.userService.archiveAndUnlinkUsers(company, admin);

    const removed = await this.companyRepository.remove(company);

    admin['companies'] = admin['companies'].filter(
      (wrapper: UserCompany) => wrapper.companyId !== companyId,
    );

    return removed;
  }

  async throwIfNameAlreadyTaken(name: string) {
    if (await this.findByName(name)) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.companyRepository.findOne({ where: { name: name } });
  }

  async getById(companyId: number) {
    const company = await this.companyRepository.findOne(companyId);

    if (!company) {
      throw new EntityNotFoundException({ companyId });
    }

    return company;
  }
}
