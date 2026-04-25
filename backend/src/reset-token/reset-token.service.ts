import { Injectable } from '@nestjs/common';
import { ResetTokenRepository } from './resetToken.reposiotry';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResetTokenService {
  constructor(private readonly resetTokenRepository: ResetTokenRepository) {}

  async findUnique(where: Prisma.ResetTokenWhereUniqueInput) {
    return this.resetTokenRepository.findUnique(where);
  }

  async delete(where: Prisma.ResetTokenWhereUniqueInput) {
    return this.resetTokenRepository.delete(where);
  }

  async create(data: Prisma.ResetTokenCreateInput) {
    return this.resetTokenRepository.create(data);
  }
}
