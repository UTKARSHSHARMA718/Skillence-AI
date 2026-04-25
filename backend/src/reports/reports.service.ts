import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async createReport(data: Prisma.ReportsCreateInput) {
    return this.reportsRepository.create(data);
  }

  async getReports(where: Prisma.ReportsWhereInput) {
    return this.reportsRepository.find(where);
  }

  async getUniqueReport(where: Prisma.ReportsWhereUniqueInput) {
    return this.reportsRepository.findUnique(where);
  }
}
