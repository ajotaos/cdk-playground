import { TodoDatabase } from './todo';

import type { Context } from '../context';

export class Database {
  todo: TodoDatabase;

  constructor(context: Context) {
    this.todo = new TodoDatabase(context);
  }
}
