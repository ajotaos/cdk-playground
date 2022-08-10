import { PutEventsCommand } from '@aws-sdk/client-eventbridge';

import type { todos } from '../models';

export interface Event<Type extends string, Detail> {
  type: Type;
  detail: Detail;
}

export type EventSource = 'Todos.Playground';

export interface Events extends Record<EventSource, Event<string, unknown>> {
  'Todos.Playground':
    | Event<'TodoCreated', { todo: todos.Todo }>
    | Event<'TodoDeleted', { todo: todos.Todo }>;
}

export const putEventsCommandOf =
  (source: EventSource) =>
  (events: Events[typeof source] | Events[typeof source][]) =>
    new PutEventsCommand({
      Entries: (Array.isArray(events) ? events : [events]).map((event) => ({
        EventBusName: process.env.EVENT_BUS_ARN,
        Source: source,
        DetailType: event.type,
        Detail: JSON.stringify(event.detail)
      }))
    });
