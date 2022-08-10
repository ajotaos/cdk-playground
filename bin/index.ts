#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { Backend } from '../lib/backend';

import { Todos } from '../lib/backend/services/todos';

import { Database } from '../lib/database';

const app = new cdk.App();

const backend = new Backend(app, 'Backend');

// eslint-disable-next-line no-new
new Todos(app, 'Todos', {
  database: new Database(app, 'TodosDatabase'),
  eventBus: backend.eventBus
});
