import type { DateTime } from 'luxon';

export interface ITodo {
  readonly id: string;
  readonly name: string;
  readonly createdAt: DateTime;
  readonly updatedAt: DateTime;
}
