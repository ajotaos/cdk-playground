/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { match } from 'ts-pattern';

import type { EventBridgeEvent, Handler } from 'aws-lambda';

import type { Controller } from '#lib/controller';

import type { Event, Events } from '#shared/events';

interface EventBridgeEventWithSource<
  Source extends string,
  Type extends string,
  Detail
> extends EventBridgeEvent<Type, Detail> {
  source: Source;
}

type ToEventBridgeEventWithSource<Source extends string, E> = E extends Event<
  infer Type,
  infer Detail
>
  ? EventBridgeEventWithSource<Source, Type, Detail>
  : never;

type EventBridgeEventsWithSource = {
  [Source in keyof Events]: ToEventBridgeEventWithSource<
    Source,
    Events[Source]
  >;
}[keyof Events];

type EventBridgeHandler<Result = any> = Handler<
  EventBridgeEventsWithSource,
  Result
>;

export const handlerOf =
  (_: { controller: Controller }): EventBridgeHandler =>
  async (event) =>
    match(event).otherwise(() => null);
