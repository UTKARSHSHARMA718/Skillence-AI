import { Injectable } from '@nestjs/common';
import { VideosRepository } from './videos.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class VideosService {
  constructor(private readonly videosRepository: VideosRepository) {}

  async getTopics({
    where,
    page = 1,
    pageSize = 10,
    select,
  }: {
    where?: Prisma.VideosMetadataWhereInput;
    page?: number;
    pageSize?: number;
    select?: Prisma.VideosMetadataSelect;
  }) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const topics = await this.videosRepository.find({
      where,
      take,
      skip,
      select,
    });
    const total = await this.videosRepository.count({ where });

    return {
      topics,
      total,
      page,
      pageSize,
    };
  }

  async getTopicByIds(topicIds: string[]) {
    const topics = await this.videosRepository.find({
      where: {
        id: {
          in: topicIds,
        },
      },
    });

    return topics;
  }
}
