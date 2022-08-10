import type { PrismaClient } from '@prisma/client';
import type { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import type { DateTime } from 'luxon';

export interface Context {
  prisma: PrismaClient;
  eventbridge: EventBridgeClient;
  nanoid: () => Promise<string>;
  now: () => DateTime;
}
