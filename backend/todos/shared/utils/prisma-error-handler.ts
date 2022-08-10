import { Prisma } from '@prisma/client';

export const notFound = Symbol('prisma-not-found-error');

export const prismaErrorHandler =
  <T>(
    handlers: Partial<{
      [code: string]: (error: Prisma.PrismaClientKnownRequestError) => T;
      [notFound]: (error: Prisma.NotFoundError) => T;
    }>
  ) =>
  (error: Error): T => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const handler = handlers[error.code];
      if (handler !== undefined) {
        return handler(error);
      }
    } else if (error instanceof Prisma.NotFoundError) {
      const handler = handlers[notFound];
      if (handler !== undefined) {
        return handler(error);
      }
    }

    throw error;
  };
