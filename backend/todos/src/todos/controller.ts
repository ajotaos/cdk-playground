import type { ITodo } from './types';

import type { ITodosDbClient } from './db';
import type { ITodosEventsClient } from '../events/client';

export interface ITodosController {
  readonly findAll: () => Promise<ITodo[]>;
  readonly findOneById: (params: { readonly id: string }) => Promise<ITodo>;

  readonly create: (params: { readonly name: string }) => Promise<ITodo>;
  readonly updateName: (params: {
    readonly id: string;
    readonly name: string;
  }) => Promise<ITodo>;
}

export interface ITodosControllerDependencies {
  readonly todosDb: ITodosDbClient;
  readonly events: ITodosEventsClient;
}

export class TodosController implements ITodosController {
  public readonly findAll: ITodosController['findAll'];
  public readonly findOneById: ITodosController['findOneById'];

  public readonly create: ITodosController['create'];
  public readonly updateName: ITodosController['updateName'];

  constructor(dependencies: ITodosControllerDependencies) {
    this.findAll = async () => {
      const todos = await dependencies.todosDb.findAll();

      return todos;
    };

    this.findOneById = async (params) => {
      const todo = await dependencies.todosDb.findOneById({ id: params.id });

      return todo;
    };

    this.create = async (params) => {
      const todo = await dependencies.todosDb.create({ name: params.name });

      await dependencies.events.todoCreated({ todo });

      return todo;
    };

    this.updateName = async (params) => {
      const todo = await dependencies.todosDb.updateName({
        id: params.id,
        name: params.name
      });

      await dependencies.events.todoNameUpdated({ todo });

      return todo;
    };
  }
}
