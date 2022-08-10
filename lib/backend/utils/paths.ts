import { join } from 'node:path';

export const backendPathOf =
  (service: string) =>
  (...components: readonly string[]) =>
    join('backend', service, ...components);
