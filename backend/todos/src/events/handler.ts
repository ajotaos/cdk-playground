import { match } from 'ts-pattern';

import type { EventSource, IEvent } from './types';

import type { EventBridgeEvent, Handler } from 'aws-lambda';

interface SourceEventBridgeEvent<
  Source extends EventSource,
  Type extends string,
  Detail
> extends EventBridgeEvent<Type, Detail> {
  source: Source;
}

type ITodosEventBridgeEvent<E extends IEvent = IEvent> = E extends IEvent
  ? SourceEventBridgeEvent<E['source'], E['type'], E['detail']>
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TodosEventBridgeHandler<Result = any> = Handler<
  ITodosEventBridgeEvent,
  Result
>;

export const createHandler = (): TodosEventBridgeHandler => async (event) =>
  await match(event)
    .with(
      { source: 'playground.todos', 'detail-type': 'TodoCreated' },
      async () => ({})
    )
    .with(
      { source: 'playground.todos', 'detail-type': 'TodoNameUpdated' },
      async () => ({})
    )
    .exhaustive();
