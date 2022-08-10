import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

import { defaultFunctionProps } from '../default-props';

import type { Construct } from 'constructs';

export interface PrismaFunctionProps extends nodejs.NodejsFunctionProps {
  readonly databaseUrl: string;
}

export class PrismaFunction extends nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props: PrismaFunctionProps) {
    super(scope, id, {
      ...defaultFunctionProps,
      ...props,
      environment: {
        ...props.environment,
        DATABASE_URL: props.databaseUrl
      },
      bundling: {
        nodeModules: ['prisma', '@prisma/client'].concat(
          props.bundling?.nodeModules ?? []
        ),
        commandHooks: {
          beforeInstall: (i, o) => [
            // Copy prisma directory to Lambda code asset
            // the directory must be located at the same directory as your Lambda code
            `cp -r ${i}/prisma ${o}`
          ],
          beforeBundling: () => [],
          afterBundling: () => []
        }
      }
    });
  }
}
