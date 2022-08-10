import { handlerOf as apiHandlerOf } from './lib/api';
import { handlerOf as eventsHandlerOf } from './lib/events';

import { controllerOf } from './lib/controller';

import { PrismaClient } from '@prisma/client';

import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

import { DateTime } from 'luxon';

import { customAlphabet } from 'nanoid/async';
import { urlAlphabet } from 'nanoid';

const prisma = new PrismaClient();

const eventbridge = new EventBridgeClient({ region: 'us-east-1' });

const nanoid = customAlphabet(urlAlphabet, 21);

const now = DateTime.utc;

const controller = controllerOf({ prisma, eventbridge, nanoid, now });

export const api = apiHandlerOf({ controller });

export const events = eventsHandlerOf({ controller });
