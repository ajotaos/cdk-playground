import { putEventsCommandOf } from '#shared/events';

import type { Todo } from '#shared/models/todos';

const putEventsCommand = putEventsCommandOf('Todos.Playground');

export const todoCreated = (detail: { todo: Todo }) =>
  putEventsCommand({ type: 'TodoCreated', detail });

export const todoDeleted = (detail: { todo: Todo }) =>
  putEventsCommand({ type: 'TodoDeleted', detail });
