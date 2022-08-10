import { DateTime } from 'luxon';

import type { ITodo } from './types';

import type { PrismaClient, Todo as PrismaTodo } from '@prisma/client';

export interface ITodosDbClient {
  readonly findAll: () => Promise<ITodo[]>;
  readonly findOneById: (params: { readonly id: string }) => Promise<ITodo>;

  readonly create: (params: { readonly name: string }) => Promise<ITodo>;
  readonly updateName: (params: {
    readonly id: string;
    readonly name: string;
  }) => Promise<ITodo>;
}

export interface ITodosDbClientDependencies {
  readonly id: () => string;
  readonly now: () => DateTime;
  readonly prisma: PrismaClient;
}

export class TodosDbClient implements ITodosDbClient {
  public readonly findAll: ITodosDbClient['findAll'];
  public readonly findOneById: ITodosDbClient['findOneById'];

  public readonly create: ITodosDbClient['create'];
  public readonly updateName: ITodosDbClient['updateName'];

  constructor(dependencies: ITodosDbClientDependencies) {
    this.findAll = async () => {
      const todos = dependencies.prisma.todo.findMany().then(formatTodos);

      return todos;
    };

    this.findOneById = async (params) => {
      const todo = dependencies.prisma.todo
        .findUniqueOrThrow({
          where: { id: params.id }
        })
        .then(formatTodo);

      return todo;
    };

    this.create = async (params) => {
      const id = dependencies.id();
      const now = dependencies.now();

      const todo = dependencies.prisma.todo
        .create({
          data: {
            id,
            name: params.name,
            createdAt: now.toJSDate(),
            updatedAt: now.toJSDate()
          }
        })
        .then(formatTodo);

      return todo;
    };

    this.updateName = async (params) => {
      const now = dependencies.now();

      const todo = dependencies.prisma.todo
        .update({
          data: {
            name: params.name,
            updatedAt: now.toJSDate()
          },
          where: {
            id: params.id
          }
        })
        .then(formatTodo);

      return todo;
    };
  }
}

const formatTodo = (params: PrismaTodo): ITodo => ({
  id: params.id,
  name: params.name,
  createdAt: DateTime.fromJSDate(params.createdAt, { zone: 'utc' }),
  updatedAt: DateTime.fromJSDate(params.updatedAt, { zone: 'utc' })
});

const formatTodos = (params: PrismaTodo[]): ITodo[] => params.map(formatTodo);
