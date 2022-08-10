import { PutEventsCommand } from '@aws-sdk/client-eventbridge';

import type { IEvent } from './types';

import type { EventBridgeClient } from '@aws-sdk/client-eventbridge';

type ITodosEvent = Extract<IEvent, { readonly source: 'playground.todos' }>;

type FindEventByType<Type extends ITodosEvent['type']> = Extract<
  ITodosEvent,
  { readonly type: Type }
>;

type PutEvent<Type extends ITodosEvent['type']> = (
  detail: FindEventByType<Type>['detail']
) => Promise<void>;

export interface ITodosEventsClient {
  readonly todoCreated: PutEvent<'TodoCreated'>;
  readonly todoNameUpdated: PutEvent<'TodoNameUpdated'>;
}

export interface ITodosEventsClientDependencies {
  readonly eventBusName: string;
  readonly eventBridge: EventBridgeClient;
}

export class TodosEventsClient implements ITodosEventsClient {
  public readonly todoCreated: ITodosEventsClient['todoCreated'];
  public readonly todoNameUpdated: ITodosEventsClient['todoNameUpdated'];

  constructor(dependencies: ITodosEventsClientDependencies) {
    type ITodosEventWithoutSource<E extends ITodosEvent = ITodosEvent> =
      E extends ITodosEvent ? Omit<E, 'source'> : never;

    const putEvents = async (
      events: ITodosEventWithoutSource | ITodosEventWithoutSource[]
    ) =>
      await dependencies.eventBridge.send(
        new PutEventsCommand({
          Entries: (Array.isArray(events) ? events : [events]).map((event) => ({
            EventBusName: dependencies.eventBusName,
            Source: 'playground.todos',
            DetailType: event.type,
            Detail: JSON.stringify(event.detail)
          }))
        })
      );

    this.todoCreated = async (detail) => {
      await putEvents({
        type: 'TodoCreated',
        detail
      });
    };

    this.todoNameUpdated = async (detail) => {
      await putEvents({
        type: 'TodoNameUpdated',
        detail
      });
    };
  }
}
