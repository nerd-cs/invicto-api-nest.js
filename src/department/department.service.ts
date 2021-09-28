import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
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
    if (
      !admin['companies'].find(
        (wrapper: UserCompany) => wrapper.companyId === companyId,
      )
    ) {
      throw new EntityNotFoundException({ companyId });
    }

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
}
