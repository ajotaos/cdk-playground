export type EventSource = 'playground.todos';

export interface IEventBase<
  Source extends EventSource,
  Type extends string,
  Detail
> {
  readonly source: Source;
  readonly type: Type;
  readonly detail: Detail;
}

export type ITodoCreatedEvent = IEventBase<
  'playground.todos',
  'TodoCreated',
  { readonly todo: { readonly id: string } }
>;

export type ITodoNameUpdatedEvent = IEventBase<
  'playground.todos',
  'TodoNameUpdated',
  { readonly todo: { readonly id: string; readonly name: string } }
>;

export type IEvent = ITodoCreatedEvent | ITodoNameUpdatedEvent;
