import { createHandler } from '../src/events/handler';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      readonly EVENT_BUS_NAME: string;
    }
  }
}

export const handler = createHandler();
