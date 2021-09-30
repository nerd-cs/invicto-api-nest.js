import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentService } from '../department/department.service';
import { AddDepartmentsDto } from '../department/dto/add-departments.dto';
import { CreateDepartmentDto } from '../department/dto/create-department.dto';
import { UpdateDepartmentsDto } from '../department/dto/update-departments.dto';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { UserCompany } from '../user-company/user-company.model';
import { User } from '../users/users.model';
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
    private readonly departmentService: DepartmentService,
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
    const { costCenter, departments, ...rest } = dto;

    const allDepartments = this.prepareDepartments(costCenter, departments);

    if (allDepartments?.length) {
      this.checkDepartmentNames(allDepartments);
      rest['departments'] = allDepartments;
    }

    const company = await this.companyRepository.save(rest);

    await this.userService.linkNewCompany(company);

    admin['companies'].push({ companyId: company.id, company: company });

    return company;
  }

  private prepareDepartments(
    costCenter: CreateDepartmentDto,
    departments: CreateDepartmentDto[],
  ) {
    let allDepartments = [];

    if (departments?.length) {
      allDepartments = departments;
    }

    if (costCenter) {
      allDepartments.push({ name: costCenter.name, isCostCenter: true });
    }

    return allDepartments;
  }

  private checkDepartmentNames(departments: { name: string }[]) {
    const names = departments.map((department) => department.name);

    names.forEach((name) => {
      if (names.indexOf(name) !== names.lastIndexOf(name)) {
        throw new ConstraintViolationException('Departments should be unique');
      }
    });
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
    company.updatedBy = new User();
    company.updatedBy.id = admin['id'];

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

    await this.departmentService.removeForCompany(company);

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

  async getById(companyId: number, relations: string[] = undefined) {
    const company = await this.companyRepository.findOne(companyId, {
      relations: relations,
    });

    if (!company) {
      throw new EntityNotFoundException({ companyId });
    }

    return company;
  }

  async getCompanyInfo(companyId: number) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.updatedBy', 'updatedBy')
      .where('company.id = :companyId', { companyId })
      .getOne();

    if (!company) {
      throw new EntityNotFoundException({ companyId });
    }

    const { updatedBy, ...rest } = company;

    rest['updatedBy'] = updatedBy?.fullName || null;

    return rest;
  }

  async createDepartments(companyId: number, dto: AddDepartmentsDto) {
    const company = await this.getById(companyId, ['departments']);

    const departments = this.prepareDepartments(
      dto.costCenter,
      dto.departments,
    );

    this.checkDepartmentNames(
      departments.concat(
        company.departments.map((department) => {
          return {
            name: department.name,
          };
        }),
      ),
    );

    return await this.departmentService.addDepartmentsForCompany(
      company.id,
      departments,
    );
  }

  async updateDepartments(companyId: number, dto: UpdateDepartmentsDto) {
    const company = await this.getById(companyId, ['departments']);

    const removed = [];
    const costCenters = [];

    this.checkDepartmentNames(dto.departments);

    company.departments.forEach((department) => {
      if (
        !dto.departments.find(
          (departmentDto) => departmentDto.id === department.id,
        )
      ) {
        if (department.isCostCenter) {
          dto.departments.push({
            id: department.id,
            name: department.name,
          });
          costCenters.push(department.id);
        } else {
          removed.push(department.id);
        }
      }
    });

    await this.userService.unlinkDepartments(removed);
    await this.departmentService.removeAll(removed);

    return await this.companyRepository.save({
      id: company.id,
      departments: dto.departments.map((dto) => {
        return {
          id: dto.id,
          name: dto.name,
          companyId: companyId,
          isCostCenter: costCenters.includes(dto.id),
        };
      }),
    });
  }
}
