import * as cdk from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';

import { Backend } from '../lib/backend';

test('Backend snapshot', () => {
  const app = new cdk.App();
  const backend = new Backend(app, 'Backend');

  const template = Template.fromStack(backend);

  expect(template).toMatchSnapshot();
});
