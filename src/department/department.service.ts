import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Company } from '../company/company.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { DepartmentPaginationRequestDto } from '../pagination/department-pagination-request.dto';
import { UserCompany } from '../user-company/user-company.model';
import { Department } from './department.model';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async removeForCompany(company: Company) {
    return await this.departmentRepository.delete({ companyId: company.id });
  }

  async getAllForCompany(
    admin: Express.User,
    companyId: number,
    costCenter: boolean,
  ) {
    this.validateCompany(companyId, admin);

    return await this.departmentRepository
      .createQueryBuilder('department')
      .select(['id', 'name'])
      .where('company_id = :companyId', { companyId })
      .andWhere('is_cost_center = :isCostCenter', {
        isCostCenter: costCenter || false,
      })
      .getRawMany();
  }

  async getByIdAndCompany(
    departmentId: number,
    companyId: number,
    costCenter = false,
  ) {
    const department = await this.departmentRepository.findOne(departmentId, {
      where: { companyId, isCostCenter: costCenter },
    });

    if (!department) {
      throw new EntityNotFoundException({
        departmentId,
        companyId,
        costCenter,
      });
    }

    return department;
  }

  private validateCompany(companyId: number, admin: Express.User) {
    if (
      !admin['companies'].find(
        (wrapper: UserCompany) => wrapper.companyId === companyId,
      )
    ) {
      throw new EntityNotFoundException({ companyId });
    }
  }

  async getDepartmentsPage(
    dto: DepartmentPaginationRequestDto,
    admin: Express.User,
  ) {
    const offset = dto.page ? (dto.page - 1) * dto.limit : undefined;

    this.validateCompany(+dto.companyId, admin);

    const [page, total] = await this.departmentRepository
      .createQueryBuilder('department')
      .select('department')
      .addSelect('count(users.id)', 'department_members')
      .leftJoin('department.users', 'users')
      .where('department.companyId = :companyId', { companyId: dto.companyId })
      .andWhere('department.isCostCenter IS FALSE')
      .orderBy('department.name', 'ASC')
      .groupBy('department.id')
      .addGroupBy('users.department_id')
      .skip(offset)
      .take(dto.limit)
      .getManyAndCount();

    return {
      departments: page.map((department) => {
        return {
          id: department.id,
          name: department.name,
          createdAt: department.createdAt,
          members: department.members,
        };
      }),
      total,
    };
  }

  async addDepartmentsForCompany(companyId: number, departments: Department[]) {
    if (!departments?.length) {
      return [];
    }

    departments.forEach((department) => (department.companyId = companyId));

    return await this.departmentRepository.save(departments);
  }

  async removeAll(departmentIds: number[]) {
    return await this.departmentRepository.delete({ id: In(departmentIds) });
  }
}
