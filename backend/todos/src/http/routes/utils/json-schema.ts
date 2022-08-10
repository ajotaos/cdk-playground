import type { JSONSchemaType } from 'ajv';

export const createJsonSchema = <T>(
  schema: JSONSchemaType<T>
): JSONSchemaType<T> => schema;
