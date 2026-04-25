import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Reports, Role } from '@prisma/client';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from 'src/auth/dto/resgiter.dto';
import { RegisterAdminDto } from 'src/auth/dto/register-admin.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserCount({
    where,
    orderBy,
  }: {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }) {
    return this.userRepository.count({ where, orderBy });
  }

  async getUsers({
    where,
    orderBy,
    page = 1,
    pageSize = 10,
    include,
  }: {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
    page?: number;
    pageSize?: number;
    include?: Prisma.UsersInclude;
  }) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const [users, total] = await Promise.all([
      this.userRepository.find({
        where,
        skip,
        take,
        orderBy,
        include: include,
      }),
      this.userRepository.count({ where, orderBy }),
    ]);

    return { users, total };
  }

  async getUsersWithMetadata({
    where,
    orderBy,
    page = 1,
    pageSize = 10,
    include,
  }: {
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
    page?: number;
    pageSize?: number;
    include?: Prisma.UsersInclude;
  }) {
    const { users, total } = await this.getUsers({
      where,
      orderBy,
      page,
      pageSize,
      include,
    });
    const updatedUsers = users.map((user) => {
      const completedSessions = user.sessions.filter(
        (session) => session.status === 'COMPLETED',
      );
      const inProgressSessions = user.sessions.filter(
        (session) => session.status === 'IN_PROGRESS',
      );
      const totalPassSession = completedSessions.filter(
        (session) => ((session as any).report as Reports)?.overAllResult,
      ).length;

      const totalFailedSession = completedSessions.length - totalPassSession;
      return {
        ...user,
        sessions: undefined,
        totalPassSession,
        totalFailedSession,
        totalSessions: parseInt(process.env.MAX_SESSION_COUNT),
        totalInProgressSession: inProgressSessions?.length ?? 0,
      };
    });

    return { users: updatedUsers, total };
  }

  async getUniqueUser(
    where: Prisma.UsersWhereUniqueInput,
    { isPasswordIncluded = false }: { isPasswordIncluded?: boolean } = {},
  ) {
    return this.userRepository.findUnique(where, isPasswordIncluded);
  }

  async getUserProfile(where: Prisma.UsersWhereUniqueInput) {
    const user = await this.getUniqueUser(where);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      name: user.name,
      email: user.email,
      profile: user.profile,
    };
  }

  async getUserDetails(where: Prisma.UsersWhereUniqueInput) {
    const user = await this.getUniqueUser(where);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: RegisterUserDto, password: string) {
    return this.userRepository.create({
      email: data.email,
      name: data.name,
      password: password,
      profile: data.profile,
    });
  }

  async createAdmin(data: RegisterAdminDto) {
    return this.userRepository.create({
      email: data.email,
      name: data.name,
      password: data.password,
      role: Role.ADMIN,
    });
  }

  async deleteUser(where: Prisma.UsersWhereUniqueInput) {
    const user = await this.getUniqueUser(where);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.deleteUser(where);
  }

  async updateUser(
    data: Prisma.UsersUpdateInput,
    where: Prisma.UsersWhereUniqueInput,
  ) {
    const user = await this.getUniqueUser(where);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.updateUser(data, where);
  }

  async getUserProfiles() {
    return [
      {
        name: 'HR',
        slug: 'HR',
      },
      {
        name: 'Product Manager (PM)',
        slug: 'PRODUCT_MANAGER',
      },
      {
        name: 'PreSales',
        slug: 'PRESALES',
      },
      {
        name: 'Developer',
        slug: 'DEVELOPER',
      },
      {
        name: 'Demand Generation',
        slug: 'DEMAND_GENERATION',
      },
      {
        name: 'Design',
        slug: 'DESIGNING',
      },
    ];
  }
}
