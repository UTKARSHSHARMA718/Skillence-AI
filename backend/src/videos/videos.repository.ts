import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find({
    where,
    take,
    skip,
    select,
  }: {
    where?: Prisma.VideosMetadataWhereInput;
    take?: number;
    skip?: number;
    select?: Prisma.VideosMetadataSelect;
  }) {
    return this.prisma.videosMetadata.findMany({
      where,
      take,
      skip,
      select,
    });
  }

  async count({ where }: { where?: Prisma.VideosMetadataWhereInput }) {
    return this.prisma.videosMetadata.count({
      where,
    });
  }
}
