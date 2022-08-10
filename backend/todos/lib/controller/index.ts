import { Database } from './db';

import * as events from './events';

import type { Context } from './context';

import type { Todo } from '#shared/models/todos';

export type FindManyTodos = () => Promise<{ todos: Todo[] }>;

export type FindTodoById = (input: { id: string }) => Promise<{ todo: Todo }>;

export type CreateTodo = (input: { name: string }) => Promise<{ todo: Todo }>;

export type DeleteTodo = (input: { id: string }) => Promise<{ todo: Todo }>;

export class Controller {
  findManyTodos: FindManyTodos;
  findTodoById: FindTodoById;
  createTodo: CreateTodo;
  deleteTodo: DeleteTodo;

  constructor(context: Context) {
    const db = new Database(context);

    this.findManyTodos = async () => {
      const todos = await db.todo.findMany();

      return { todos };
    };

    this.findTodoById = async (input) => {
      const todo = await db.todo.findById({ id: input.id });

      return { todo };
    };

    this.createTodo = async (input) => {
      const todo = await db.todo.create({
        name: input.name
      });

      await context.eventbridge.send(events.todoCreated({ todo }));

      return { todo };
    };

    this.deleteTodo = async (input) => {
      const todo = await db.todo.delete({ id: input.id });

      await context.eventbridge.send(events.todoDeleted({ todo }));

      return { todo };
    };
  }
}

export const controllerOf = (context: Context) => new Controller(context);
