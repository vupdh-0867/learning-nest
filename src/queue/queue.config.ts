import { BullRootModuleOptions } from '@nestjs/bull';

export const queueConfig: BullRootModuleOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
};
