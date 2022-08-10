import * as cdk from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';

import { Backend } from '../lib/backend';

test('Backend stack snapshot matches', () => {
  const app = new cdk.App();
  const backend = new Backend(app, 'Backend');

  const template = Template.fromStack(backend);

  expect(template).toMatchSnapshot();
});
