import { createHandler } from '../src/http/handler';

import { createEnv } from 'neon-env';
import { nanoid } from 'nanoid';

import { TodosDbClient } from '../src/todos/db';
import { TodosEventsClient } from '../src/events/client';
import { TodosController } from '../src/todos/controller';

import { PrismaClient } from '@prisma/client';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { DateTime } from 'luxon';

const env = createEnv({
  EVENT_BUS_NAME: { type: 'string' }
});

const id = () => nanoid();
const now = () => DateTime.utc();

const prisma = new PrismaClient({});
const eventBridge = new EventBridgeClient({});

const todosDb = new TodosDbClient({ id, now, prisma });

const events = new TodosEventsClient({
  eventBusName: env.EVENT_BUS_NAME,
  eventBridge
});

const todosController = new TodosController({ todosDb, events });

export const handler = createHandler({ todosController });
