export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EVENT_BUS_ARN: string;
    }
  }
}
