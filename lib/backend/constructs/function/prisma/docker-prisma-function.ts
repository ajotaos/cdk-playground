import * as lambda from 'aws-cdk-lib/aws-lambda';

import { defaultFunctionProps } from '../default-props';

import type { Construct } from 'constructs';

export interface DockerPrismaFunctionProps
  extends lambda.DockerImageFunctionProps {
  readonly databaseUrl: string;
}

export class DockerPrismaFunction extends lambda.DockerImageFunction {
  constructor(scope: Construct, id: string, props: DockerPrismaFunctionProps) {
    super(scope, id, {
      ...defaultFunctionProps,
      ...props,
      environment: {
        ...props.environment,
        DATABASE_URL: props.databaseUrl
      }
    });
  }
}
