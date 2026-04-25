import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find({
    where,
    orderBy,
    skip = 0,
    take = 10,
    include,
  }: {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
    skip?: number;
    take?: number;
    include?: Prisma.UsersInclude
  }) {
    return this.prisma.users.findMany({
      where,
      orderBy,
      skip,
      take,
      include,
      omit: { password: true },
    });
  }

  async count({
    where,
    orderBy,
  }: {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }) {
    return this.prisma.users.count({ where, orderBy });
  }

  async findUnique(
    where: Prisma.UsersWhereUniqueInput,
    isPasswordIncluded: boolean = false,
  ): Promise<{
    id: string;
    email: string;
    name: string | null;
    role: $Enums.Role;
    profile: $Enums.CandidateProfile | null;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    refreshTokenRotatedAt: Date | null;
    cachedAccessToken: string | null;
    refreshToken: string | null;
  }> {
    return this.prisma.users.findUnique({
      where,
      omit: isPasswordIncluded ? undefined : { password: true },
    });
  }

  async create(data: Prisma.UsersCreateInput) {
    return this.prisma.users.create({ data });
  }

  async deleteUser(where: Prisma.UsersWhereUniqueInput) {
    return this.prisma.users.delete({ where });
  }

  async updateUser(
    data: Prisma.UsersUpdateInput,
    where: Prisma.UsersWhereUniqueInput,
  ) {
    return this.prisma.users.update({ data, where });
  }
}
