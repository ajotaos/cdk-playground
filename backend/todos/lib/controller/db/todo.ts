import { formatterOf } from '#shared/utils/formatter';

import {
  prismaErrorHandler,
  notFound
} from '#shared/utils/prisma-error-handler';
import { ExistingEntityError, MissingEntityError } from '#shared/errors';

import type { Context } from '../context';

import type { Todo } from '#shared/models/todos';
import type { Todo as PrismaTodo } from '@prisma/client';

import type { Formatter } from '#shared/utils/formatter';

export type FindManyTodos = () => Promise<Todo[]>;

export type FindUniqueTodoById = (input: { id: string }) => Promise<Todo>;

export type CreateTodo = (input: { name: string }) => Promise<Todo>;

export type DeleteTodo = (input: { id: string }) => Promise<Todo>;

export type TodoFormatter = Formatter<PrismaTodo, Todo>;

export const formatter: TodoFormatter = formatterOf((input) => ({
  id: input.id,
  name: input.name,
  createdAt: input.createdAt.toISOString(),
  updatedAt: input.updatedAt.toISOString()
}));

export class TodoDatabase {
  findMany: FindManyTodos;
  findById: FindUniqueTodoById;
  create: CreateTodo;
  delete: DeleteTodo;

  constructor(context: Context) {
    this.findMany = async () => {
      const todos = await context.prisma.todo.findMany().then(formatter.many);

      return todos;
    };

    this.findById = async (input) => {
      const todo = await context.prisma.todo
        .findUniqueOrThrow({
          where: { id: input.id }
        })
        .catch(
          prismaErrorHandler({
            [notFound]: () => {
              throw new MissingEntityError({
                entity: 'Todo',
                keys: ['id']
              });
            }
          })
        )
        .then(formatter.one);

      return todo;
    };

    this.create = async (input) => {
      const id = await context.nanoid();
      const createdAt = context.now();

      const todo = await context.prisma.todo
        .create({
          data: {
            id,
            name: input.name,
            createdAt: createdAt.toJSDate(),
            updatedAt: createdAt.toJSDate()
          }
        })
        .catch(
          prismaErrorHandler({
            P2002: (error) => {
              const { target: keys } = error.meta as { target: string[] };

              throw new ExistingEntityError({
                entity: 'Todo',
                keys
              });
            }
          })
        )
        .then(formatter.one);

      return todo;
    };

    this.delete = async (input) => {
      const todo = await context.prisma.todo
        .delete({
          where: { id: input.id }
        })
        .catch(
          prismaErrorHandler({
            P2025: () => {
              throw new MissingEntityError({
                entity: 'Todo',
                keys: ['id']
              });
            }
          })
        )
        .then(formatter.one);

      return todo;
    };
  }
}
