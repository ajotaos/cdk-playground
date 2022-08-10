import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';

export const defaultFunctionProps: Partial<lambda.FunctionProps> = {
  architecture: lambda.Architecture.ARM_64,
  memorySize: 256,
  timeout: cdk.Duration.seconds(15),
  logRetention: logs.RetentionDays.ONE_MONTH
};
